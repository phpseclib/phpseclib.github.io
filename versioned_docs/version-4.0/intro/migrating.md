---
title: Migrating from 3.0
---

phpseclib 4.0 is a substantial release. The namespace went from `phpseclib3\` to `phpseclib4\`, the minimum PHP version went from 5.6 to 8.1, the X.509 surface was split into four separate classes, the signing model was redesigned, and two brand-new format classes (PFX and CMS) were added. A bulk find-and-replace of `phpseclib3\` to `phpseclib4\` will get the namespace right but won't finish the migration. Most of the API changes need real edits, not text substitution.

This page is the orientation: should you migrate at all, what to expect if you do, what the major shape changes look like. For the comprehensive lookup table (every renamed method, every changed signature, every removed function) see [Changes from 3.0](changes.md).

## Consider the compat shim first

For many existing 3.0 codebases, the right answer is **don't migrate at all**.

[`phpseclib/phpseclib3_compat`](https://github.com/phpseclib/phpseclib3_compat) is a Composer package that emulates the entire `phpseclib3\` API on top of phpseclib 4.0. Existing 3.0 code keeps working unchanged, and the package "provides" `phpseclib/phpseclib:~3.0` in Composer's eyes, which means it satisfies any other dependency that requires phpseclib 3.0.

The shim is the right answer when:

- **You have a Composer conflict.** Some popular packages pin to phpseclib 3.0. Without the shim, `composer require phpseclib/phpseclib:~4.0` conflicts with them. With the shim, both can coexist.
- **You have a large 3.0 codebase and the rewrite cost is real.** The X.509 redesign is the most extensive change. A project with hundreds of `loadX509()` / `getDN()` / `signCSR()` call sites may take longer to rewrite than the rest of the migration combined.
- **You want phpseclib 4's improvements without touching your code.** Security fixes, new ciphers, OpenSSL acceleration, the new PFX and CMS classes are all available through the shim.

A full migration is the right answer when:

- **You're starting a new project.** No 3.0 code to preserve.
- **You want to use the new 4.0 features directly.** PFX, CMS, the `Signable` interface, modern PHP types are most natural in native 4.0 code.
- **Your project is a library that exposes phpseclib types in its public API.** Your callers want to see real 4.0 types, not shimmed 3.0 types.

You can also do both. Install the shim for legacy code paths, write new code against the native 4.0 API. The two namespaces don't conflict: `phpseclib3\File\X509` (shimmed) and `phpseclib4\File\X509` (native) are different classes and can coexist in the same file.

## This is not a point upgrade

If you've decided to migrate rather than shim, set expectations correctly: this is closer to switching frameworks than to running a codemod. The minimum PHP version moved from 5.6 to 8.1, which (beyond the obvious) means 4.0 uses typed properties, `match`, named arguments, and union types throughout. The X.509 API was split into four classes. Object signing got a fundamentally new shape. PFX and CMS are net-new surface area. Many `false`-on-failure return paths became typed exceptions.

Each of those changes individually would have justified a major version. Together, they justify the rewrite cost, but they also justify *budgeting* for it.

## The headline differences

The full mapping is in [Changes from 3.0](changes.md). What follows is what's most likely to bite a migration.

### X.509 split into four classes

In 3.0, `File\X509` did everything: `loadX509()`, `loadCSR()`, `loadCRL()`, `loadSPKAC()` on the same object, switched by which loader you called. In 4.0, each format has its own top-level class with a static `::load()` factory:

```php
// 3.0
$x509 = new X509();
$x509->loadX509(file_get_contents('cert.pem'));
$x509->loadCSR(file_get_contents('req.csr'));   // same object, different mode

// 4.0
use phpseclib4\File\X509;
use phpseclib4\File\CSR;
$x509 = X509::load(file_get_contents('cert.pem'));
$csr  = CSR::load(file_get_contents('req.csr'));
```

There are no `loadX509()` / `saveX509()` methods in 4.0. PEM output is via `echo $x509` or `(string) $x509`; binary DER is via `$x509->toString(['binary' => true])`.

For the full API of each class: [X509](../file/x509.mdx), [CSR](../file/csr.mdx), [CRL](../file/crl.mdx), [SPKAC](../file/spkac.mdx).

### Object signing redone

In 3.0, signing was a method on the object being signed: `$x509->sign($issuerX509, $subjectX509)`. In 4.0, the signer is the `PrivateKey` (or a `PFX` for the CA case where the cert and key travel together), and the thing being signed is anything that implements `Signable`: `X509`, `CSR`, `CRL`, `SPKAC`, or `CMS\SignedData`.

```php
// 3.0
$signed = $x509->sign($issuerX509, $subjectX509);
echo $signed->saveX509($signed);

// 4.0
$priv->sign($x509);    // installs signature into $x509 as a side effect
echo $x509;             // PEM of the signed cert
```

Raw byte signing (`$priv->sign($bytes)` returning the raw signature) is unchanged. Only *object* signing is reshaped.

The [PFX reference](../file/pfx.mdx) and the [X509](../file/x509.mdx), [CSR](../file/csr.mdx), [CRL](../file/crl.mdx), and [CMS SignedData](../cms/signed.mdx) references all cover the new signing surface in more detail.

### Subject DN and issuer DN are separate

In 3.0, `$x509->getDN()` returned "the" DN, usually the subject. In 4.0, `getSubjectDN()` and `getIssuerDN()` are separate methods, and the bare `getDN()` throws on certificates where the two don't match (i.e., any CA-signed cert).

Code that does `if (strpos($x509->getDN(), 'CN=example.com') !== false)` needs two fixes: switch to `getSubjectDN()` / `getIssuerDN()`, and stop string-matching the result. The `DN_STRING` output format also changed (3.0's `C=US, O=Acme/CN=example.com` is now 4.0's `C = US, O = Acme, CN = example.com`, matching OpenSSL 3.0 CLI output), so the `strpos` silently always returns false in migrated code. Use `getSubjectDNProps('CN')` or `getSubjectDN(ASN1::DN_OPENSSL)` for structured access. The [Deep Dive: Distinguished Names](../file/detail-dns.mdx) reference covers the DN model in full.

### Exceptions instead of false

In 3.0, many methods returned `false` on failure and a value on success, effectively `bool|T`. In 4.0, methods throw typed exceptions and return `?T` or `T`.

```php
// 3.0
$result = $sftp->put('remote', 'local');
if ($result === false) {
    foreach ($sftp->getSFTPErrors() as $err) { error_log($err); }
}

// 4.0
try {
    $sftp->put('remote', 'local');
} catch (\Throwable $e) {
    error_log($e->getMessage());
}
```

The 3.0 error-reporting methods (`SSH2::getErrors()`, `SSH2::getLastError()`, `SFTP::getSFTPErrors()`, `SFTP::getLastSFTPError()`) are all gone. There's a new `SFTP::getErrors()` but it's narrower: it only collects per-step errors during recursive operations that deliberately keep going past partial failures (recursive `delete()` on a tree, for example).

Every phpseclib 4.0 exception implements `phpseclib4\Exception\BaseException` and extends `\RuntimeException`, so you can catch as broadly or narrowly as you want. A single `catch (\RuntimeException $e)` sweeps up everything the library throws. See [the exceptions overview](../exceptions/overview.md) for the full hierarchy.

### SFTP::chmod() argument order swapped

The most dangerous single trap in the migration. `chmod()` was the only SFTP method in 3.0 that took the value before the path. 4.0 fixes this to match every other SFTP method (path first):

```php
$sftp->chmod(0777, 'file.txt');    // 3.0
$sftp->chmod('file.txt', 0777);    // 4.0
```

A 3.0-style call against 4.0 throws `TypeError` immediately on the `string $path` parameter. Easy to spot in tested code paths but easy to miss in lightly-tested ones. Grep for `chmod(` in migrated codebases. See [the SFTP reference](../ssh2/sftp.md) for the current signature.

### Crypt\Random removed

```php
phpseclib3\Crypt\Random::string(32);   // 3.0
random_bytes(32);                       // 4.0, just use PHP's built-in
```

The entire class is gone. PHP's `random_bytes()` (available since PHP 7.0) is used directly throughout 4.0, and your code should too.

### PFX and CMS are new

If you had 3.0 code that handled PKCS#12 files or CMS / PKCS#7 envelopes, it almost certainly used PHP's `openssl_pkcs12_*` / `openssl_cms_*` functions or shelled out to the `openssl` CLI. phpseclib 4.0 has native classes for both ([PFX](../file/pfx.mdx) and [CMS](../cms/overview.md)), so that code can move into phpseclib if you want to. It's a refactor, not a mechanical migration: there's no 3.0 equivalent to translate from.

### Public key loading exceptions

In 3.0, `PublicKeyLoader::load()` threw `NoKeyLoadedException` for both unrecognized input and encrypted-but-no-password input. In 4.0 those are split: `PasswordNeededException` for "needs a password," `NoKeyLoadedException` for "this isn't a key at all."

The silent-break shape here is worth watching for during migration. Code that catches `NoKeyLoadedException` specifically (common when the error path is "prompt the user for a password") won't fire for the encrypted-key case anymore. The exception propagates up, and what was a "prompt for password" code path becomes an uncaught exception. Grep migrated codebases for `catch (NoKeyLoadedException` and audit each one.

(The same split applies to `RSA::load()`, `EC::load()`, `DSA::load()`, `DH::load()`, and the new `PFX::load()`. See the [exceptions overview](../exceptions/overview.md) and the [public keys overview](../publickeys/overview.mdx) for full context.)

## What didn't change

A short list of common 3.0 patterns that work identically in 4.0:

- **Raw byte signing and verification.** `$priv->sign($bytes)` and `$pub->verify($bytes, $sig)` are unchanged.
- **Symmetric ciphers.** AES, DES, 3DES, Twofish, Blowfish, same API.
- **Key creation, loading, format export.** `createKey()` / `load()` / `withPassword()` / `toString()` for RSA / EC / DSA have the same shape, including all the PEM / DER / OpenSSH / PuTTY / XML format wrangling.
- **BigInteger.** Mostly stable. One breaking change: `modInverse()` returns `null` instead of `false` when there's no inverse.
- **SSH2 connect / login / exec.** Basic flow unchanged. Error handling around it changed (exceptions, not `false`), but the success path looks the same.
- **SFTP put / get.** Path-first, source / destination unchanged. Only `chmod` swapped.

If you're seeing a 3.0 method that this page doesn't mention and the [list of changes](changes.md) doesn't list, it likely falls in this bucket. Update the namespace and you're done.

## Suggested order of operations

If you've decided to migrate, do this in order:

1. **Skim the [list of changes](changes.md).** It's a long page; you don't need to read it end-to-end yet, but you want a sense of what's in it before you start touching code.
2. **Update Composer.** Bump `phpseclib/phpseclib` to `~4.0`. Resolve any dependency conflicts. This is where the shim conversation often resurfaces: if a third-party package pins to 3.0, you can install the shim to bridge it while migrating your own code natively.
3. **Find-and-replace `phpseclib3\` to `phpseclib4\`.** This gets the namespace right and surfaces compile-time errors for anything renamed.
4. **Fix the syntax errors PHP reports.** Most will be method-rename or signature-change issues that the list of changes covers directly.
5. **Run your tests.** This catches the behavioral changes: `chmod` argument order, the `=== false` patterns that no longer fire, `getDN()` string-matching that silently returns wrong results, exception types that your catches don't match.
6. **Audit `catch` blocks.** Anywhere you caught `NoKeyLoadedException` for password-prompting purposes, add a `PasswordNeededException` catch above it. Anywhere you caught `\UnexpectedValueException` or `\RuntimeException` by the SPL name and expected to catch phpseclib's throws, update to the `phpseclib4\Exception\` namespace.
7. **Use [the list of changes](changes.md) as a lookup** for anything still puzzling.

## Reporting gaps

If something on this page is unclear or wrong, or if you hit a 3.0 pattern during migration that we don't cover, please [file an issue](https://github.com/phpseclib/phpseclib/issues). Corrections from people doing real migrations are the highest-signal contributions to the docs.
