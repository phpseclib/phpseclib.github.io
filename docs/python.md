---
id: python
title: Python
---

All Python code samples use [PyCryptodome](https://www.pycryptodome.org/en/latest/src/introduction.html).

## AES-128-CBC Decryption

Encrypting a string using AES-128-CBC with phpseclib:

```php
use phpseclib3\Crypt\AES;

$cipher = new AES('cbc');
$cipher->setKey(str_repeat('a', 16));
$cipher->setIV(str_repeat('b', 16));

echo bin2hex($cipher->encrypt('test'));
```

Decrypting that same string with Python:

```python
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

key = "aaaaaaaaaaaaaaaa".encode("utf8")
iv = "bbbbbbbbbbbbbbbb".encode("utf8")
ciphertext = bytearray.fromhex("10f42fd95857ed2775cfbc4b471bc213")

cipher = AES.new(key, AES.MODE_CBC, iv)
plaintext = unpad(cipher.decrypt(ciphertext), AES.block_size)

print(plaintext)
```
Keep in mind that phpseclib, by default, pads it's ciphertext's. To disable this behavior do `$cipher->disablePadding()`.

## RSA Decryption

Encryption with PHP:

```php
use phpseclib3\Crypt\PublicKeyLoader;

$key = PublicKeyLoader::load('-----BEGIN RSA PUBLIC KEY-----
MEgCQQCo9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp84+KeFhnii7NT7fELilKUSnx
S30WAvQCCo2yU1orfgqr41mM70MBAgMBAAE=
-----END RSA PUBLIC KEY-----');
$key = $key->withPadding(RSA::ENCRYPTION_PKCS1);
echo base64_encode($key->encrypt('test'));
```

Decryption with Python:

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
from Crypto import Random
import base64

key = RSA.import_key("""-----BEGIN PRIVATE KEY-----
MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAqPfgaTEWEP3S9w0t
gsicURfo+nLW09/0KfOPinhYZ4ouzU+3xC4pSlEp8Ut9FgL0AgqNslNaK34Kq+NZ
jO9DAQIDAQABAkAgkuLEHLaqkWhLgNKagSajeobLS3rPT0Agm0f7k55FXVt743hw
Ngkp98bMNrzy9AQ1mJGbQZGrpr4c8ZAx3aRNAiEAoxK/MgGeeLui385KJ7ZOYktj
hLBNAB69fKwTZFsUNh0CIQEJQRpFCcydunv2bENcN/oBTRw39E8GNv2pIcNxZkcb
NQIgbYSzn3Py6AasNj6nEtCfB+i1p3F35TK/87DlPSrmAgkCIQDJLhFoj1gbwRbH
/bDRPrtlRUDDx44wHoEhSDRdy77eiQIgE6z/k6I+ChN1LLttwX0galITxmAYrOBh
BVl433tgTTQ=
-----END PRIVATE KEY-----""")

ciphertext = "L812/9Y8TSpwErlLR6Bz4J3uR/T5YaqtTtB5jxtD1qazGPI5t15V9drWi58colGOZFeCnGKpCrtQWKk4HWRocQ=="

ciphertextBytes = base64.decodebytes(ciphertext.encode("ascii"))

cipher = PKCS1_v1_5.new(key)
sentinel = Random.new().read(key.size_in_bytes())
plaintext = cipher.decrypt(ciphertextBytes, sentinel)

print(plaintext)
```

PKCS1 keys are loaded in the same way as PKCS8 keys.

OAEP encryption is supported as well. Here's the phpseclib code to encrypt something with OAEP:

```php
use phpseclib3\Crypt\PublicKeyLoader;

$key = PublicKeyLoader::load('-----BEGIN RSA PUBLIC KEY-----
MEgCQQCo9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp84+KeFhnii7NT7fELilKUSnx
S30WAvQCCo2yU1orfgqr41mM70MBAgMBAAE=
-----END RSA PUBLIC KEY-----');
$key = $key
    //->withPadding(RSA::ENCRYPTION_OAEP)
    ->withHash('md5')
    ->withMGFHash('sha1');
echo base64_encode($key->encrypt('test'));
```
<sup>_(md5 is being used because the key is a 512-bit key from [Sample RSA Keys](/docs/rsa-keys); 512-bits is used for brevity but because it's 512-bits sha256 can't be used per the max size formulas discussed at [RSA::ENCRYPTION_OAEP](/docs/rsa#rsaencryption_oaep); sha1 would work but for the purposes of this demonstration it's useful to have them be different)_</sup>

Decryption with Python:

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto import Hash
import base64

key = RSA.import_key("""-----BEGIN PRIVATE KEY-----
MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAqPfgaTEWEP3S9w0t
gsicURfo+nLW09/0KfOPinhYZ4ouzU+3xC4pSlEp8Ut9FgL0AgqNslNaK34Kq+NZ
jO9DAQIDAQABAkAgkuLEHLaqkWhLgNKagSajeobLS3rPT0Agm0f7k55FXVt743hw
Ngkp98bMNrzy9AQ1mJGbQZGrpr4c8ZAx3aRNAiEAoxK/MgGeeLui385KJ7ZOYktj
hLBNAB69fKwTZFsUNh0CIQEJQRpFCcydunv2bENcN/oBTRw39E8GNv2pIcNxZkcb
NQIgbYSzn3Py6AasNj6nEtCfB+i1p3F35TK/87DlPSrmAgkCIQDJLhFoj1gbwRbH
/bDRPrtlRUDDx44wHoEhSDRdy77eiQIgE6z/k6I+ChN1LLttwX0galITxmAYrOBh
BVl433tgTTQ=
-----END PRIVATE KEY-----""")

ciphertext = "h3j3zLT2jXCaZuwF7cgUE/Zmc/5IsIfKbaTiBhpCJo86AiyuoA3Yvni+Lrm5wu2OGv2h5R7Zu3voFcHugiystw=="

ciphertextBytes = base64.decodebytes(ciphertext.encode("ascii"))

cipher = PKCS1_OAEP.new(key, Hash.MD5, mgfunc = lambda x,y: PKCS1_OAEP.MGF1(x, y, Hash.SHA1))
plaintext = cipher.decrypt(ciphertextBytes)

print(plaintext)
```

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

Signature verification with Python:

```python
from Crypto.PublicKey import RSA
from Crypto.Signature import PKCS1_v1_5
from Crypto import Hash
import base64

key = RSA.import_key("""-----BEGIN RSA PUBLIC KEY-----
MEgCQQCo9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp84+KeFhnii7NT7fELilKUSnx
S30WAvQCCo2yU1orfgqr41mM70MBAgMBAAE=
-----END RSA PUBLIC KEY-----""")

message = "zzz"
signature = "MUE536c4UJSAmycs7V6qFaLMATrKMQA8TYj5xX1+fwHINz3/BafgaRt0ycoD5IxTxaclLWavrGSza4xSBHraEw==";
signatureBytes = base64.decodebytes(signature.encode("ascii"))

hash = Hash.SHA256.new(message.encode("ascii"))
verifier = PKCS1_v1_5.new(key)
if verifier.verify(hash, signatureBytes):
    print("good")
else:
    print("bad")
```
PSS signatures are supported as well. Here's the phpseclib code to sign something with PSS:

```php
use phpseclib3\Crypt\PublicKeyLoader;

$key = PublicKeyLoader::load('...')
    //->withPadding(RSA::SIGNATURE_PSS)
    //->withHash('sha256')
    ->withMGFHash('sha1');

echo base64_encode($key->sign('zzz'));
```
<sup>_(the actual key is omitted because, for this example, a larger key than the 512-bit key we've been using, is needed)_</sup>

PSS signature verification with Python:

```python
from Crypto.PublicKey import RSA
from Crypto.Signature import pss
from Crypto import Hash
import base64

key = RSA.import_key("""-----BEGIN RSA PUBLIC KEY-----
MIGJAoGBAM5iHBWEep6wz0o6PrD0MdmjuO2SJivi0Ik01eFZn3GuyEpUvMI1eLtH
77wFORzI2eQTc2sGYWctEZk4k/Im91TFW0ahYyeB2m1XQ/cSY8RO9nyrWiGPJjzI
FuePuh8dqWHT2hGDfD9CmMmz7Zb+fltmSZ3siF9XbWyUTnemQpOtAgMBAAE=
-----END RSA PUBLIC KEY-----""")

message = "zzz"
signature = "JwqW/Xhh1hFxP5pGJAKkdVM+6WZ5FtQuPdwlmDq+pmJXknIybW4f31w7lJiBvc2VL8fNXg1DllwuwyCnErKRSygDGwdzkHJ/chvrjUequhiqoPhgKe3vQCFvJdlbeUEkF2Ho2qK5xU0VI3ViS1htDuQXJvCHm30wO+zgW9kshCE=";
signatureBytes = base64.decodebytes(signature.encode("ascii"))

hash = Hash.SHA256.new(message.encode("ascii"))
verifier = pss.new(key, mask_func=lambda x, y: pss.MGF1(x, y, Hash.SHA1), salt_bytes=Hash.SHA256.digest_size)
try:
    verifier.verify(hash, signatureBytes)
    print("good")
except (ValueError):
    print("bad")
```