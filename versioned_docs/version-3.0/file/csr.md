---
title: CSR
---

## Reading CSRs

```php
use phpseclib3\File\X509;

$x509 = new X509();
$csr = $x509->loadCSR(file_get_contents('csr.csr'));

var_dump($csr);
```
<sup>([download csr.csr](pathname:///asn1/csr.txt))</sup>

Running the above will produce an array that looks something like this:

<div class="tree">
<details>
  <summary>certificationRequestInfo</summary>
<details>
<summary>version</summary>
<div>v1</div>
</details>
<details>
  <summary>subject</summary>
<details>
  <summary>rdnSequence</summary>
<details>
  <summary>0</summary>
<details>
  <summary>0</summary>
<details>
<summary>type</summary>
<div>id-at-organizationName</div>
</details>
<details>
  <summary>value</summary>
<details>
<summary>utf8String</summary>
<div>phpseclib demo cert</div>
</details>
</details>
</details>
</details>
</details>
</details>
<details>
  <summary>subjectPKInfo</summary>
<details>
  <summary>algorithm</summary>
<details>
<summary>algorithm</summary>
<div>rsaEncryption</div>
</details>
</details>
<details>
<summary>subjectPublicKey</summary>
<div><pre>-----BEGIN PUBLIC KEY-----
MIGdMAsGCSqGSIb3DQEBAQOBjQAwgYkCgYEApQBlwwoORvSZqUmpL5poADLWsRBx
55tLs3Yq8ZfbkSo8nHetbPnOukIP/Nlxn3n/MGOvsXQa9NLisLQ6UmyLyJXXVW8F
n6pCQIpnygjNbocgs6uj47UEXDwMwlfLKPZ80M7hmMphZZ4Ub/IBe0S5KN77YxYv
FKGKfMNXKZWx1/8CAwEAAQ==
-----END PUBLIC KEY-----</pre></div>
</details>
</details>
</details>
<details>
  <summary>signatureAlgorithm</summary>
<details>
<summary>algorithm</summary>
<div>sha1WithRSAEncryption</div>
</details>
</details>
<details>
<summary>signature</summary>
<div>...</div>
</details>
</div>

### getDNProp()

```php
print_r($x509->getDNProp('O'));
```
That will produce the following:

<div class="tree">
<details>
<summary>0</summary>
<div>phpseclib demo cert</div>
</details>
</div>

An array is returned because each distinguished name property can (in theory) have multiple values

Valid property names are enumerated upon at [Distinguished Property Names](dnprops.md).

### getDN()

```php
print_r($x509->getDN());
```

`getDN()` accepts several different parameters:

- `X509::DN_ARRAY` (the default value) returns an array who's keys are based on the ASN.1 syntax for X.509:
  <div class="tree">
  <details>
    <summary>rdnSequence</summary>
  <details>
    <summary>0</summary>
  <details>
    <summary>0</summary>
  <details>
  <summary>type</summary>
  <div>id-at-organizationName</div>
  </details>
  <details>
    <summary>value</summary>
  <details>
  <summary>utf8String</summary>
  <div>phpseclib demo cert</div>
  </details>
  </details>
  </details>
  </details>
  </details>
  </div>

- `X509::DN_STRING` returns an OpenSSL-style string:
  ```
  O=phpseclib demo cert
  ```

- `X509::DN_OPENSSL` returns an OpenSSL-style array:

  <div class="tree">
  <details>
  <summary>O</summary>
  <div>phpseclib demo cert</div>
  </details>
  </div>

- `X509::DN_ASN1` returns a DER encoded binary string
- `X509::DN_CANON` returns a "canonicalized" DER encoded binary string wherein SEQUENCE around RDNs and all string values normalized as trimmed lowercase UTF-8 with all spacing as one blank. Constructed RDNs are not canonicalized.

### getPublicKey()

```php
echo $x509->getPublicKey();
```
Returns a `\phpseclib3\Crypt\Common\PublicKey` object that, by default, gets cast to a PKCS8-encoded public key:

```
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQClAGXDCg5G9JmpSakvmmgAMtax
EHHnm0uzdirxl9uRKjycd61s+c66Qg/82XGfef8wY6+xdBr00uKwtDpSbIvIlddV
bwWfqkJAimfKCM1uhyCzq6PjtQRcPAzCV8so9nzQzuGYymFlnhRv8gF7RLko3vtj
Fi8UoYp8w1cplbHX/wIDAQAB
-----END PUBLIC KEY-----
```

## Validating Signatures

CSR's are always self-signed.

```php
$x509 = new X509();
$csr = $x509->loadCSR(file_get_contents('csr.csr'));
echo $x509->validateSignature() ? 'valid' : 'invalid';
```

## Creating CSRs: An Example

```php
use phpseclib3\File\X509;
use phpseclib3\Crypt\RSA;

$privKey = RSA::createKey();

$x509 = new X509();
$x509->setPrivateKey($privKey);
$x509->setDNProp('id-at-organizationName', 'phpseclib demo cert');

$csr = $x509->signCSR();

echo $x509->saveCSR($csr);
```

Domains can be added to a CSR by doing `$x509->setDomain('www.domain.tld')`. Note that whereas `$x509->setDomain()` can be used to add multiple domains for X.509 certificates only one domain can be added, with this approach, to CSRs. This is a limitation of phpseclib - not of the CSR format.

Multiple domains may be added by doing the following (using the [phpBB MOD Text Template](phpbb.md#actions)):

```php
#
#-----[ FIND ]------------------------------------------
#
$csr = $x509->signCSR();
#
#-----[ BEFORE, ADD ]-----------------------------------
#
$x509->loadCSR($x509->saveCSR($x509->signCSR()));
$x509->setExtension('id-ce-subjectAltName', [
    ['dNSName' => 'www.domain.tld'],
    ['dNSName' => 'domain.tld']
]);
```
