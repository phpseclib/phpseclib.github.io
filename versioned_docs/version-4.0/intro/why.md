---
title: Why phpseclib?
---

phpseclib provides pure-PHP implementations of SSH2, SFTP, RSA, DSA, Elliptic Curves, AES, ChaCha20, X.509, CSR, CRL, SPKAC, PFX/PKCS#12, CMS, etc.

## Portability

The only requirement that phpseclib 4.0 has is that you must be using PHP 8.1.0+.

Extensions like bcmath, gmp, libsodium and openssl, if they're available, for speed, but they're not required.

## phpseclib 4.0 vs phpseclib 3.0

Given that phpseclib 3 will continue to be supported for the foreseeable future (just as phpseclib 2 has yet to be EOL'd, there's no reason to assume v3 will be EOL'd even years out), one might wonder why they should expend the energy to upgrade to v4. Among other things, v4 adds features that really weren't possible with v3, and it addresses a number of pain points with v3.

### Dedicated X.509, CSR, CRL, SPKAC classes

In phpseclib 3, all four formats lived inside a single `File\X509` super-class. You'd `new X509()` and then call `loadX509()` or `loadCSR()` or `loadCRL()` or `loadSPKAC()` on the same object, and the object would change personality depending on what you'd loaded into it most recently. Saving worked the same way (`saveX509()`, `saveCSR()`, `saveCRL()`, `saveSPKAC()`), and the methods you could meaningfully call between load and save depended on which kind of file you were holding. The class was big, the modes overlapped in unexpected places, and the type system couldn't help you tell a "CSR mode" `X509` apart from a "cert mode" one.

In phpseclib 4 each format gets its own class:

```php
use phpseclib4\File\X509;
use phpseclib4\File\CSR;
use phpseclib4\File\CRL;
use phpseclib4\File\SPKAC;

$x509 = X509::load(file_get_contents('cert.pem'));
$csr  = CSR::load(file_get_contents('req.csr'));
$crl  = CRL::load(file_get_contents('list.crl'));
```

That gives you smaller, more focused classes, proper types you can write in your own function signatures, and an API surface where every method on every class is unambiguously applicable to the file it lives on. PEM output is via `echo $csr` (or `(string) $csr`); binary DER is via `$csr->toString(['binary' => true])`.

See the per-class references for the full API: [X509](../file/x509.mdx), [CSR](../file/csr.mdx), [CRL](../file/crl.mdx), [SPKAC](../file/spkac.mdx).

### Brand-new PFX and CMS support

phpseclib 4 adds first-class support for two formats that 3.0 didn't cover at all:

- **`phpseclib4\File\PFX`** for reading and writing password-protected PFX / PKCS#12 bundles (certificates + private keys + metadata; the format Windows and Apple Keychain use for identity import/export). See [the PFX reference](../file/pfx.mdx).
- **`phpseclib4\File\CMS`** for reading and writing [CMS / PKCS#7 envelopes](../cms/overview.md): `SignedData`, `EnvelopedData`, `EncryptedData`, `CompressedData`, `DigestedData`. Files with `.p7m` / `.p7s` extensions.

3.0 codebases that needed either of these had to fall back on PHP's `openssl_pkcs12_*` / `openssl_cms_*` functions or shell out to the `openssl` CLI. In 4.0 it's all native. See the OpenSSL comparison below for what phpseclib's versions do that PHP's `openssl_*` bindings don't.

### Signatures that don't make you grimace

In phpseclib 3, signing a certificate looked like this:

```php
$result = $x509->sign($issuer, $subject);
$x509->saveX509($result);
```

That's the canonical example straight out of the 3.x docs. Take a moment to look at it.

Why are there three `X509` instances? The `$x509` we're calling `sign()` on, plus an `$issuer` we're passing in, plus a `$subject`. What does the receiver `$x509` even contribute?

Could we collapse it to `$issuer->sign($issuer, $subject)`? Sure, that would probably work. But then why are we passing the object we're invoking the method on back into the method as an argument? `BigInteger` doesn't do that. `$a->add($b)` returns `$a + $b`; nobody writes `$a->add($a, $b)`. So `$issuer->sign($issuer, $subject)` is more "mangled," not less.

OK, so let's take the receiver out entirely. Two cleaner options:

```php
X509::sign($issuer, $subject);   // static
$issuer->sign($subject);          // instance, but only the issuer
```

Either of those reads better than the 3.x version. But neither one is complete, because *signing requires a private key*, and a bare `X509` doesn't have one. In 3.x the workaround was to load the CA's private key into `$issuer` via a separate `setPrivateKey()` call before signing. That works, but it makes the cert object secretly a keystore: a certificate that's also carrying a private key around, with no type-level hint that this is happening.

If only there were a standard format for a certificate-plus-private-key bundle. Something the rest of the world already uses for exactly this case. 🤔 Oh, wait, there is. It's PFX / PKCS#12.

So in phpseclib 4, the signer is whatever object actually has the signing material. If you have a bare private key, you sign with the key. If you have a CA cert and its key together, you sign with a `PFX`:

```php
$priv->sign($x509);    // private key signs the cert
$pfx->sign($x509);     // CA's PFX signs the cert (and auto-fills issuer DN, AKI, etc.)
echo $x509;             // PEM of the signed cert, either way
```

The thing being signed is anything that implements `Signable`: `X509`, `CSR`, `CRL`, `SPKAC`, or `CMS\SignedData`. Same shape whether you're signing a CSR you got from a customer, building a CRL, or producing a CMS-signed document. Raw byte signing (`$priv->sign($bytes)` returning the raw signature) works identically; `$bytes` is just one of several things you can pass.

The signing surface is covered in detail in the [PFX](../file/pfx.mdx), [X509](../file/x509.mdx), [CSR](../file/csr.mdx), [CRL](../file/crl.mdx), and [CMS SignedData](../cms/signed.mdx) references.

### Hardened ASN.1 parsing

This one is worth a moment.

Every X.509 / CSR / CRL / PFX / CMS object phpseclib hands you is, underneath, a parsed ASN.1 structure. ASN.1 parsing is historically a *minefield* for security bugs: deeply nested structures, oversized OIDs, length-of-length fields that recurse forever. These are the kinds of inputs that have produced CVEs in OpenSSL, GnuTLS, NSS, and basically every other major TLS implementation, year after year.

phpseclib 3 parsed ASN.1 eagerly. `decodeBER()` consumed the entire input and produced a deeply nested array reflecting the whole structure, *then* the schema check ran on the result. That meant any pathological interior content (say, a single OID encoded with a giant `BigInteger` whose arithmetic balloons during decode) got fully decoded before phpseclib knew whether the surrounding structure was even valid. Defenses had to be added field by field as the attack patterns were discovered. Classic whack-a-mole.

phpseclib 4 parses lazily and shape-first. `decodeBER()` returns a one-level summary; nested constructed types appear as `phpseclib4\File\ASN1\Constructed` objects that decode only when something actually reaches into them. The schema check runs against the shallow structure first, and the interior is only decoded if the schema is happy. Combined with hard caps on things like OID encoded length, this architecturally eliminates the parser-DoS attack surface: the malicious bytes never reach a parser that could be tricked into running expensive operations on them.

This is the kind of change that's invisible if your inputs are all well-formed (which they usually are), and it's the kind of change you can't easily backport without rewriting the parser, which is what 4.0 did.

If you're parsing custom ASN.1 with `ASN1::decodeBER()` directly, the [Deep Dive: ASN1\Constructed Objects](../file/detail-constructed.mdx) reference walks through what the new shape looks like and how to work with it.

### Type hints throughout

phpseclib 3 had to run on PHP 5.6, which meant no scalar type declarations, no return types, no nullable types, no typed properties, no union types. phpseclib 4 requires PHP 8.1, and uses all of the above. That means:

- **Bugs surface at the call site.** Pass a string where a `BigInteger` is expected and you get a `TypeError` immediately, not a confusing failure five frames deeper. For a crypto library where a wrong type can be the difference between secure and broken, this matters.
- **Signatures are self-documenting.** `public function sign(string $message): string` tells you everything you need to know without reading the docblock.
- **IDEs and static analyzers can do real work.** PHPStan, Psalm, PhpStorm autocomplete, "find usages": all of these get more accurate when the library is properly typed.

### Other notable changes

- **`Crypt\Random` is gone.** Use PHP's built-in `random_bytes()`.
- **Exceptions instead of `false` returns** in most places, with a consistent [`phpseclib4\Exception\`](../exceptions/overview.md) hierarchy (v3 threw a mix of `\RuntimeException`, `\UnexpectedValueException`, etc., for effectively identical conditions). Recursive SFTP operations like `delete()` on a directory tree are the exception (they keep going past partial failures and report via `SFTP::getErrors()`). See the [migration guide](migrating.md) for the details.
- **`SFTP::chmod()` argument order swapped.** It's `chmod($path, $mode)` now, consistent with every other SFTP method. (3.0 had `chmod($mode, $path)`, the lone outlier.)

The namespace has also been changed from `\phpseclib3` to `\phpseclib4`.

For specifics on how to migrate, see [Migrating from 3.0](migrating.md).

phpseclib 1.0 / 2.0 documentation lives at http://phpseclib.sourceforge.net/

## phpseclib3_compat

Due to the namespace change, phpseclib 4.0 can be used to emulate phpseclib 3.0. [phpseclib3_compat](https://github.com/phpseclib/phpseclib3_compat) does just that. So let's say you want to use phpseclib 4 but some of your dependencies are still using phpseclib 3. In this scenario you can require phpseclib/phpseclib:~4.0 and phpseclib/phpseclib3_compat:~1.0 and your dependencies will then start using phpseclib 4 even if they don't know it.

The same arrangement still works for older code via [phpseclib2_compat](https://github.com/phpseclib/phpseclib2_compat), which can be layered on top of phpseclib3_compat. So if you have a dependency chain that includes a phpseclib 2-era package, a phpseclib 3-era package, and your own phpseclib 4 code, all three can coexist in a single `composer install`.

## phpseclib vs libsodium

libsodium is the latest hotness in PHP cryptography but there's a lot of things phpseclib does that libsodium doesn't even pretend to do. phpseclib provides an SSH2 implementation, an SFTP implementation, an X.509 implementation, CSR, CRL, PFX, CMS, BigInteger, etc. libsodium doesn't aim to provide any of these things.

In so far as cryptographic applications are concerned, libsodium trades flexibility for security. If you need to use AES-128-CBC, RSA or ECDSA / ECDH with nistp256 or secp256k1 (aka the bitcoin curve) or any other algorithm that [isn't explicitly supported by libsodium](https://wiki.php.net/rfc/libsodium) you're out of luck.

Of course, if you don't need phpseclib's flexibility, libsodium should be given serious consideration.

## Comparison to OpenSSL in PHP

There are a lot of things phpseclib provides that PHP's OpenSSL bindings don't even aim to provide (SSH, SFTP, BigInteger, etc.), and for those the comparison is trivial: PHP's OpenSSL doesn't do it, phpseclib does.

For the things PHP's OpenSSL bindings *do* cover, there's still a lot phpseclib does better. Some of the more useful gaps:

### CMS / PKCS#7 signing

[`openssl_cms_sign()`](https://www.php.net/openssl-cms-sign) doesn't do [CAdES-B](https://en.wikipedia.org/wiki/CAdES_(computing)) / [ESS](https://datatracker.ietf.org/doc/html/rfc5035) compliant signatures, it only does one signature, and you can't add additional SignedAttrs. phpseclib can and does do CAdES-B / ESS compliant signatures, it can do multiple signatures, and you can add all the SignedAttrs you want.

[`openssl_cms_verify()`](https://www.php.net/openssl-cms-verify) verifies all signatures and that's it. With phpseclib you can see how many signers exist, you can see which of those signers have valid signatures and which ones don't, and, when phpseclib is validating signatures, it takes CAdES-B / ESS into consideration.

### CMS encryption

[`openssl_cms_encrypt()`](https://www.php.net/openssl-cms-encrypt) does not support EncryptedData, and in-so-far as EnvelopedData is concerned, only supports KeyAgreeRecipient and KeyTransRecipient types. phpseclib, on the other hand, supports those *and* KEKRecipient and PasswordRecipient. Furthermore, `openssl_cms_encrypt` does not support multiple recipients whereas phpseclib's EnvelopedData does.

[`openssl_cms_decrypt()`](https://www.php.net/openssl-cms-decrypt) has all the same limitations.

### CRL handling

PHP's OpenSSL bindings don't have any CRL support at all. phpseclib has a full `phpseclib4\File\CRL` class: load a CRL, inspect its contents, build one, sign one, validate one against a CA.

phpseclib also handles real-world CRL ergonomics that, as far as we know, no other X.509 implementation does. Real-world CRLs can be large (multi-megabyte is common for big CAs), and re-downloading them on every signature check is unworkable. CRLs carry `thisUpdate` and `nextUpdate` fields specifically so that consumers can cache them, but actually wiring that caching into your validation path is something every other X.509 implementation we've looked at leaves entirely to the caller. phpseclib gives you `X509::setCRLLookupCallback()`: a hook where you wire up whatever cache backend you want (MySQL, MongoDB, the local filesystem, whatever) and `$x509->validateSignature()` uses it transparently. See [Using CRLs in Practice](../file/crl.mdx#using-crls-in-practice) for the full pattern.

### X.509 editability

PHP's OpenSSL bindings let you read certificates (`openssl_x509_parse`) and produce signed ones from a CSR-shaped intent (`openssl_csr_sign`), but they don't give you a way to *edit* a parsed certificate field-by-field. You can't load a cert, swap out an extension, and re-serialize it. You can't twiddle a single byte of a SignedAttr and see what happens.

phpseclib's [X509](../file/x509.mdx) (and [CSR](../file/csr.mdx), [CRL](../file/crl.mdx), [SPKAC](../file/spkac.mdx), and CMS) objects implement `ArrayAccess` over their parsed ASN.1 structures. Every field is reachable both via a helper method (`getSubjectDN()`, `getExtension()`) *and* via the array path (`$x509['tbsCertificate']['subject']`, `$x509['tbsCertificate']['extensions']`). The two paths return the same typed objects; ArrayAccess isn't a lower-level escape hatch, it's a parallel API. The [Deep Dive: ASN1\Constructed Objects](../file/detail-constructed.mdx) reference covers the parallel API in detail.

That fine granularity is what makes serious work possible. Want to produce intentionally malformed certificates to fuzz a TLS implementation? phpseclib has an explicit escape hatch, `phpseclib4\File\ASN1\Element`, that lets you substitute raw DER bytes anywhere phpseclib would normally accept a value to encode. Want to register a custom extension OID so phpseclib understands a private-CA extension? `X509::registerExtension()`. Want to copy one field from one cert to another? Trivial. With PHP's OpenSSL bindings, none of that is reachable: you get the fields the parser chose to expose, in the format the parser chose to expose them in, and that's it.

### OpenSSL catches up to phpseclib 3

A lot of the "phpseclib does things PHP's OpenSSL bindings don't" pitch dates from when that was simply true across the board. phpseclib 3.0 shipped on December 17, 2020, only about three weeks after PHP 8.0.0. At the time, PHP's OpenSSL bindings couldn't do EC keys with arbitrary curves, couldn't do ECDH, couldn't do AEAD with ChaCha20-Poly1305, couldn't do Ed25519, couldn't do RSA PSS, couldn't do a lot of things.

Most of that has changed since. PHP 8.2 added AEAD for ChaCha20-Poly1305. PHP 8.4 added Ed25519, Ed448, Curve25519, and Curve448 across [`openssl_pkey_new()`](https://www.php.net/openssl-pkey-new), [`openssl_sign()`](https://www.php.net/openssl-sign), [`openssl_verify()`](https://www.php.net/openssl-verify), and [`openssl_pkey_derive()`](https://www.php.net/openssl-pkey-derive). PHP 8.5 added RSA PSS to [`openssl_sign()`](https://www.php.net/openssl-sign) and [`openssl_verify()`](https://www.php.net/openssl-verify). (EC keys via [`openssl_pkey_new()`](https://www.php.net/openssl-pkey-new) and ECDH via [`openssl_pkey_derive()`](https://www.php.net/openssl-pkey-derive) actually predate phpseclib 3, in PHP 7.1 and 7.3 respectively, but most of the gap-closing landed in 8.2 and later.)

phpseclib 4 takes advantage of these OpenSSL features when they're available. Where phpseclib's value still shows up against modern PHP's OpenSSL bindings is in the higher-level objects (X.509, CSR, CRL, PFX, CMS, all the things this comparison section is mostly about) and in corner cases the bindings don't cover, including:

- **RSA PSS with mismatched hashes.** PHP 8.5's PSS support only works when the hash and MGF hash match. phpseclib lets you set them independently.
- **PKCS#1 signatures with absent parameters.** [RFC 4055](https://datatracker.ietf.org/doc/html/rfc4055#page-6) says the `AlgorithmIdentifier` parameters field on a PKCS#1 signature OID may be encoded as either NULL or absent, and that all implementations MUST accept both. OpenSSL accepts only NULL. Most real-world signatures use NULL and verify fine on both, but if yours falls in the minority that omits the parameters, OpenSSL refuses and phpseclib accepts.
- **Key formats.** PuTTY, XML Signature, and various other formats that PHP's OpenSSL bindings don't understand.
- **Continuous-mode / progressive symmetric encryption.** Encrypting a stream across multiple `encrypt()` calls without re-initializing the cipher each time.

## phpseclib vs libssh2

Whether or not the API is better than [libssh2](http://php.net/ssh2) is debatable. Here, we consider more objective criteria.

### Portability

libssh2 exists as a PECL extension that most hosts are not going to have installed.

If you're a library author then any extra dependencies that you have (that can't be installed through Composer) are going to be additional pain points for your end users.

If you're writing a website then, if you're not using Docker or Ansible or whatever, then you're going to need to somehow document that that extension was installed so that the production (or dev) servers can be updated with it as well and so that the extension can be reinstalled if either of the servers need to be rebuilt.

### Algorithm Support

phpseclib 4.0 supports best-practices algorithms that libssh2 [does not support](https://www.php.net/manual/en/function.ssh2-connect.php). Algorithms like curve25519-sha256, ecdh-sha2-nistp256, ssh-ed25519, ecdsa-sha2-nistp256, aes128-gcm, chacha20-poly1305, etc.

### Speed

The following table shows how long, in seconds, it took to transfer a 10mb file via phpseclib and libssh2 to localhost.

<table border="1" style={{display: 'table'}} id="sftpSpeed">
  <tbody>
    <tr>
      <td class="direction" rowspan="2">Upload</td>
      <td><strong>libssh2</strong></td>
      <td>0.6125</td>
    </tr>
    <tr>
      <td><strong>phpseclib</strong></td>
      <td class="speed">0.1680</td>
    </tr>
    <tr>
      <td class="direction" rowspan="2">Download</td>
      <td><strong>libssh2</strong></td>
      <td>1.5422</td>
    </tr>
    <tr>
      <td><strong>phpseclib</strong></td>
      <td class="speed">0.2389</td>
    </tr>
  </tbody>
</table>

So phpseclib uploads files <strong>3.5x</strong> faster than libssh2 and downloads files <strong>6.5x</strong> faster than libssh2.

Note that these numbers are _with_ the [openssl](http://php.net/openssl), [sodium](https://www.php.net/sodium) and [gmp](https://www.php.net/gmp) extensions installed. Removal of openssl and sodium, in particular, will _significantly_ slow phpseclib down. Uploads and downloads will still happen, but at significantly reduced speed (unless the network is a more significant bottleneck).

These numbers were obtained [on Travis CI](https://travis-ci.org/github/phpseclib/benchmarks/builds/706532232).

### Public Key Support

Here's how you do it with libssh2:

```php
$ssh = ssh2_connect('domain.tld');
ssh2_auth_pubkey_file($ssh, 'username', '/home/ubuntu/pubkey', '/home/ubuntu/privkey'/*, 'password'*/);

$stream = ssh2_exec($ssh, 'ls -la');
echo stream_get_contents($stream);
```

Here's how you do it with phpseclib:

```php
use phpseclib4\Crypt\PublicKeyLoader;
use phpseclib4\Net\SSH2;

$ssh = new SSH2('domain.tld');
$ssh->login('username', PublicKeyLoader::load(file_get_contents('/home/ubuntu/privkey')/*, 'password'*/));

echo $ssh->exec('ls -la');
```

Ignoring the API for the time being there are a few clear ways phpseclib comes out on top here:

- phpseclib takes in strings, not file paths. If you want to do a file you can do file_get_contents.
- phpseclib doesn't require a public key. Private keys have the public key embedded within them so phpseclib just extracts it.
- phpseclib can take in pretty much any standardized format, from PKCS#1 formatted keys, to PuTTY keys, to XML Signature keys.

### Diagnosing Problems

Why didn't top or sudo work? With phpseclib you can get logs. They look like this:

[complex.txt](pathname:///logs/complex.txt)

In 4.0, error reporting is via typed exceptions rather than `getErrors()` / `getLastError()` (both of which are gone). Wrap your SSH2 / SFTP calls in `try` / `catch` and inspect the exception. Every phpseclib exception implements `phpseclib4\Exception\BaseException` and extends `\RuntimeException`, so a single `catch (\RuntimeException $e)` will sweep up everything the library can throw.

See [SSH2: Diagnosing Issues](../ssh2/diagnosis.md) for more information.

### Changing Directories

I don't see any cd or chdir functions at [http://php.net/ssh2](http://php.net/ssh2). phpseclib, however, has it - `SFTP::chdir(...)`.

### Interactive Shell

Let's try to do sudo on the remote system.

With phpseclib: [read() with regular expressions: sudo](../ssh2/commands.md#read-with-regular-expressions-sudo)

With libssh2? I have no clue. My best guess (doesn't work):

```php
$ssh = ssh2_connect('domain.tld');
ssh2_auth_password($ssh, 'username', 'password');

$shell = ssh2_shell($ssh);
echo fread($shell, 1024*1024);
fwrite($shell, "sudo ls -la\n");
$output = fread($shell, 1024*1024);
echo $output;
if (preg_match('#[pP]assword[^:]*:#', $output)) {
    fwrite($shell, "password\n");
}
echo fread($shell, 1024*1024);
```
It is additionally unclear how to get top working with libssh2 but it works perfectly fine with phpseclib: [exec() with and without a PTY vs Interactive Shells: top](../ssh2/commands.md#top)
