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

ciphertextBytes = base64.decodebytes(ciphertext.encode('ascii'))

cipher = PKCS1_v1_5.new(key)
sentinel = Random.new().read(key.size_in_bytes())
plaintext = cipher.decrypt(ciphertextBytes, sentinel)

print(plaintext)
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
    ->withPadding(RSA::ENCRYPTION_OAEP)
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

org.bouncycastle.jce.provider.BouncyCastleProvider assumes the MGFHash and the Hash are using the same algorithm whereas com.sun.crypto.provider.SunJCE has the MGFHash hard-coded as sha1.

More information can be found at [Breaking down RSA/ECB/OAEPWithSHA-256AndMGF1Padding](https://stackoverflow.com/a/32166210/569976).

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

## C#

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

        var ciphertext= "L812/9Y8TSpwErlLR6Bz4J3uR/T5YaqtTtB5jxtD1qazGPI5t15V9drWi58colGOZFeCnGKpCrtQWKk4HWRocQ==";

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
OAEP encryption is also supported.

To load PKCS8 formatted keys [BouncyCastle](https://www.bouncycastle.org/csharp/index.html) can be used.

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
    RSA* rsa = EVP_PKEY_get1_RSA(pkey);
    char plaintext[RSA_size(rsa)];

    RSA_private_decrypt(strlen(ciphertext), ciphertext, plaintext, rsa, RSA_PKCS1_PADDING);
    printf("%s\n", plaintext);
}
```
PKCS8 private keys can be loaded using this technique as well. OAEP is also supported.

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
OAEP padding is supported but [only with sha1 as the hash / MGF hash](https://www.php.net/manual/en/function.openssl-public-encrypt.php#118466).