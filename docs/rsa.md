---
id: rsa
title: RSA
---

Loading and saving keys is discussed in [Public Keys: Overview](publickeys.md).

## Supported Formats

- **PKCS1** <sup style="color: red"><strong>[1]</strong></sup>
  - Keys start with `-----BEGIN RSA PRIVATE KEY-----` or `-----BEGIN RSA PUBLIC KEY-----`
- **PKCS8** <sup style="color: red"><strong>[1]</strong></sup>
  - Keys start with `-----BEGIN PRIVATE KEY-----` or `-----BEGIN ENCRYPTED PRIVATE KEY-----` or `-----BEGIN PUBLIC KEY-----`
- **PSS** <sup style="color: red"><strong>[1]</strong></sup><sup style="color: red"><strong>*</strong></sup>
  - Corresponds to the `openssl genpkey -algorithm rsa-pss` command
  - Similar to PKCS8 but with [RSASSA-PSS-params](https://tools.ietf.org/html/rfc4055#section-3.1) for the optional "parameters" attribute and a different OID (`id-RSASSA-PSS` vs `rsaEncryption`).
- **PuTTY**
  - Public keys start off with `---- BEGIN SSH2 PUBLIC KEY ----`
- **OpenSSH**
  - Private keys start with `-----BEGIN OPENSSH PRIVATE KEY-----`
- **XML**
- **MSBLOB** <sup style="color: red"><strong>*</strong></sup>
  - Private keys correspond to the format described in [Private Key BLOBs](https://docs.microsoft.com/en-us/windows/win32/seccrypto/base-provider-key-blobs#private-key-blobs)
  - Public keys correspond to the format described in [Public Key BLOBs](https://docs.microsoft.com/en-us/windows/win32/seccrypto/base-provider-key-blobs#public-key-blobs)

A more in-depth discussion of the common formats (ie. ones that don't have a red asterisk<sup style="color: red"><strong>*</strong></sup> next to them) can be found in [Common Key Formats](publickeys.md#common-key-formats). See [Sample RSA Keys](rsa-keys.md) for actual samples.

<div style="font-size: 11px">

<sup style="color: red"><strong>[1]</strong></sup> These are the only formats that support [multi-prime RSA](https://tools.ietf.org/html/rfc8017#section-3).
</div>

### Raw RSA Public Keys

Let's say you had the public key exponent and the public key modulo as distinct string values. Let's further say that they were hex-encoded. At that point you could load the key thusly:

```php
use phpseclib3\Crypt\PublicKeyLoader;
use phpseclib3\Math\BigInteger;

$key = PublicKeyLoader::load([
    'e' => new BigInteger($e, 16),
    'n' => new BigInteger($n, 16)
]);

echo $key;
```
The key that was output would be a PKCS8 key. `$key->getLoadedFormat()` would return `Raw`.

## Creating Keys

Keys can be created thusly:

```php
use phpseclib3\Crypt\RSA;

$private = RSA::createKey();
$public = $private->getPublicKey();
```
By default keys are 2048 bits. Alternate key lengths can be specified by doing `RSA::createKey(1024)` or whatever.

The exponent, by default, is [65537](https://en.wikipedia.org/wiki/65,537#Applications). It can be set by doing `RSA::setExponent(37)` or whatever (37 is what puttygen uses for the RSA keys it creates).

Multi-prime RSA can be employed by calling `RSA::setSmallestPrime(256)`. By default it is 4096. As for why you'd want to use multi-prime RSA...  generating a 2048 bit RSA key, without GMP or OpenSSL installed, can be a time consuming process as it requires 2x 1024-bit prime numbers be generated. Generating 8x 256-bit prime numbers is considerably faster.

## Creating / Verifying Signatures

Signatures can be created / verified thusly:

```php
//$private = $private->withPadding(RSA::SIGNATURE_PSS);
$signature = $private->sign($message);
echo $private->getPublicKey()->verify($message, $signature) ?
    'valid signature' :
    'invalid signature';
```

### RSA::SIGNATURE_PSS

The [Probabilistic Signature Scheme](https://en.wikipedia.org/wiki/Probabilistic_signature_scheme). <span style="color: green">This is the default method.</span> It is more secure than the other methods but is less commonly used.

The following methods can be used to configure this method:

- `withHash` (defaults to sha256)
- `withMGFHash` (defaults to sha256)
- `withSaltLength` (defaults to 0)

The minimum key length (`$key->getLength()`) is `8 * ($key->getHash()->getLengthInBytes() + $key->getSaltLength() + 2)`.

Employs randomized padding so signing the same message twice will _not_ yield the same signature twice.

### RSA::SIGNATURE_PKCS1

More commonly used, less secure.

Uses `withHash`, which defaults to sha256.

The minimum key length (`$key->getLength()`) depends on the hash being used:

| Hash | Min Key Length (in bits) |
|---|---|
| md2 | 360 |
| md5 | 360 |
| sha1 | 368 |
| sha256 | 496 |
| sha384 | 624 |
| sha512 | 752 |
| sha224 | 464 |
| sha512/224 | 464 |
| sha512/256 | 496 |

A "simple" formula isn't possible because, for this format, the "DigestInfo" of the hash algorithm is encoded in the base number, prior to modular exponentiation, and the length of this "DigestInfo" varies depending on the hash algorithm used (for example, for sha1, it's 15 bytes, and for sha256, it's 19 bytes).

Does _not_ employee randomized padding so signing the same message twice _will_ yield the same signature twice.

### RSA::SIGNATURE_RELAXED_PKCS1

This is basically the same as PKCS1 with the caveat that the "DigestInfo" no longer has a fixed length.

[PKCS#1 § 9.2. EMSA-PKCS1-v1_5](https://tools.ietf.org/html/rfc8017#page-46) says the following:

      2.  Encode the algorithm ID for the hash function and the hash
          value into an ASN.1 value of type DigestInfo (see
          Appendix A.2.4) with the DER, where the type DigestInfo has
          the syntax

               DigestInfo ::= SEQUENCE {
                   digestAlgorithm AlgorithmIdentifier,
                   digest OCTET STRING
               }

          The first field identifies the hash function and the second
          contains the hash value.  Let T be the DER encoding of the
          DigestInfo value (see the notes below), and let tLen be the
          length in octets of T.

DER in this case refers to the [Distinguished Encoding Rules](https://en.wikipedia.org/wiki/X.690#DER_encoding), a subset of the [Basic Encoding Rules](https://en.wikipedia.org/wiki/X.690#BER_encoding) (BER). Anything encoding using DER is valid BER but not everything encoded in BER is valid DER. Signatures phpseclib creates are valid DER regardless of whether or not PKCS1 or RELAXED_PKCS1 modes are used but when it comes to signature verification RELAXED_PKCS1 actually decodes the BER instead of just matching strings of fixed length.

## Encryption / Decryption

Encryption / decryption can be done thusly:

```php
//$private = $private->withPadding(RSA::ENCRYPTION_OAEP);
$ciphertext = $private->getPublicKey()->encrypt($plaintext);
echo $private->decrypt($ciphertext);
```

All encryption schemes (save for `RSA::ENCRYPTION_NONE`) employ randomized padding so encrypting the same plaintext twice will yield different ciphertext's each time.

### RSA::ENCRYPTION_OAEP

[Optimal Asymmetric Encryption Padding](https://en.wikipedia.org/wiki/Optimal_asymmetric_encryption_padding). <span style="color: green">This is the default method.</span> It is more secure than the other methods but is less commonly used.

The following methods can be used to configure this method:

- `withHash` (defaults to sha256)
- `withMGFHash` (defaults to sha256)
- `withLabel` (defaults to the empty string)

The maxmimum plaintext length (in bytes) is `($key->getLength() - 2 * $key->getHash()->getLength() - 16) >> 3`

### RSA::ENCRYPTION_PKCS1

More commonly used, less secure.

No methods can be used to configure this method.

The maximum plaintext length (in bytes) is `($key->getLength() - 88) >> 3`.

### RSA::ENCRYPTION_NONE

Performs textbook RSA / basic modular exponentiation. This is not at all secure but may sometimes be needed for interoperability and also just general diagnosing of why ciphertext's aren't successfully decrypting even if the correct keys are being used (eg. it can be be used to provide insight into the "structure" of the decrypted message)

The maximum plaintext length (in bytes) is `$key->getLength() >> 3`.

## Key Attributes

The bit length of the key (well, the modulus) can be determined by calling `$key->getLength()`.

All the `with` methods have corresponding `get` methods as follows:

| Setter | Getter |
|---|---|
| `withHash` | `getHash` |
| `withMGFHash` | `getMGFHash` |
| `withSaltLength` | `getSaltLength` |
| `withLabel` | `getLabel` |
| `withPadding` | `getPadding` |

While `withHash` and `withMGFHash` accept strings, `getHash` and `getMGFHash` return a Hash object (that can be cast to a string via [__toString](https://www.php.net/manual/en/language.oop5.magic.php#object.tostring)). This enables you to do such things as determine what the minimum size of a key is by formula, as depicted in the [RSA::SIGNATURE_PSS](rsa.md#rsasignature_pss) and [RSA::ENCRYPTION_OAEP](rsa.md#rsaencryption_oaep) sections.

Padding is, internally, denoted as a bitmask. So the default value returned by `getPadding()` is `RSA::ENCRYPTION_OAEP | RSA::SIGNATURE_PSS`. Only one encryption mode and one signature mode can be set at a time.

## Public Keys as Private Keys

In theory, RSA public and private keys are indistinguishable from one another and are interchangeable. In theory, both consist simply of an exponent and a modulo.

In practice, RSA private keys have additional parameters to speed up computation by means of the [Chinese Remainder Theorem](https://en.wikipedia.org/wiki/Chinese_remainder_theorem).

For the sake of argument, however, let's say you had a key that just had the public key parameters but you wanted to use it as a private key. You could do so by doing `$key->asPrivateKey()`.

## Blinding

[Blinding](https://en.wikipedia.org/wiki/Blind_signature#Blind_RSA_signatures) is enabled by default. It can be disabled / enabled by doing `RSA::disableBlinding()` / `RSA::enableBlinding()`.