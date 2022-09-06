---
id: javascript
title: JavaScript
---

## RSA Decryption with Web Crypto API

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