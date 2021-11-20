---
id: php
title: PHP
---

Despite the fact that PHP has built-in support for some cryptographic operations via OpenSSL there are still reasons to use phpseclib. See [phpseclib vs OpenSSL](why.md#phpseclib-vs-openssl)

### RSA Decryption

Encryption with PHP / phpseclib:

```php
use phpseclib3\Crypt\PublicKeyLoader;

$key = PublicKeyLoader::load('-----BEGIN RSA PUBLIC KEY-----
MEgCQQCo9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp84+KeFhnii7NT7fELilKUSnx
S30WAvQCCo2yU1orfgqr41mM70MBAgMBAAE=
-----END RSA PUBLIC KEY-----');
$key = $key->withPadding(RSA::ENCRYPTION_PKCS1);
echo base64_encode($key->encrypt('test'));
```

Decryption with PHP / OpenSSL:

```php
$private = '-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf9Cnzj4p4WGeKLs1Pt8Qu
KUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQJAIJLixBy2qpFoS4DSmoEm
o3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2k
TQIhAKMSvzIBnni7ot/OSie2TmJLY4SwTQAevXysE2RbFDYdAiEBCUEaRQnMnbp7
9mxDXDf6AU0cN/RPBjb9qSHDcWZHGzUCIG2Es59z8ugGrDY+pxLQnwfotadxd+Uy
v/Ow5T0q5gIJAiEAyS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3okCIBOs
/5OiPgoTdSy7bcF9IGpSE8ZgGKzgYQVZeN97YE00
-----END RSA PRIVATE KEY-----';

$ciphertext = 'L812/9Y8TSpwErlLR6Bz4J3uR/T5YaqtTtB5jxtD1qazGPI5t15V9drWi58colGOZFeCnGKpCrtQWKk4HWRocQ==';

$private = openssl_get_privatekey($private);

openssl_private_decrypt(base64_decode($ciphertext), $plaintext, $private, OPENSSL_PKCS1_PADDING);

echo $plaintext;
```
OAEP padding is supported but [only with sha1 as the hash / MGF hash](https://www.php.net/manual/en/function.openssl-public-encrypt.php#118466) (no doubt because php-src is using OpenSSL's [RSA_private_decrypt](https://www.openssl.org/docs/man1.0.2/man3/RSA_private_decrypt.html) is being used as opposed to OpenSSL's newer [EVP_PKEY_decrypt](https://www.openssl.org/docs/man1.0.2/man3/EVP_PKEY_decrypt.html))