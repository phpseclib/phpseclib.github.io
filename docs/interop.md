---
id: interop
title: Interoperability
---

## Python

All Python code samples use [PyCryptodome](https://www.pycryptodome.org/en/latest/src/introduction.html).

### AES-128-CBC Decryption

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

### RSA Decryption

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

### RSA Signature Verification

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

## Java

### AES-128-CBC Decryption

Encrypting a string using AES-128-CBC with phpseclib:

```php
use phpseclib3\Crypt\AES;

$cipher = new AES('cbc');
$cipher->setKey(str_repeat('a', 16));
$cipher->setIV(str_repeat('b', 16));

echo bin2hex($cipher->encrypt('test'));
```

Decrypting that same string with Java:

```java
import javax.xml.bind.DatatypeConverter;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.Cipher;

public class Test
{
    public static void main(String[] args) throws Exception
    {
        String key = "aaaaaaaaaaaaaaaa";
        String iv = "bbbbbbbbbbbbbbbb";
        String ciphertext = "10f42fd95857ed2775cfbc4b471bc213";

        byte[] ciphertextBytes = DatatypeConverter.parseHexBinary(ciphertext);

        // perform the actual decryption
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        SecretKeySpec keySpec = new SecretKeySpec(key.getBytes(), "AES");
        IvParameterSpec ivSpec = new IvParameterSpec(iv.getBytes());
        cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
        byte[] plaintextBytes = cipher.doFinal(ciphertextBytes);
        String plaintext = new String(plaintextBytes);

        System.out.println(plaintext);
    }
}
```

### RSA Decryption

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

Decryption with Java:

```java
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.openssl.PEMKeyPair;
import java.security.KeyPair;
import java.io.StringReader;
import javax.crypto.Cipher;
import java.util.Base64;
import java.security.interfaces.RSAPrivateKey;

public class Test
{
    public static void main(String[] args) throws Exception
    {
        String ciphertext = "L812/9Y8TSpwErlLR6Bz4J3uR/T5YaqtTtB5jxtD1qazGPI5t15V9drWi58colGOZFeCnGKpCrtQWKk4HWRocQ==";

        String key = "-----BEGIN RSA PRIVATE KEY-----\n" +
"MIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf9Cnzj4p4WGeKLs1Pt8Qu\n" +
"KUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQJAIJLixBy2qpFoS4DSmoEm\n" +
"o3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2k\n" +
"TQIhAKMSvzIBnni7ot/OSie2TmJLY4SwTQAevXysE2RbFDYdAiEBCUEaRQnMnbp7\n" +
"9mxDXDf6AU0cN/RPBjb9qSHDcWZHGzUCIG2Es59z8ugGrDY+pxLQnwfotadxd+Uy\n" +
"v/Ow5T0q5gIJAiEAyS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3okCIBOs\n" +
"/5OiPgoTdSy7bcF9IGpSE8ZgGKzgYQVZeN97YE00\n" +
"-----END RSA PRIVATE KEY-----\n";

        // load the private key
        PEMParser pemParser = new PEMParser(new StringReader(key));
        JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
        KeyPair keyPair = converter.getKeyPair((PEMKeyPair) pemParser.readObject());
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

        // load the ciphertext
        byte[] cipherBytes = Base64.getDecoder().decode(ciphertext);

        // perform the actual decryption
        Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        byte[] plaintextBytes = cipher.doFinal(cipherBytes);
        String plaintext = new String(plaintextBytes);

        System.out.println(plaintext);
    }
}
```

The above code only works with PKCS1 keys. If you want to load a PKCS8 key you'll need to make the following changes (using the [phpBB MOD Text Template](https://wiki.phpbb.com/MOD_Text_Template)):

```java
#
#-----[ FIND ]------------------------------------------
#
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.openssl.PEMKeyPair;
import java.security.KeyPair;
import java.io.StringReader;
#
#-----[ REPLACE WITH ]----------------------------------
#
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.KeyFactory;
#
#-----[ FIND ]------------------------------------------
#
        String key = "-----BEGIN RSA PRIVATE KEY-----\n" +
"MIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf9Cnzj4p4WGeKLs1Pt8Qu\n" +
"KUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQJAIJLixBy2qpFoS4DSmoEm\n" +
"o3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2k\n" +
"TQIhAKMSvzIBnni7ot/OSie2TmJLY4SwTQAevXysE2RbFDYdAiEBCUEaRQnMnbp7\n" +
"9mxDXDf6AU0cN/RPBjb9qSHDcWZHGzUCIG2Es59z8ugGrDY+pxLQnwfotadxd+Uy\n" +
"v/Ow5T0q5gIJAiEAyS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3okCIBOs\n" +
"/5OiPgoTdSy7bcF9IGpSE8ZgGKzgYQVZeN97YE00\n" +
"-----END RSA PRIVATE KEY-----\n";

        // load the private key
        PEMParser pemParser = new PEMParser(new StringReader(key));
        JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
        KeyPair keyPair = converter.getKeyPair((PEMKeyPair) pemParser.readObject());
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
#
#-----[ REPLACE WITH ]----------------------------------
#
        String key = "-----BEGIN PRIVATE KEY-----\n" +
"MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAqPfgaTEWEP3S9w0t\n" +
"gsicURfo+nLW09/0KfOPinhYZ4ouzU+3xC4pSlEp8Ut9FgL0AgqNslNaK34Kq+NZ\n" +
"jO9DAQIDAQABAkAgkuLEHLaqkWhLgNKagSajeobLS3rPT0Agm0f7k55FXVt743hw\n" +
"Ngkp98bMNrzy9AQ1mJGbQZGrpr4c8ZAx3aRNAiEAoxK/MgGeeLui385KJ7ZOYktj\n" +
"hLBNAB69fKwTZFsUNh0CIQEJQRpFCcydunv2bENcN/oBTRw39E8GNv2pIcNxZkcb\n" +
"NQIgbYSzn3Py6AasNj6nEtCfB+i1p3F35TK/87DlPSrmAgkCIQDJLhFoj1gbwRbH\n" +
"/bDRPrtlRUDDx44wHoEhSDRdy77eiQIgE6z/k6I+ChN1LLttwX0galITxmAYrOBh\n" +
"BVl433tgTTQ=\n" +
"-----END PRIVATE KEY-----";

        // extract BER from PEM
        key = key
                  .replaceAll("-+[^-]+-+", "")
                  .replace("\n", "")
                  .replace("\r", "");
        byte[] keyBytes = Base64.getDecoder().decode(key);

        // load decoded private key
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        RSAPrivateKey privateKey = (RSAPrivateKey) kf.generatePrivate(spec);
```

In the PKCS1 example BouncyCastle is being used to read the key and the actual decryption is being performed by the com.sun.crypto.provider.SunJCE provider.

Normally, com.sun.crypto.provider.SunJCE and org.bouncycastle.jce.provider.BouncyCastleProvider will yield the same result but that is not always the case. Consider OAEP.

Here's the phpseclib code to encrypt something with OAEP:

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
<sup>_(md5 is being used because the key is a 512-bit key from [Sample RSA Keys](/docs/rsa-keys); 512-bits is used for brevity but because it's 512-bits sha256 can't be used per the max size formulas discussed at [RSA::ENCRYPTION_OAEP](/docs/rsa#rsaencryption_oaep); sha1 would work but for the purposes of this demonstration it can't be sha1)_</sup>

Now let's modify the Java code again:

```java
#
#-----[ FIND ]------------------------------------------
#
        String ciphertext = "L812/9Y8TSpwErlLR6Bz4J3uR/T5YaqtTtB5jxtD1qazGPI5t15V9drWi58colGOZFeCnGKpCrtQWKk4HWRocQ==";
#
#-----[ REPLACE WITH ]----------------------------------
#
        String ciphertext = "h3j3zLT2jXCaZuwF7cgUE/Zmc/5IsIfKbaTiBhpCJo86AiyuoA3Yvni+Lrm5wu2OGv2h5R7Zu3voFcHugiystw==";
#
#-----[ FIND ]------------------------------------------
#
        Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
#
#-----[ REPLACE WITH ]----------------------------------
#
        Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithMD5AndMGF1Padding");
```
That works just fine. BUT what if use `Cipher.getInstance("RSA/ECB/OAEPWithMD5AndMGF1Padding", "BC")` instead? eg. what if we force org.bouncycastle.jce.provider.BouncyCastleProvider to be the crypto provider instead of com.sun.crypto.provider.SunJCE? Then it doesn't work.

org.bouncycastle.jce.provider.BouncyCastleProvider assumes the MGFHash and the Hash are using the same algorithm whereas com.sun.crypto.provider.SunJCE has the MGFHash hard-coded as sha1. To work around this we can do the following:

```java
#
#-----[ FIND ]------------------------------------------
#
import java.security.interfaces.RSAPrivateKey;
#
#-----[ AFTER, ADD ]------------------------------------
#
import javax.crypto.spec.OAEPParameterSpec;
import java.security.spec.MGF1ParameterSpec;
import javax.crypto.spec.PSource.PSpecified;
#
#-----[ FIND ]------------------------------------------
#
        Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
#
#-----[ REPLACE WITH ]----------------------------------
#
        Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPPadding");
        OAEPParameterSpec oaepParams = new OAEPParameterSpec(
            "MD5",
            "MGF1",
            new MGF1ParameterSpec("SHA-1"),
            PSpecified.DEFAULT
        );
        cipher.init(Cipher.DECRYPT_MODE, privateKey, oaepParams);
```

### RSA Signature Verification

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

Signature verification with Java:

```java
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import java.io.StringReader;
import java.util.Base64;
import java.security.interfaces.RSAPublicKey;
import java.security.Signature;

public class Test
{
    public static void main(String[] args) throws Exception
    {
        String plaintext = "zzz";
        String signature = "MUE536c4UJSAmycs7V6qFaLMATrKMQA8TYj5xX1+fwHINz3/BafgaRt0ycoD5IxTxaclLWavrGSza4xSBHraEw==";

        String key = "-----BEGIN RSA PUBLIC KEY-----\n" +
"MEgCQQCo9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp84+KeFhnii7NT7fELilKUSnx\n" +
"S30WAvQCCo2yU1orfgqr41mM70MBAgMBAAE=\n" +
"-----END RSA PUBLIC KEY-----\n";

        // load the public key
        PEMParser pemParser = new PEMParser(new StringReader(key));
        JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
        SubjectPublicKeyInfo pub = SubjectPublicKeyInfo.getInstance(pemParser.readObject());
        RSAPublicKey publicKey = (RSAPublicKey) converter.getPublicKey(pub);

        // load the plaintext
        byte[] signatureBytes = Base64.getDecoder().decode(signature);

        // perform the actual signature verification
        Signature sig = Signature.getInstance("SHA256withRSA");
        sig.initVerify(publicKey);
        sig.update(plaintext.getBytes());
        System.out.println(sig.verify(signatureBytes) ? "good" : "bad");
    }
}
```

The above code only works with PKCS1 keys. If you want to load a PKCS8 key you'll need to make the following changes (using the [phpBB MOD Text Template](https://wiki.phpbb.com/MOD_Text_Template)):

```java
#
#-----[ FIND ]------------------------------------------
#
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import java.io.StringReader;
#
#-----[ REPLACE WITH ]----------------------------------
#
import java.security.spec.X509EncodedKeySpec;
import java.security.KeyFactory;
#
#-----[ FIND ]------------------------------------------
#
        String key = "-----BEGIN RSA PUBLIC KEY-----\n" +
"MEgCQQCo9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp84+KeFhnii7NT7fELilKUSnx\n" +
"S30WAvQCCo2yU1orfgqr41mM70MBAgMBAAE=\n" +
"-----END RSA PUBLIC KEY-----\n";

        // load the public key
        PEMParser pemParser = new PEMParser(new StringReader(key));
        JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
        SubjectPublicKeyInfo pub = SubjectPublicKeyInfo.getInstance(pemParser.readObject());
        RSAPublicKey publicKey = (RSAPublicKey) converter.getPublicKey(pub);
#
#-----[ REPLACE WITH ]----------------------------------
#
        String key = "-----BEGIN PUBLIC KEY-----\n" +
"MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf\n" +
"9Cnzj4p4WGeKLs1Pt8QuKUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQ==\n" +
"-----END PUBLIC KEY-----";

        // extract BER from PEM
        key = key
                  .replaceAll("-+[^-]+-+", "")
                  .replace("\n", "")
                  .replace("\r", "");
        byte[] keyBytes = Base64.getDecoder().decode(key);

        // load decoded public key
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        RSAPublicKey publicKey = (RSAPublicKey) kf.generatePublic(spec);
```

If you want to do PSS signature verification and you have org.bouncycastle.jce.provider.BouncyCastleProvider as an available crypto provider (as of Java 8, sun.security.rsa.SunRsaSign does not support PSS), you can do `Signature.getInstance("SHA1withRSA/PSS")` instead of `Signature.getInstance("SHA1withRSA")`. If you do `SHA256withRSA/PSS` (which you're not going to be able to do with 512-bit RSA keys) you'll need to keep in mind that the MGFHash is assumed to be the same as the regular Hash. If that's not the case (or if you're using a salt length other than the length of the Hash) then you'll need to do something like this:

```java
#
#-----[ FIND ]------------------------------------------
#
import java.security.Signature;
#
#-----[ AFTER, ADD ]------------------------------------
#
import java.security.spec.PSSParameterSpec;
import java.security.spec.MGF1ParameterSpec;
import java.security.MessageDigest;
#
#-----[ FIND ]------------------------------------------
#
        Signature sig = Signature.getInstance("SHA256withRSA");
#
#-----[ REPLACE WITH ]----------------------------------
#
        Signature sig = Signature.getInstance("RSASSA-PSS");
        PSSParameterSpec pssParams = new PSSParameterSpec(
            "SHA-256",
            "MGF1",
            new MGF1ParameterSpec("SHA-1"),
            MessageDigest.getInstance("SHA-256").getDigestLength(),
            PSSParameterSpec.TRAILER_FIELD_BC
        );
        sig.setParameter(pssParams);
```
In this example SHA-256 is the Hash, SHA-1 is the MGFHash and the salt length is equal to the length of the hash in bytes _(this example requires a minimum 528-bit RSA private key instead of the 512-bit RSA private keys we've been using so a complete working example is not provided; in theory we could use MD5 as the Hash as we did with the OAEP example but Java doesn't support MD5 for PSS)_

## JavaScript

### RSA Decryption with Web Crypto API

Encryption with PHP:

```php
use phpseclib3\Crypt\PublicKeyLoader;

$key = PublicKeyLoader::load('-----BEGIN RSA PUBLIC KEY-----
MEgCQQCo9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp84+KeFhnii7NT7fELilKUSnx
S30WAvQCCo2yU1orfgqr41mM70MBAgMBAAE=
-----END RSA PUBLIC KEY-----');
$key = $key
    // OAEP is used by default so explicitly setting the padding to OAEP is not necessary
    //->withPadding(RSA::ENCRYPTION_OAEP)
    ->withHash('sha1')
    ->withMGFHash('sha1');
echo base64_encode($key->encrypt('test'));
```

Decryption with JavaScript using [Web Cryptography API](https://en.wikipedia.org/wiki/Web_Cryptography_API):

```javascript
var keyData = `-----BEGIN PRIVATE KEY-----
MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAqPfgaTEWEP3S9w0t
gsicURfo+nLW09/0KfOPinhYZ4ouzU+3xC4pSlEp8Ut9FgL0AgqNslNaK34Kq+NZ
jO9DAQIDAQABAkAgkuLEHLaqkWhLgNKagSajeobLS3rPT0Agm0f7k55FXVt743hw
Ngkp98bMNrzy9AQ1mJGbQZGrpr4c8ZAx3aRNAiEAoxK/MgGeeLui385KJ7ZOYktj
hLBNAB69fKwTZFsUNh0CIQEJQRpFCcydunv2bENcN/oBTRw39E8GNv2pIcNxZkcb
NQIgbYSzn3Py6AasNj6nEtCfB+i1p3F35TK/87DlPSrmAgkCIQDJLhFoj1gbwRbH
/bDRPrtlRUDDx44wHoEhSDRdy77eiQIgE6z/k6I+ChN1LLttwX0galITxmAYrOBh
BVl433tgTTQ=
-----END PRIVATE KEY-----`;

var ciphertext = 'kTOOqeGDRMRil40J8SRRSgXqisUhF27wLwTcNH00rk7Xl94dY9aPjCTSIefTWutbWLvKwFGO7Z7QoZjIIIPEwA==';

// from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#PKCS_8_import
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

keyData = keyData
    .replace(/-+[^-]+-+/g, '')
    .replace("\n", '')
    .replace("\r", '');
keyData = str2ab(window.atob(keyData));

ciphertext = str2ab(window.atob(ciphertext));

window.crypto.subtle.importKey(
    'pkcs8',
    keyData,
    {
        name: 'RSA-OAEP',
        hash: "SHA-1"
    },
    true,
    ['decrypt']             
).then(function(privateKey) {
    window.crypto.subtle.decrypt(
        {
            name: "RSA-OAEP"
        },
        privateKey,
        ciphertext
    ).then(function(plaintext) {
        console.log(new TextDecoder().decode(plaintext));
    })
});
```
<sup>_(sha1 is being used because the key is a 512-bit key from [Sample RSA Keys](/docs/rsa-keys); 512-bits is used for brevity but because it's 512-bits sha256 can't be used per the max size formulas discussed at [RSA::ENCRYPTION_OAEP](/docs/rsa#rsaencryption_oaep))_</sup>

PKCS1 keys are not supported and neither is PKCS1 padding for encryption (PKCS1 signature padding, however, is supported).

See it in action at https://jsfiddle.net/u7ad10fn/

## Node.js

### AES-128-CBC Decryption with CryptoJS

Encryption with PHP:

```php
use phpseclib3\Crypt\AES;

$cipher = new AES('cbc');
$cipher->setKey(str_repeat('a', 16));
$cipher->setIV(str_repeat('b', 16));

echo bin2hex($cipher->encrypt('test'));
```

Decryption with Node.js / [CryptoJS](https://github.com/brix/crypto-js):

```javascript
var CryptoJS = require('crypto-js');

var key = CryptoJS.enc.Utf8.parse('aaaaaaaaaaaaaaaa');
var iv = CryptoJS.enc.Utf8.parse('bbbbbbbbbbbbbbbb');
var ciphertext = CryptoJS.enc.Hex.parse('10f42fd95857ed2775cfbc4b471bc213');
ciphertext = {ciphertext: ciphertext};

var plaintext = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC
});

console.log(plaintext.toString(CryptoJS.enc.Utf8));
```

### RSA Decryption

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

Decryption with Node.js:

```javascript
var crypto = require('crypto');

var ciphertext = "L812/9Y8TSpwErlLR6Bz4J3uR/T5YaqtTtB5jxtD1qazGPI5t15V9drWi58colGOZFeCnGKpCrtQWKk4HWRocQ==";

ciphertext = Buffer.from(ciphertext, 'base64');

var key = `-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf9Cnzj4p4WGeKLs1Pt8Qu
KUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQJAIJLixBy2qpFoS4DSmoEm
o3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2k
TQIhAKMSvzIBnni7ot/OSie2TmJLY4SwTQAevXysE2RbFDYdAiEBCUEaRQnMnbp7
9mxDXDf6AU0cN/RPBjb9qSHDcWZHGzUCIG2Es59z8ugGrDY+pxLQnwfotadxd+Uy
v/Ow5T0q5gIJAiEAyS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3okCIBOs
/5OiPgoTdSy7bcF9IGpSE8ZgGKzgYQVZeN97YE00
-----END RSA PRIVATE KEY-----`;

key = crypto.createPrivateKey(key);

var plaintext = crypto.privateDecrypt(
    {
        key: key,
        padding: crypto.constants.RSA_PKCS1_PADDING
    },
    ciphertext
);

console.log(plaintext.toString('ascii'));
```

PKCS8 keys are supported as well as OAEP padding.

### RSA Decryption with NodeRSA

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

Decryption with Node.js / [NodeRSA](https://github.com/rzcoder/node-rsa):

```javascript
var NodeRSA = require('node-rsa');

var key = new NodeRSA(`-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf9Cnzj4p4WGeKLs1Pt8Qu
KUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQJAIJLixBy2qpFoS4DSmoEm
o3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2k
TQIhAKMSvzIBnni7ot/OSie2TmJLY4SwTQAevXysE2RbFDYdAiEBCUEaRQnMnbp7
9mxDXDf6AU0cN/RPBjb9qSHDcWZHGzUCIG2Es59z8ugGrDY+pxLQnwfotadxd+Uy
v/Ow5T0q5gIJAiEAyS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3okCIBOs
/5OiPgoTdSy7bcF9IGpSE8ZgGKzgYQVZeN97YE00
-----END RSA PRIVATE KEY-----`);
key.setOptions({encryptionScheme: 'pkcs1'});

var ciphertext = 'L812/9Y8TSpwErlLR6Bz4J3uR/T5YaqtTtB5jxtD1qazGPI5t15V9drWi58colGOZFeCnGKpCrtQWKk4HWRocQ==';

var plaintext = key.decrypt(ciphertext, 'base64');
plaintext = Buffer.from(plaintext, 'base64');
console.log(plaintext.toString());
```
PKCS8 keys are supported as is OAEP padding.

## C#

### AES-128-CBC Decryption

Encrypting a string using AES-128-CBC with phpseclib:

```php
use phpseclib3\Crypt\AES;

$cipher = new AES('cbc');
$cipher->setKey(str_repeat('a', 16));
$cipher->setIV(str_repeat('b', 16));

echo bin2hex($cipher->encrypt('test'));
```

Decryption with C#:

```c#
using System;
using System.Security.Cryptography;
using System.Text;
using System.IO;

class Test
{
    // from https://stackoverflow.com/a/311179/569976
    public static byte[] StringToByteArray(String hex)
    {
        int NumberChars = hex.Length;
        byte[] bytes = new byte[NumberChars / 2];
        for (int i = 0; i < NumberChars; i += 2)
            bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
          return bytes;
    }

    static void Main()
    {
        var ciphertext = StringToByteArray("10f42fd95857ed2775cfbc4b471bc213");

        var aes = new AesManaged();
        //aes.Mode = CipherMode.CBC;
        var key = Encoding.ASCII.GetBytes("aaaaaaaaaaaaaaaa");
        var iv = Encoding.ASCII.GetBytes("bbbbbbbbbbbbbbbb");

        ICryptoTransform decryptor = aes.CreateDecryptor(key, iv);
        MemoryStream msDecrypt = new MemoryStream(ciphertext);
        CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read);
        StreamReader srDecrypt = new StreamReader(csDecrypt);
        String plaintext = srDecrypt.ReadToEnd();

        Console.WriteLine(plaintext);
    }
}
```

### RSA Decryption

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

Decryption with C#
<!-- csc test.cs && mono test.exe -->

```c#
using System;
using System.Security.Cryptography;
using System.Text;

class Test
{
    static void Main()
    {
        var key = @"<RSAKeyPair>
  <Modulus>qPfgaTEWEP3S9w0tgsicURfo+nLW09/0KfOPinhYZ4ouzU+3xC4pSlEp8Ut9FgL0AgqNslNaK34Kq+NZjO9DAQ==</Modulus>
  <Exponent>AQAB</Exponent>
  <P>oxK/MgGeeLui385KJ7ZOYktjhLBNAB69fKwTZFsUNh0=</P>
  <Q>AQlBGkUJzJ26e/ZsQ1w3+gFNHDf0TwY2/akhw3FmRxs1</Q>
  <DP>bYSzn3Py6AasNj6nEtCfB+i1p3F35TK/87DlPSrmAgk=</DP>
  <DQ>yS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3ok=</DQ>
  <InverseQ>E6z/k6I+ChN1LLttwX0galITxmAYrOBhBVl433tgTTQ=</InverseQ>
  <D>IJLixBy2qpFoS4DSmoEmo3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2kTQ==</D>
</RSAKeyPair>";

        var ciphertext = "L812/9Y8TSpwErlLR6Bz4J3uR/T5YaqtTtB5jxtD1qazGPI5t15V9drWi58colGOZFeCnGKpCrtQWKk4HWRocQ==";

        var ciphertextBytes = Convert.FromBase64String(ciphertext);

        var rsa = RSA.Create();
        rsa.FromXmlString(key);

        var plaintextBytes = rsa.Decrypt(ciphertextBytes, RSAEncryptionPadding.Pkcs1);

        var plaintext = Encoding.Default.GetString(plaintextBytes);

        Console.WriteLine(plaintext);
    }
}
```
Note that `rsa.FromXmlString(key)` only supports XML formatted keys (as the name implies lol).

If you're using .NET Core 3.0+ / are _not_ using [Mono](https://en.wikipedia.org/wiki/Mono_(software)), [ImportRSAPrivateKey](https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.rsa.importrsaprivatekey?view=netcore-3.0) can be used to load PKCS1 formatted keys, using the following (untested) changes to the above (using the [phpBB MOD Text Template](https://wiki.phpbb.com/MOD_Text_Template)):

```c#
#
#-----[ FIND ]------------------------------------------
#
using System.Text;
#
#-----[ AFTER, ADD ]------------------------------------
#
using System.Text.RegularExpressions;
#
#-----[ FIND ]------------------------------------------
#
        var key = @"<RSAKeyPair>
  <Modulus>qPfgaTEWEP3S9w0tgsicURfo+nLW09/0KfOPinhYZ4ouzU+3xC4pSlEp8Ut9FgL0AgqNslNaK34Kq+NZjO9DAQ==</Modulus>
  <Exponent>AQAB</Exponent>
  <P>oxK/MgGeeLui385KJ7ZOYktjhLBNAB69fKwTZFsUNh0=</P>
  <Q>AQlBGkUJzJ26e/ZsQ1w3+gFNHDf0TwY2/akhw3FmRxs1</Q>
  <DP>bYSzn3Py6AasNj6nEtCfB+i1p3F35TK/87DlPSrmAgk=</DP>
  <DQ>yS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3ok=</DQ>
  <InverseQ>E6z/k6I+ChN1LLttwX0galITxmAYrOBhBVl433tgTTQ=</InverseQ>
  <D>IJLixBy2qpFoS4DSmoEmo3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2kTQ==</D>
</RSAKeyPair>";
#
#-----[ REPLACE WITH ]----------------------------------
#
        var key = @"-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf9Cnzj4p4WGeKLs1Pt8Qu
KUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQJAIJLixBy2qpFoS4DSmoEm
o3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2k
TQIhAKMSvzIBnni7ot/OSie2TmJLY4SwTQAevXysE2RbFDYdAiEBCUEaRQnMnbp7
9mxDXDf6AU0cN/RPBjb9qSHDcWZHGzUCIG2Es59z8ugGrDY+pxLQnwfotadxd+Uy
v/Ow5T0q5gIJAiEAyS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3okCIBOs
/5OiPgoTdSy7bcF9IGpSE8ZgGKzgYQVZeN97YE00
-----END RSA PRIVATE KEY-----";
#
#-----[ FIND ]------------------------------------------
#
        rsa.FromXmlString(key);
#
#-----[ REPLACE WITH ]----------------------------------
#
        var rx = new Regex("-+[^-]+-+");
        key = rx.Replace(key, "")
                .Replace("\r", "")
                .Replace("\n", "");
        var keyBytes = Convert.FromBase64String(key);

        rsa.ImportRSAPrivateKey(keyBytes, out _);
```
[ImportPkcs8PrivateKey](https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.rsa.importpkcs8privatekey) can be used to load PKCS8 formatted keys.

Now let us consider OAEP decryption. Here's the phpseclib to generate OAEP encrypted strings:

```php
use phpseclib3\Crypt\PublicKeyLoader;

$key = PublicKeyLoader::load('-----BEGIN RSA PUBLIC KEY-----
MEgCQQCo9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp84+KeFhnii7NT7fELilKUSnx
S30WAvQCCo2yU1orfgqr41mM70MBAgMBAAE=
-----END RSA PUBLIC KEY-----');
$key = $key
    //->withPadding(RSA::ENCRYPTION_OAEP)
    ->withHash('sha1')
    ->withMGFHash('sha1');
echo base64_encode($key->encrypt('test'));
```
<sup>_(sha1 is being used because the key is a 512-bit key from [Sample RSA Keys](/docs/rsa-keys); 512-bits is used for brevity but because it's 512-bits sha256 can't be used per the max size formulas discussed at [RSA::ENCRYPTION_OAEP](/docs/rsa#rsaencryption_oaep))_</sup>

Here are the modifications we need to do to the above C# program to perform OAEP decryption:

```c#
#
#-----[ FIND ]------------------------------------------
#
        var ciphertext = "L812/9Y8TSpwErlLR6Bz4J3uR/T5YaqtTtB5jxtD1qazGPI5t15V9drWi58colGOZFeCnGKpCrtQWKk4HWRocQ==";
#
#-----[ REPLACE WITH ]----------------------------------
#
        var ciphertext = "XZ/zwGTyLwm3S1A2N7vg87qlpqtqB4sLo5t6BlayLIfW3kICEiol46ryz/oSsOypAH6GKxcn5TvQF/gJvMOFBg==";
#
#-----[ FIND ]------------------------------------------
#
        var plaintextBytes = rsa.Decrypt(ciphertextBytes, RSAEncryptionPadding.Pkcs1);
#
#-----[ REPLACE WITH ]----------------------------------
#
        var plaintextBytes = rsa.Decrypt(ciphertextBytes, RSAEncryptionPadding.OaepSHA1);
```
If you want or need to use non-matching MGFHash and Hash algorithms in OAEP then you'll need to use [BouncyCastle](https://www.bouncycastle.org/csharp/index.html).

### RSA Signature Verification

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

Signature verification with C#:

```c#
using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

class Test
{
    static void Main()
    {
        var key = @"<RSAKeyValue>
  <Modulus>qPfgaTEWEP3S9w0tgsicURfo+nLW09/0KfOPinhYZ4ouzU+3xC4pSlEp8Ut9FgL0AgqNslNaK34Kq+NZjO9DAQ==</Modulus>
  <Exponent>AQAB</Exponent>
</RSAKeyValue>";

        var signature = "MUE536c4UJSAmycs7V6qFaLMATrKMQA8TYj5xX1+fwHINz3/BafgaRt0ycoD5IxTxaclLWavrGSza4xSBHraEw==";
        var data = "zzz";

        var signatureBytes = Convert.FromBase64String(signature);
        var dataBytes = Encoding.ASCII.GetBytes(data);

        var rsa = RSA.Create();
        rsa.FromXmlString(key);

        var result = rsa.VerifyData(dataBytes, signatureBytes, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);

        Console.WriteLine(result ? "valid" : "invalid");
    }
}
```
Using [RSAPKCS1SignatureDeformatter](https://docs.microsoft.com/en-us/dotnet/api/system.security.cryptography.rsapkcs1signaturedeformatter?view=netcore-3.0) is not recommended because that class requires you hash the data and then compare that to the hash in the signature. ie. it's more steps and more opportunities to screw up.

## C

All C code samples use [OpenSSL](https://en.wikipedia.org/wiki/OpenSSL).

### RSA Decryption

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

Decryption with C:
<!-- gcc -x c test.c -lcrypto && ./a.out -->

```c
#include <openssl/evp.h>
#include <openssl/pem.h>
#include <string.h>

int main (void)
{
    char privateKey[] = "-----BEGIN RSA PRIVATE KEY-----\n"\
"MIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf9Cnzj4p4WGeKLs1Pt8Qu\n"\
"KUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQJAIJLixBy2qpFoS4DSmoEm\n"\
"o3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2k\n"\
"TQIhAKMSvzIBnni7ot/OSie2TmJLY4SwTQAevXysE2RbFDYdAiEBCUEaRQnMnbp7\n"\
"9mxDXDf6AU0cN/RPBjb9qSHDcWZHGzUCIG2Es59z8ugGrDY+pxLQnwfotadxd+Uy\n"\
"v/Ow5T0q5gIJAiEAyS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3okCIBOs\n"\
"/5OiPgoTdSy7bcF9IGpSE8ZgGKzgYQVZeN97YE00\n"\
"-----END RSA PRIVATE KEY-----\n";
    char ciphertext[] = "L812/9Y8TSpwErlLR6Bz4J3uR/T5YaqtTtB5jxtD1qazGPI5t15V9drWi58colGOZFeCnGKpCrtQWKk4HWRocQ==";

    // base64 decode ciphertext
    EVP_DecodeBlock(ciphertext, ciphertext, strlen(ciphertext));

    BIO* bo = BIO_new(BIO_s_mem());
    BIO_write(bo, privateKey, strlen(privateKey));
    EVP_PKEY* pkey = 0;
    PEM_read_bio_PrivateKey(bo, &pkey, 0, 0);
    BIO_free(bo);

    EVP_PKEY_CTX *ctx = EVP_PKEY_CTX_new(pkey, NULL);
    EVP_PKEY_decrypt_init(ctx);
    EVP_PKEY_CTX_ctrl_str(ctx, "rsa_padding_mode", "pkcs1");

    size_t plaintext_len;
    unsigned char* plaintext;

    // determine output size
    EVP_PKEY_decrypt(ctx, NULL, &plaintext_len, ciphertext, strlen(ciphertext));

    // allocate memory (+1 for terminating null-character)
    plaintext = OPENSSL_malloc(plaintext_len + 1);
    EVP_PKEY_decrypt(ctx, plaintext, &plaintext_len, ciphertext, strlen(ciphertext));
    plaintext[plaintext_len] = '\0'; // required for %s

    printf("%s\n", plaintext);
}
```
PKCS8 private keys can be loaded using this technique as well. OAEP is also supported.

Here's the phpseclib code to encrypt something with OAEP:

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
<sup>_(sha1 is being used because the key is a 512-bit key from [Sample RSA Keys](/docs/rsa-keys); 512-bits is used for brevity but because it's 512-bits sha256 can't be used per the max size formulas discussed at [RSA::ENCRYPTION_OAEP](/docs/rsa#rsaencryption_oaep))_</sup>

To decrypt that with C / OpenSSL you'll need to make the following changes to the above C code (using the [phpBB MOD Text Template](https://wiki.phpbb.com/MOD_Text_Template)):

```c
#
#-----[ FIND ]------------------------------------------
#
    char ciphertext[] = "L812/9Y8TSpwErlLR6Bz4J3uR/T5YaqtTtB5jxtD1qazGPI5t15V9drWi58colGOZFeCnGKpCrtQWKk4HWRocQ==";
#
#-----[ REPLACE WITH ]----------------------------------
#
    char ciphertext[] = "h3j3zLT2jXCaZuwF7cgUE/Zmc/5IsIfKbaTiBhpCJo86AiyuoA3Yvni+Lrm5wu2OGv2h5R7Zu3voFcHugiystw==";
#
#-----[ FIND ]------------------------------------------
#
    EVP_PKEY_CTX_ctrl_str(ctx, "rsa_padding_mode", "pkcs1");
#
#-----[ REPLACE WITH ]----------------------------------
#
    EVP_PKEY_CTX_ctrl_str(ctx, "rsa_padding_mode", "oaep");
    EVP_PKEY_CTX_ctrl_str(ctx, "rsa_oaep_md", "md5");
    EVP_PKEY_CTX_ctrl_str(ctx, "rsa_mgf1_md", "sha1");
    //EVP_PKEY_CTX_ctrl_str(ctx, "rsa_oaep_label", "");
```
The parameters passed to `EVP_PKEY_CTX_ctrl_str` correspond to the [pkeyopt values in pkeyutil](https://www.openssl.org/docs/man1.1.1/man1/openssl-pkeyutl.html).

An older API for decrypting RSA does exist but the hash and the MGF hash are hard-coded as sha1 for OAEP (which are the [default values in the ASN.1 definition of RSAES-OAEP-params in PKCS1](https://datatracker.ietf.org/doc/html/rfc8017#appendix-A.2.1)).

Here's an example of PKCS1 decryption with that older API:

```c
#include <openssl/evp.h>
#include <openssl/pem.h>
#include <string.h>

int main (void)
{
    char privateKey[] = "-----BEGIN RSA PRIVATE KEY-----\n"\
"MIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf9Cnzj4p4WGeKLs1Pt8Qu\n"\
"KUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQJAIJLixBy2qpFoS4DSmoEm\n"\
"o3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2k\n"\
"TQIhAKMSvzIBnni7ot/OSie2TmJLY4SwTQAevXysE2RbFDYdAiEBCUEaRQnMnbp7\n"\
"9mxDXDf6AU0cN/RPBjb9qSHDcWZHGzUCIG2Es59z8ugGrDY+pxLQnwfotadxd+Uy\n"\
"v/Ow5T0q5gIJAiEAyS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3okCIBOs\n"\
"/5OiPgoTdSy7bcF9IGpSE8ZgGKzgYQVZeN97YE00\n"\
"-----END RSA PRIVATE KEY-----\n";
    char ciphertext[] = "L812/9Y8TSpwErlLR6Bz4J3uR/T5YaqtTtB5jxtD1qazGPI5t15V9drWi58colGOZFeCnGKpCrtQWKk4HWRocQ==";

    // base64 decode ciphertext
    EVP_DecodeBlock(ciphertext, ciphertext, strlen(ciphertext));

    BIO* bo = BIO_new(BIO_s_mem());
    BIO_write(bo, privateKey, strlen(privateKey));
    EVP_PKEY* pkey = 0;
    PEM_read_bio_PrivateKey(bo, &pkey, 0, 0);
    BIO_free(bo);
    RSA* rsa = EVP_PKEY_get1_RSA(pkey);
    char plaintext[RSA_size(rsa)];

    RSA_private_decrypt(strlen(ciphertext), ciphertext, plaintext, rsa, RSA_PKCS1_PADDING);
    printf("%s\n", plaintext);
}
```
To do OAEP with that API you'd swap out `RSA_PKCS1_PADDING` with `RSA_PKCS1_OAEP_PADDING`.

## PHP

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