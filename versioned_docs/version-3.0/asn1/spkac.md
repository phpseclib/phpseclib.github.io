---
title: SPKAC
---

## Reading SPKACs

```php
use phpseclib3\File\X509;

$x509 = new X509();
$csr = $x509->loadSPKAC(file_get_contents('spkac.txt'));

var_dump($csr);
```
<sup>([download spkac.txt](pathname:///asn1/spkac.txt))</sup>

Running the above will produce an array that looks something like this:

<div class="tree">
<details>
  <summary>publicKeyAndChallenge</summary>
<details>
  <summary>spki</summary>
<details>
  <summary>algorithm</summary>
<details>
<summary>algorithm</summary>
<div>rsaEncryption</div>
</details>
<details>
  <summary>parameters</summary>
<details>
<summary>null</summary>
<div></div>
</details>
</details>
</details>
<details>
<summary>subjectPublicKey</summary>
<div>-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCM00BBEr4iRFui8QRALkTZ/yJj
TbVsemyekfIYlIsmqolpgkhXNkXv2RNSkM8yWGS7+45YEo2Vb3X98/2z+8j4b24c
eB5g0Z6B/RXc6EpvHnX1GYMYofsfjP2U3is8qYWvuzPvmc7xD+QOb6wF5p9FXSOG
jXmnuljjPaeLwAF3AwIDAQAB
-----END PUBLIC KEY-----</div>
</details>
</details>
<details>
<summary>challenge</summary>
<div>123456789</div>
</details>
</details>
<details>
  <summary>signatureAlgorithm</summary>
<details>
<summary>algorithm</summary>
<div>md5WithRSAEncryption</div>
</details>
<details>
  <summary>parameters</summary>
<details>
<summary>null</summary>
<div></div>
</details>
</details>
</details>
<details>
<summary>signature</summary>
<div>...</div>
</details>
</div>

### getPublicKey()

```php
echo $x509->getPublicKey();
```
Returns a `\phpseclib3\Crypt\Common\PublicKey` object that, by default, gets cast to a PKCS8-encoded public key:

```
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCM00BBEr4iRFui8QRALkTZ/yJj
TbVsemyekfIYlIsmqolpgkhXNkXv2RNSkM8yWGS7+45YEo2Vb3X98/2z+8j4b24c
eB5g0Z6B/RXc6EpvHnX1GYMYofsfjP2U3is8qYWvuzPvmc7xD+QOb6wF5p9FXSOG
jXmnuljjPaeLwAF3AwIDAQAB
-----END PUBLIC KEY-----
```

## Validating Signatures

SPKAC's are always self-signed.

```php
$x509 = new X509();
$csr = $x509->loadSPKAC(file_get_contents('spkac.txt'));
echo $x509->validateSignature() ? 'valid' : 'invalid';
```

## Creating SPKACs: An Example

```php
use phpseclib3\File\X509;
use phpseclib3\Crypt\RSA;

$privKey = RSA::createKey();

$x509 = new X509();
$x509->setPrivateKey($privKey);
$x509->setChallenge('123456789');
$csr = $x509->signSPKAC();

echo $x509->saveSPKAC($csr);
```