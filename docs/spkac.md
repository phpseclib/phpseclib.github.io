---
id: spkac
title: SPKAC
---

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="/js/jquery.treeview.js"></script>
<link rel="stylesheet" href="/css/jquery.treeview.css">
<script>
var showPath = function() {
  path = '';
  parents = $(this).parents('li:visible');
  for (var i = parents.length - 1; i >= 0; i--) {
    name = $('.name', parents[i])[0].textContent;
    delimiter = isNaN(name) ? '\'' : '';
    path+= '[' + delimiter + name + delimiter + ']';
  }
  $('#path').html('<code id="path">$csr' + path + '</code>:');
};
$(document).ready(function() {
  $('.printr').treeview({
     persist: "location",
     collapsed: true,
     unique: true
   });
   $('.name,.hitarea').click(showPath);
   $('#path').html('<code id="path">$csr</code>');
});
</script>

## Reading SPKACs

```php
use phpseclib3\File\X509;

$x509 = new X509();
$csr = $x509->loadSPKAC(file_get_contents('spkac.txt'));

var_dump($csr);
```
<span style="font-size: 11px">([download spkac.txt](/x509/spkac.txt))</span>

Running the above will produce an array that looks something like this:

<code id="path">$csr</code>
<ul class="printr"><li><span class="name">publicKeyAndChallenge</span><ul><li><span class="name">spki</span><ul><li><span class="name">algorithm</span><ul><li><span class="name">algorithm</span><ul><li>rsaEncryption</li></ul></li><li><span class="name">parameters</span><ul><li><span class="name">null</span><ul><li></li></ul></li></ul></li></ul></li><li><span class="name">subjectPublicKey</span><ul><li>

```
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCM00BBEr4iRFui8QRALkTZ/yJj
TbVsemyekfIYlIsmqolpgkhXNkXv2RNSkM8yWGS7+45YEo2Vb3X98/2z+8j4b24c
eB5g0Z6B/RXc6EpvHnX1GYMYofsfjP2U3is8qYWvuzPvmc7xD+QOb6wF5p9FXSOG
jXmnuljjPaeLwAF3AwIDAQAB
-----END PUBLIC KEY-----
```
</li></ul></li></ul></li><li><span class="name">challenge</span><ul><li>123456789</li></ul></li></ul></li><li><span class="name">signatureAlgorithm</span><ul><li><span class="name">algorithm</span><ul><li>md5WithRSAEncryption</li></ul></li><li><span class="name">parameters</span><ul><li><span class="name">null</span><ul><li></li></ul></li></ul></li></ul></li><li><span class="name">signature</span><ul><li>...</li></ul></li></ul>

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