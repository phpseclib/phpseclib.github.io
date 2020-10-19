---
id: symmetric
title: Overview
---

## Best Practices

ChaCha20-Poly1305 is the best practices algorithm to be using at the time of this writing. After that it would be AES-GCM. Both of these are [authenticated encryption](https://en.wikipedia.org/wiki/Authenticated_encryption) algorithms.

## Design Criteria

Cryptography is easy to get wrong. If you don't know what you're doing you might use a bad algorithm (eg. DES), you might use a bad mode (eg. ECB), you might use a short password as a key, etc.

phpseclib2 was pretty tolerant about this. A key that wasn't long enough would be null padded. An IV that wasn't provided would be assumed to be all null bytes. It was very forgiving and in so doing it almost enabled bad cryptography. phpseclib3, in contrast, has a much less forgiving API. If you leave a step out or don't provide enough data an Exception will be thrown.

Sure, phpseclib3 could be made to only include "good" algorithms and modes, but they might still be needed for interoperability purposes.

## StreamCipher vs BlockCipher

All symmetric key classes extend `\phpseclib3\Crypt\Common\SymmetricKey` (as opposed to `\phpseclib3\Crypt\Common\AsymmetricKey`).

Symmetric key classes extend either `\phpseclib3\Crypt\Common\StreamCipher` or `\phpseclib3\Crypt\Common\BlockCipher`, depending on whether or not they're a stream or block cipher, respectively.

The chief difference between the two is that stream ciphers only support one mode of operation whereas block ciphers support multiple modes of operation.

Stream ciphers also never make use of an IV (although they may make use of a nonce).

phpseclib provides implementations for three different stream ciphers:

- RC4
- Salsa20
- ChaCha20

phpseclib provides implementations for the following block ciphers:

- AES
- Rijndael (AES with support for variable block sizes)
- DES
- TripleDES
- RC2
- Blowfish
- Twofish

## High Level Example (using AES)

```php
use phpseclib3\Crypt\AES;
use phpseclib3\Crypt\Random;

$cipher = new AES('ctr');
$cipher->setIV(Random::string(16));
$cipher->setKey(Random::string(16));

$ciphertext = $cipher->encrypt('...');
echo $cipher->decrypt($ciphertext);
```

### The Constructor

In this example `'ctr'` is a block cipher mode of operation. This parameter does not need to be provided for stream ciphers.

Supported block cipher modes of operation are as follows:

- ctr
- ecb
- cbc
- cfb8
- ofb
- gcm

### setIV() vs setNonce()

`usesIV()` tells you whether the cipher object requires an IV. If an IV is required it can be set with `setIV()`.

`usesNonce()` tells you whether or not a cipher object uses a nonce. If a nonce is required it can be set with `setNonce()`.

Nonce's and IV's are very closely related but, in the context of phpseclib, a nonce is only used with GCM. Whereas the IV length is equal to the block size the nonce length is normally 96 bits (whereas the block size is 128 bits; GCM only works on ciphers with block length of 128 bits).

### setKey() vs setPassword()

Whereas **keys** need to be an exact length and, in theory, should be randomly generated (not that phpseclib has a way to verify whether or not they were randomly generated), **passwords** have no such requirements.

Passwords should still follow good password guidelines. A number, an upper case / lower case character, a symbol, at least eight characters, whatever. But they don't need to be 16 or 32 characters including non-printable characters like keys ought to be.

`setPassword`'s derives passwords using one of three different techniques:

- [PBKDF1](https://tools.ietf.org/html/rfc2898#section-5.1)
- [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2)
- [PKCS12](https://tools.ietf.org/html/rfc7292#appendix-B.2) (used by some PKCS8 keys)

The current best practices method for generating keys from passwords is actually [Argon2](https://en.wikipedia.org/wiki/Argon2), which is not implemented by phpseclib. The reason phpseclib doesn't support this is two fold

1. Speed considerations. It's too slow for [sodium_compat](https://github.com/paragonie/sodium_compat) to implement and it's too slow for phpseclib to implement. Maybe [PHP8's JIT](https://wiki.php.net/rfc/jit) will change this.
2. [PKCS8](publickeys.md#common-key-formats) support. The key derivation functions that phpseclib does implement are all used, in one form or another, for PKCS8 public keys.

The parameters `setPassword` takes are as follows:

```php
$cipher->setPassword(
    $password,
    $method = 'pbkdf2',
    $hash = 'sha1',
    $salt = 'phpseclib/salt',
    $iterationCount = 1000,
    $derivedKeyLength = $cipher->getKeyLength() >> 3
); 
```
PBKDF1 and PKCS12 set the IV, as well - PBKDF2 does not.

## Padding

[PKCS#5 / PKCS#7 padding](https://en.wikipedia.org/wiki/Padding_(cryptography)#PKCS%235_and_PKCS%237) can be enabled by doing `$cipher->enablePadding()`.

Padding can be disabled by doing `$cipher->disablePadding()`.

Padding is enabled by default.

## Continuous Buffer

Normally `$cipher->encrypt('...') === $cipher->encrypt('...')` but, if you do `$cipher->enableContinuousBuffer()` then that will no longer be the case. Consider the following example:

```php
use phpseclib3\Crypt\AES;
use phpseclib3\Crypt\Random;

$cipher = new AES('ctr');
$cipher->setIV(Random::string(16));
$cipher->setKey(Random::string(16));

$ciphertext1 = $cipher->encrypt('......');
$cipher->enableContinuousBuffer();
$ciphertext2 = $cipher->encrypt('...') . $cipher->encrypt('...');

echo $ciphertext1 === $ciphertext2 ? 'same' : 'different';
```
With the continuous buffer enabled `same` will be output. Without the continuous buffer `different` will be output.

The continuous buffer can be disabled by calling `$cipher->disableContinuousBuffer()`.

This is the same idea as [incremental hashing contexts](https://www.php.net/manual/en/function.hash-init.php) in PHP.

## Cipher Attributes

Various cipher attributes can be obtained by calling `$cipher->getKeyLength()`, `$cipher->getBlockLength()` or `$cipher->getBlockLengthInBytes()`.

`$cipher->getKeyLength()` returns the key length in bits (if it were to return the key length in bytes it'd be named `$cipher->getKeyLengthInBytes()`).

The block length for stream ciphers is 0.

## AAD modes

GCM mode can be enabled by doing `$cipher = new AES('gcm')`. It can only be used on ciphers with a 128-bit block size. GCM, uniquely, requires a nonce (instead of an IV) by set by calling `$cipher->setNonce()`. See [setIV() vs setNonce()](#setiv-vs-setnonce) for more information.

Poly1305 support can be enabled by doing `$cipher->enablePoly1305()`. Poly1305 keys can be set (when necessary) by doing `$cipher->setPoly1305Key('...')` (keys must be 256-bits). For Salsa20 / ChaCha20, Poly1305 keys are automatically generated using the technique described in [RFC8439 § 2.6.1. Poly1305 Key Generation in Pseudocode](https://tools.ietf.org/html/rfc8439#section-2.6.1) (altho it may still be desirable to manually set the key [eg. SSH2 uses a different key construction than that RFC describes]).

For both GCM and Poly1305 you may optionally set the "additional authenticated data" with `$cipher->setAAD()` (by default it's the empty string).

The tag can be set with `$cipher->setTag(...)` and retreived with `$cipher->getTag()`.