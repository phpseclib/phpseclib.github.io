---
id: ruby
title: Ruby
---

All the ruby code samples can be previewed on https://replit.com/languages/ruby

## RSA Signature Verification

Signature creation with PHP:

```php
use phpseclib3\Crypt\PublicKeyLoader;

$key = PublicKeyLoader::load('-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf9Cnzj4p4WGeKLs1Pt8Qu
KUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQJAIJLixBy2qpFoS4DSmoEm
o3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2k
TQIhAKMSvzIBnni7ot/OSie2TmJLY4SwTQAevXysE2RbFDYdAiEBCUEaRQnMnbp7
9mxDXDf6AU0cN/RPBjb9qSHDcWZHGzUCIG2Es59z8ugGrDY+pxLQnwfotadxd+Uy
v/Ow5T0q5gIJAiEAyS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3okCIBOs
/5OiPgoTdSy7bcF9IGpSE8ZgGKzgYQVZeN97YE00
-----END RSA PRIVATE KEY-----')
    //->withHash('sha256')
    ->withPadding(RSA::SIGNATURE_PKCS1);

echo base64_encode($key->sign('zzz'));
```

Signature verification with Ruby:

```python
require 'openssl'
require 'base64'

key = "-----BEGIN RSA PUBLIC KEY-----
MEgCQQCo9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp84+KeFhnii7NT7fELilKUSnx
S30WAvQCCo2yU1orfgqr41mM70MBAgMBAAE=
-----END RSA PUBLIC KEY-----"
key = OpenSSL::PKey::RSA.new(key)

plaintext = "zzz"
signature = "MUE536c4UJSAmycs7V6qFaLMATrKMQA8TYj5xX1+fwHINz3/BafgaRt0ycoD5IxTxaclLWavrGSza4xSBHraEw=="
signature = Base64.decode64(signature)

puts key.verify(OpenSSL::Digest::SHA256.new, signature, plaintext) ?
    "good" :
    "bad"
```