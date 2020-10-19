---
id: dsa
title: DSA
---

Loading and saving keys is discussed in [Public Keys: Overview](publickeys.md).

## Supported Formats

- **PKCS1**
  - Keys start with `-----BEGIN DSA PRIVATE KEY-----` or `-----BEGIN DSA PUBLIC KEY-----` or `-----BEGIN DSA PARAMETERS-----`
- **PKCS8**
  - Keys start with `-----BEGIN PRIVATE KEY-----` or `-----BEGIN ENCRYPTED PRIVATE KEY-----` or `-----BEGIN PUBLIC KEY-----`
- **PuTTY** <sup style="color: red"><strong>[1]</strong></sup>
  - Public keys start off with `---- BEGIN SSH2 PUBLIC KEY ----`
- **OpenSSH** <sup style="color: red"><strong>[1]</strong></sup>
  - Private keys start with `-----BEGIN OPENSSH PRIVATE KEY-----`
- **XML**

A more in-depth discussion of the common formats can be found in [Common Key Formats](publickeys.md#common-key-formats). See [Sample DSA Keys](dsa-keys.md) for actual samples.

<div style="font-size: 11px">

<sup style="color: red"><strong>[1]</strong></sup> The only keys supported by this format are those with an N (length of group order Q) of 160 because [that's all SSH2 supports](https://tools.ietf.org/html/rfc4253#page-15).
</div>

### Parameters

Parameters consist of P (prime), Q (group order) and G (group generator). Public and private keys also include Y (public key value) and private keys additionally include X (secret exponent).

PKCS1 is the only format that supports Parameters. They can be extracted from a private or public key by doing `$key->getParameters()`.

Whereas public and private keys are instances of `\phpseclib3\Crypt\Common\PublicKey` and `\phpseclib3\Crypt\Common\PrivateKey`, respectively, parameters are an instance of `phpseclib3\Crypt\DSA\Parameters` (which is what `$key->getParameters()` returns).

## Creating Keys

There are three different ways to create a DSA public / private keypair.

### With L and N

Before a private key can be computed DSA needs to know what to use for P (prime), Q (group order) and G (group generator).

Most typically the group generator G is 2 so that's hard-coded.

By providing **N** (length of group order Q) and **L** (length of prime P), the remaining requisite values can be generated dynamically.

An example follows:

```php
use phpseclib3\Crypt\DSA;

$L = 2048;
$N = 224;
$private = DSA::createKey($L, $N);
$public = $private->getPublicKey();
```
Note that if you're trying to create a key for use with SSH2 that **N** will need to be 160 since, as noted in the footnotes for [Supported Formats](#supported-formats), that that's all SSH2 supports.

### With a Parameters object

With this approach P (prime), Q (group order) and G (group generator) are pre-computed. Either they've been loaded from a `-----BEGIN DSA PARAMETERS-----` file (or string) or else they've been generated with `DSA::createParameters()`.

Here's an example of doing it using with `createParameters`:

```php
use phpseclib3\Crypt\DSA;

$private = DSA::createKey(DSA::createParameters(2048, 224));
$public = $private->getPublicKey();
```
This is basically the same thing as doing `DSA::createKey(2048, 224)`.

Here's an example of creating a key by loading an existant parameters file:

```php
use phpseclib3\Crypt\DSA;
use phpseclib3\Crypt\PublicKeyLoader;

$private = DSA::createKey(PublicKeyLoader::load(file_get_contents('...')));
$public = $private->getPublicKey();
```

### Without any parameters
If no parameters are provided then the default paramters for `DSA::createParameters()` will be used - **L** will be 2048 and **N** will be 224.

An example follows:

```php
use phpseclib3\Crypt\DSA;

$private = DSA::createKey();
$public = $private->getPublicKey();
```
This is the same thing as doing `DSA::createKey(DSA::createParameters())`.

## Creating / Verifying Signatures

Signatures can be created / verified thusly:

```php
//$private = $private->withSignatureFormat('ASN1');
$signature = $private->sign($message);
echo $private->getPublicKey()->verify($message, $signature) ?
    'valid signature' :
    'invalid signature';
```
The signatures generated are _not_ deterministic, as discussed in [RFC6979](https://tools.ietf.org/html/rfc6979). Such determinism is chiefly of benefit when a [CSPRNG](https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator) is _not_ available and with PHP there is one that's available.

Signatures have two components - **r** and **s**. How these two components are combined to a single string depends on the signature format being employed.

### ASN1

<span style="color: green">This is the default format</span>. ASN1-formatted signatures employee the format discussed in [RFC3279](https://tools.ietf.org/html/rfc3279#section-2.2.2). This is the format used by X.509 certificates.

### SSH2

SSH2-formatted signatures employee the format discussed in [RFC4253](https://tools.ietf.org/html/rfc4253#page-15).

### Raw

Returns an array with **r** and **s** as keys.

## Key Attributes

`$key->getLength()` returns an array with **L** (length of prime P) and **N** (length of group order Q).

All the `with` methods have corresponding `get` methods as follows:

| Setter | Getter |
|---|---|
| `withHash` | `getHash` |
| `withSignatureFormat` | `getSignatureFormat` |

While `withHash` accepts strings, `getHash` returns a Hash object (that can be cast to a string via [__toString](https://www.php.net/manual/en/language.oop5.magic.php#object.tostring)).