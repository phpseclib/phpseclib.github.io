---
title: Overview
---

## Best Practices

ChaCha20-Poly1305 is the best practices algorithm to be using at the time of this writing. After that it would be AES-GCM. Both of these are [authenticated encryption](https://en.wikipedia.org/wiki/Authenticated_encryption) algorithms.

## StreamCipher vs BlockCipher

All symmetric key classes extend `\phpseclib4\Crypt\Common\SymmetricKey` (as opposed to `\phpseclib4\Crypt\Common\AsymmetricKey`).

Symmetric key classes extend either `\phpseclib4\Crypt\Common\StreamCipher` or `\phpseclib4\Crypt\Common\BlockCipher`, depending on whether or not they're a stream or block cipher, respectively.

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
use phpseclib4\Crypt\AES;

$cipher = new AES('ctr');
$cipher->setIV(random_bytes(16));
$cipher->setKey(random_bytes(16));

$ciphertext = $cipher->encrypt('...');
echo $cipher->decrypt($ciphertext);
```

`random_bytes()` is PHP's built-in CSPRNG. There is no `phpseclib4\Crypt\Random` class; use `random_bytes()` to generate keys, IVs, and nonces.

Skipping a required step throws rather than silently using defaults. Calling `encrypt()` or `decrypt()` before `setKey()` (or `setIV()` / `setNonce()` where required) throws `InvalidStateException`. Passing a wrong-length key, IV, nonce, or tag throws `LengthException`.

### The Constructor

In this example `'ctr'` is a block cipher mode of operation. This parameter does not need to be provided for stream ciphers.

Supported block cipher modes of operation are as follows:

- ctr
- ecb
- cbc
- cfb
- cfb8
- ofb
- ofb8
- gcm

Passing `'stream'` to a block cipher constructor throws `InvalidArgumentException` - `'stream'` is the internal mode the `StreamCipher` base sets automatically and isn't valid for block ciphers.

### setIV() vs setNonce()

`usesIV()` tells you whether the cipher object requires an IV. If an IV is required it can be set with `setIV()`.

`usesNonce()` tells you whether or not a cipher object uses a nonce. If a nonce is required it can be set with `setNonce()`.

Nonces and IVs are very closely related but, in the context of phpseclib, a nonce is used in two places: GCM on block ciphers, and stream ciphers (Salsa20, ChaCha20). An IV's length equals the block size of the cipher; a nonce's length depends on the algorithm. GCM nonces are typically 96 bits (against a 128-bit block, since GCM only works on ciphers with a block length of 128 bits), ChaCha20 nonces are 64 or 96 bits, and Salsa20 nonces are 64 bits.

Stream ciphers' `usesIV()` always returns `false` even though they use IV-shaped values under the hood; the public contract is "set a nonce."

### setKey() vs setPassword()

Whereas **keys** need to be an exact length and, in theory, should be randomly generated (not that phpseclib has a way to verify whether or not they were randomly generated), **passwords** have no such requirements.

Passwords should still follow good password guidelines. A number, an upper case / lower case character, a symbol, at least eight characters, whatever. But they don't need to be 16 or 32 characters including non-printable characters like keys ought to be.

`setPassword`'s derives passwords using one of four different techniques:

- [PBKDF1](https://tools.ietf.org/html/rfc2898#section-5.1)
- [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2)
- [PKCS12](https://tools.ietf.org/html/rfc7292#appendix-B.2) (used by some PKCS8 keys)
- [bcrypt](publickeys/bcrypt.md): the OpenSSH bcrypt-pbkdf variant, not standard bcrypt. Specifically for parsing OpenSSH-encrypted private keys.

The current best practices method for generating keys from passwords is actually [Argon2](https://en.wikipedia.org/wiki/Argon2), which is not implemented by phpseclib. The reason phpseclib doesn't support this is two fold

1. Speed considerations. It's too slow for [sodium_compat](https://github.com/paragonie/sodium_compat) to implement and it's too slow for phpseclib to implement. Maybe [PHP8's JIT](https://wiki.php.net/rfc/jit) will change this.
2. [PKCS8](publickeys/overview.mdx#common-key-formats) support. The key derivation functions that phpseclib does implement are all used, in one form or another, for PKCS8 public keys.

If you do want Argon2, derive the key yourself with PHP's `sodium_crypto_pwhash()` and pass the result to `setKey()`.

The trailing parameters `setPassword` takes vary by `$method`. For PBKDF1, PBKDF2, and PKCS12:

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

For bcrypt the trailing arguments are different - there's no `$hash` slot:

```php
$cipher->setPassword(
    $password,
    'bcrypt',
    $salt,
    $rounds = 16,
    $keylen = $cipher->getKeyLength() >> 3
);
```

PBKDF1, PKCS12, and bcrypt all set the IV in addition to the key. PBKDF2 does not.

Passing any `$method` other than the four above throws `UnsupportedAlgorithmException`.

## Padding

[PKCS#5 / PKCS#7 padding](https://en.wikipedia.org/wiki/Padding_(cryptography)#PKCS%235_and_PKCS%237) can be enabled by doing `$cipher->enablePadding()`.

Padding can be disabled by doing `$cipher->disablePadding()`.

Padding is enabled by default.

Only CBC and ECB actually pad. CTR, OFB, CFB, CFB8, OFB8, and GCM produce ciphertext the same length as the plaintext regardless of the padding setting; they have no block boundary to pad to. Stream ciphers don't pad either; calling `enablePadding()` or `disablePadding()` on a stream cipher is harmless but has no effect.

## Continuous Buffer

Normally `$cipher->encrypt('...') === $cipher->encrypt('...')` but, if you do `$cipher->enableContinuousBuffer()` then that will no longer be the case. Consider the following example:

```php
use phpseclib4\Crypt\AES;

$cipher = new AES('ctr');
$cipher->setIV(random_bytes(16));
$cipher->setKey(random_bytes(16));

$ciphertext1 = $cipher->encrypt('......');
$cipher->enableContinuousBuffer();
$ciphertext2 = $cipher->encrypt('...') . $cipher->encrypt('...');

echo $ciphertext1 === $ciphertext2 ? 'same' : 'different';
```
With the continuous buffer enabled `same` will be output. Without the continuous buffer `different` will be output.

The continuous buffer can be disabled by calling `$cipher->disableContinuousBuffer()`.

This is the same idea as [incremental hashing contexts](https://www.php.net/manual/en/function.hash-init.php) in PHP.

## Cipher Attributes

Various cipher attributes can be obtained by calling:

- `$cipher->getKeyLength()`: key length in bits
- `$cipher->getKeyLengthInBytes()`: key length in bytes
- `$cipher->getBlockLength()`: block length in bits (0 for stream ciphers)
- `$cipher->getBlockLengthInBytes()`: block length in bytes (0 for stream ciphers)
- `$cipher->getMode()`: `'ctr'`, `'gcm'`, `'stream'`, etc.
- `$cipher->usesIV()`: bool
- `$cipher->usesNonce()`: bool
- `$cipher->continuousBufferEnabled()`: bool

## AAD modes

GCM mode can be enabled by doing `$cipher = new AES('gcm')`. It can only be used on ciphers with a 128-bit block size. GCM, uniquely, requires a nonce (instead of an IV) by set by calling `$cipher->setNonce()`. See [setIV() vs setNonce()](#setiv-vs-setnonce) for more information.

Poly1305 support can be enabled by doing `$cipher->enablePoly1305()`. Poly1305 keys can be set (when necessary) by doing `$cipher->setPoly1305Key('...')` (keys must be 256-bits). For Salsa20 / ChaCha20, Poly1305 keys are automatically generated using the technique described in [RFC8439 § 2.6.1. Poly1305 Key Generation in Pseudocode](https://tools.ietf.org/html/rfc8439#section-2.6.1) (altho it may still be desirable to manually set the key [eg. SSH2 uses a different key construction than that RFC describes]).

For both GCM and Poly1305 you may optionally set the "additional authenticated data" with `$cipher->setAAD()` (by default it's the empty string).

The tag can be set with `$cipher->setTag(...)` and retrieved with `$cipher->getTag()`. By default `getTag()` returns 16 bytes (128 bits); pass a length argument between 4 and 16 to truncate (e.g., `getTag(12)`). Truncating to 12 is common and acceptable; truncating to 4 is the minimum and gives only weak authenticity guarantees.

On the receiver, `setTag()` must be called before `decrypt()` on a GCM or Poly1305 cipher. Otherwise `decrypt()` throws `InvalidStateException`. If the tag doesn't verify, `decrypt()` throws `BadDecryptionException` instead of returning plaintext.

## TripleDES and 3CBC

`TripleDES` supports all the normal modes (`cbc`, `ctr`, ...) plus one peculiar one: **3CBC**, used by SSH-1.

```php
$des = new TripleDES('3cbc');   // inner chaining (SSH-1 era)
$des = new TripleDES('cbc3');   // outer chaining (alias for 'cbc')
$des = new TripleDES('cbc');    // outer chaining
```

`3cbc` is inner chaining; `cbc` (and its alias `cbc3`) is outer chaining. Outer chaining is what SSH-2 and everything else uses; inner chaining is only relevant if you're targeting SSH-1.

`TripleDES` accepts 16-byte or 24-byte keys. A 16-byte key is keying option 2 and is auto-extended to 24 bytes internally.

## Engine Selection

Each cipher picks the fastest available implementation at construction time. The candidates are:

| Constant | Name | Notes |
| --- | --- | --- |
| `ENGINE_OPENSSL` | `'OpenSSL'` | Used when PHP's `openssl_*` functions support the cipher+mode |
| `ENGINE_OPENSSL_AEAD` | `'OpenSSL (AEAD)'` | OpenSSL's GCM bindings |
| `ENGINE_LIBSODIUM` | `'libsodium'` | Used for ChaCha20-Poly1305 when sodium is available |
| `ENGINE_EVAL` | `'Eval'` | Pure-PHP, `eval()`-compiled inner loop. Faster than `ENGINE_INTERNAL`. |
| `ENGINE_INTERNAL` | `'PHP'` | Pure-PHP, last resort |

To override:

```php
$cipher->setPreferredEngine('OpenSSL');     // request OpenSSL
$cipher->setPreferredEngine('PHP');         // force pure-PHP
echo $cipher->getEngine();                  // see what's actually being used
$cipher->isValidEngine('OpenSSL');          // bool - would this work?
```

`setPreferredEngine()` is a hint, not a command. If you request OpenSSL and OpenSSL doesn't support the algorithm (e.g., Blowfish on OpenSSL 3.0.1+, which moved it to the legacy provider), phpseclib falls back to a working engine. Use `getEngine()` to see what actually got picked.

This matters mostly for performance debugging. The functional result is the same regardless of engine; the bytes encrypt and decrypt to the same values.

## Exceptions

All exceptions live under `phpseclib4\Exception\` and extend PHP's `\RuntimeException`. The ones you'll see most from symmetric-key code:

- `LengthException`: wrong-length key, IV, nonce, or tag.
- `InvalidArgumentException`: unrecognized mode string passed to constructor; missing required `setPassword()` param; passing `'stream'` to a block cipher.
- `InvalidModeException`: GCM requested on a non-128-bit-block cipher (e.g., `new TripleDES('gcm')`).
- `InvalidStateException`: `encrypt()` / `decrypt()` called before `setKey()` / `setIV()` / `setNonce()`; `decrypt()` called on an AEAD cipher before `setTag()`.
- `BadMethodCallException`: `getTag()` / `setTag()` on a non-AEAD cipher; `setBlockLength()` on AES; `setIV()` on an ECB cipher; `enablePoly1305()` / `setPoly1305Key()` on a GCM cipher.
- `BadDecryptionException`: GCM or Poly1305 tag verification failed.
- `UnsupportedAlgorithmException`: `setPassword(..., $method)` with an unsupported `$method`.
