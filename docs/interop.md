---
id: interop
title: Overview
---

Examples of how to make phpseclib interoperate with other languages are often asked on stackoverflow. The langauges discussed and the scenarios presented are representative of the questions people have asked on stackoverflow.

The languages discussed are:

- [Python](python.md)
- [Java](java.md)
- [JavaScript](javascript.md)
- [Node.js](nodejs.md)
- [Go](go.md)
- [Ruby](ruby.md)
- [C#](csharp.md)
- [C](c.md)
- [PHP](php.md)

The scenarios discussed are:

- AES-128-CBC Decryption
- RSA Decryption (PKCS1 + OAEP)
- RSA Signature Verification (PKCS1 + PSS)

In the RSA examples, a 512-bit key is used for brevity, but this also means that the best practices hashing algorithms can't be used because the key is too short.

## Common Themes

Java and C have two different API's for working with RSA. So early on the [PKCS1 standards](https://en.wikipedia.org/wiki/PKCS_1) just had the eponymously named PKCS1 encryption scheme and the PKCS1 signature scheme. PKCS1 signatures took one parameter - the hash algorithm. PKCS1 encryption didn't take any parameters. The OAEP padding scheme was introduced in September 1998 in PKCS1 v2.0 and introduced three parameters: Hash, MGF Hash and Label. The problem is that the function definitions were already set in stone and couldn't easily be changed.

C's `RSA_public_encrypt` and `RSA_private_decrypt` already had a `padding` parameter so they just added a new constant that could be passed to that parameter - `RSA_PKCS1_OAEP_PADDING`. This new constant would utilize the [default values in the ASN.1 definition of RSAES-OAEP-params in PKCS1](https://datatracker.ietf.org/doc/html/rfc8017#appendix-A.2.1) - sha1 for both the Hash and MGF Hash and an empty label.

C then added `EVP_PKEY_encrypt` and `EVP_PKEY_decrypt` that could accept additional parameters via `EVP_PKEY_CTX_ctrl_str`.

PHP's `openssl_public_encrypt` and `openssl_private_decrypt` both use `RSA_public_encrypt` and `RSA_private_decrypt` and thus they don't support OAEP with any hash other than sha1.

Java's approach was a bit different. Java uses [Cryptographic Service Providers](https://docs.oracle.com/javase/8/docs/technotes/guides/security/crypto/CryptoSpec.html). You pass a string description of the cryptographic operation you're wanting to perform to `Cipher.getInstance()`. This string can represent a symmetric cipher or a asymmetric one. To allow for the different hashes that OAEP allows for they created new strings. eg. `RSA/ECB/OAEPWithMD5AndMGF1Padding`, `RSA/ECB/OAEPWithSHA1AndMGF1Padding`, etc. The problem with that approach is...  what if the Hash and MGF Hash aren't the same? What if you want to change the label? You can't do any of that. Thus was [AlgorithmParameterSpec](https://docs.oracle.com/javase/7/docs/api/java/security/spec/AlgorithmParameterSpec.html) introduced, along with a new `Cipher.init` definition that accepted `AlgorithmParameterSpec`.

## Unique Features

Python, uniquely, has a "sentinel" parameter for [RSA PKCS1 decryption](https://pycryptodome.readthedocs.io/en/latest/src/cipher/pkcs1_v1_5.html).