---
id: dh
title: (EC)DH
---

Loading and saving keys is discussed in [Public Keys: Overview](publickeys.md).

## Supported Formats

ECDH keys can be in any of the formats discussed in [Elliptic Curves: Supported Formats](ec.md#supported-formats). Calling `\phpseclib3\Crypt\PublicKeyLoader::load()` on keys of that formats will return a `\phpseclib3\Crypt\EC` object.

Regular DH keys can be of the following formats:

- **PKCS1** <sup style="color: red"><strong>[1]</strong></sup>
  - Keys start with `-----BEGIN DH PARAMETERS-----`
- **PKCS8** <sup style="color: red"><strong>[1]</strong></sup>
  - Keys start with `-----BEGIN PRIVATE KEY-----` or `-----BEGIN ENCRYPTED PRIVATE KEY-----` or `-----BEGIN PUBLIC KEY-----`

A more in-depth discussion of these two formats can be found in [Common Key Formats](publickeys.md#common-key-formats).

DH Public / Private keys will not be instances of `\phpseclib3\Crypt\Common\PublicKey` or `\phpseclib3\Crypt\Common\PrivateKey` but rather of `phpseclib3\Crypt\DH\PublicKey` and `phpseclib3\Crypt\DH\PrivateKey`.

## Creating Keys

ECDH keys can be created using the technique described in [Elliptic Curves: Creating Keys](ec.md#creating-keys).

Regular DH keys are created thusly:

```php
use phpseclib3\Crypt\DH;

$params = DH::createParameters(...);
$private = DH::createKey($params, 160);
$public = $private->getPublicKey();
```
The second parameter is optional and can be used to optionally speed up the computation of the key. Quoting [RFC4419 § 6.2. Private Exponents](http://tools.ietf.org/html/rfc4419#section-6.2), "_To increase the speed of the key exchange, both client and server may reduce the size of their private exponents.  It should be at least twice as long as the key material that is generated from the shared secret_"

A discussion of the parameters that `DH::createParameters()` accepts follows:

### Specifying Prime and Base

```php
use phpseclib3\Crypt\DH;
use phpseclib3\Math\BigInteger;

$prime = new BigInteger('...');
$base = new BigInteger(2);

$params = DH::createParameters($prime, $base);
$key = DH::createKey($params);
```

### Size of Prime in bits

The base, in this case, is assumed to be **2**.

```php
use phpseclib3\Crypt\DH;

$params = DH::createParameters(1024);
DH::createKey($params);
```

### By Name

```php
use phpseclib3\Crypt\DH;

$params = DH::createParameters('diffie-hellman-group1-sha1');
DH::createKey($params);
```

The following named primes are supported:

| Name | Ref |
|---|---|
| diffie-hellman-group1-sha1 | [RFC2409](http://tools.ietf.org/html/rfc2409#section-6.2) |
| diffie-hellman-group14-sha1 | [RFC3526](http://tools.ietf.org/html/rfc3526#section-3) |
| diffie-hellman-group14-sha256 | [RFC3526](https://tools.ietf.org/html/rfc3526#section-3) |
| diffie-hellman-group15-sha512 | [RFC3526](https://tools.ietf.org/html/rfc3526#section-4) |
| diffie-hellman-group16-sha512 | [RFC3526](https://tools.ietf.org/html/rfc3526#section-5) |
| diffie-hellman-group17-sha512 | [RFC3526](https://tools.ietf.org/html/rfc3526#section-6) |
| diffie-hellman-group18-sha512 | [RFC3526](https://tools.ietf.org/html/rfc3526#section-7) |

## Computing Shared Secrets

Shared secrets can be computed by calling `DH::computeSecret($private, $public)`.

The private key must be an instance of either `\phpseclib3\Crypt\DH\PrivateKey` or `\phpseclib3\Crypt\EC\PrivateKey`.

### With ECDH

The public key can be either an instance `\phpseclib3\Crypt\EC\PublicKey` or a string representing an encoded coordinate.

### With DH

The public key can either be an instance of `\phpseclib3\Crypt\DH\PublicKey`, a string (that will ultimately be parsed as a base-256 BigInteger) or an instance of `\phpseclib3\Math\BigInteger`.