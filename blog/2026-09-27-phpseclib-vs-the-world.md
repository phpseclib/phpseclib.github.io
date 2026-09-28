---
slug: phpseclib-vs-the-world
title: issuer.sign(subject) vs subject.signedBy(issuer) aka phpseclib vs the rest of the world
sidebar_label: issuer.sign(subject) vs subject.signedBy(issuer)
title_meta: "issuer.sign(subject) vs subject.signedBy(issuer): phpseclib vs the rest of the world"
authors: [terrafrost]
tags: [x509,signing,api-design,comparison]
---

Most OOP X509 implementations do something roughly analogous to `subject.signedBy(issuer)`. Since it doesn't make any sense for the (unsigned) subject to modify the issuer the two choices this leaves you with are: return the signed subject or modify the invoker (the subject) to include the signature.

phpseclib 4 flips this on its head. Instead of the invoker being the subject the invoker is the issuer. The subject is modified and the string that is the signature is returned. (Technically, the signature can be an array, as well, for EC / DSA objects with a signature format of Raw, but that's neither here nor there).

<!-- truncate -->

## issuer.sign(subject) advantages

**Mirrors How People Actually Speak**
Maybe [Yoda](https://en.wikipedia.org/wiki/Yoda) might say "my report card, please sign, Dad" ([object-verb-subject](https://en.wikipedia.org/wiki/Object%E2%80%93verb%E2%80%93subject_word_order)) but actual humans tend to say "Dad, please sign my report card" ([subject-verb-object](https://en.wikipedia.org/wiki/Subject%E2%80%93verb%E2%80%93object_word_order)).

**Mirrors How Signing Works When You Don't Have The Private Key**
If an [HSM](https://en.wikipedia.org/wiki/Hardware_security_module) is doing the signing, an API endpoint (e.g. [ACME](https://en.wikipedia.org/wiki/Automatic_Certificate_Management_Environment)), or even an [ssh-agent](https://en.wikipedia.org/wiki/Ssh-agent), you're not going to have the private key. They're typically high availability, sign multiple times and what you send to them is the subject to be signed - not the other way around. Besides, subjects are typically only ever signed once whereas Issuers often sign multiple times.

**Smart Signers**
Let's say you wanted an Issuer that only conditionally signs Subjects. With `subject.signedBy(issuer)` you'd have to wrap that in an if statement, at which point, you're basically doing procedural programming. With `issuer.sign(subject)` you just extend the Issuer, following the [open-closed principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle), and add a new if statement to the `sign()` method, conditionally calling `parent::sign()`.

**Resolves Ambiguities**
`subject.signedBy(issuer)` could easily be read as `subject.isSignedBy(issuer)`, a true/false check. `issuer.sign(subject)` can't be mistaken for one. The obvious fix, `subject.sign(issuer)`, reads as though the subject is signing the issuer, which gets it backwards.

## issuer.sign(subject) disadvantages

**Signature Invalidation When Changes Are Made After Signing**
In most libraries the object returned by `signedBy()` is not the same object that calls `signedBy()`, preventing modification after signing has taken place. That's not the case with phpseclib 4's approach. In theory, phpseclib 4 could prevent changes to the X509 certificate object after signing has taken place, however, phpseclib 4 is also aiming to be fuzzing friendly and if you want to intentionally create a certificate with a bad signature you should be able to do so. Also, what happens if you wanted to re-sign an existing X509 certificate? If you change an already signed X509 certificate without re-signing it you're invalidating the signature, but phpseclib 4 can't possibly know at the time you modify the certificate what your intentions are later on down the line.

As for why you'd want to re-sign an already signed X509 certificate...  maybe the CA cert that signed it has expired. Maybe a new private key was generated and a new CA cert to go along with it. Or maybe the company that owned the CA cert was bought out - they kept the private key but issued a new CA cert with a new Subject.

## phpseclib 4 (PHP)
With phpseclib 4 the most streamlined way to create a CA signed cert is to load the CA cert with [`X509::load()`](https://phpseclib.com/docs/file/x509#reading-certificates) and the CA private key with [`PublicKeyLoader::load()`](https://phpseclib.com/docs/publickeys/overview#loading-keys), add them to a PFX object with [`$pfx->add()`](https://phpseclib.com/docs/file/pfx#making-additions), create an X509 cert object with [`$x509 = new X509()`](https://phpseclib.com/docs/file/x509#creating-certificates) and then use the PFX to sign the X509 by doing [`$pfx->sign($x509)`](https://phpseclib.com/docs/file/pfx#creating-signatures).

### Code Sample
```php
use phpseclib4\Crypt\{EC, PublicKeyLoader};
use phpseclib4\File\{PFX, X509};

$caCert = X509::load(....);
$caKey = PublicKeyLoader::load(....);

$caPFX = new PFX();
$caPFX->add($caCert);
$caPFX->add($caKey);

$private = EC::createKey('nistp256');
$x509 = new X509($private->getPublicKey());
$x509->setSubjectDN('O=whatever');
$caPFX->sign($x509);

echo $x509;
```
In this example, `$caPFX->sign($x509)` is basically `issuer.sign(subject)`. The issuer DN of the newly produced certificate comes from `$caPFX` and the subject key identifier in the CA cert is automatically copied over to `$x509` as the authority key identifier. The serial number, if not explicitly specified, defaults to a random 160-bit positive number, and start and end dates default to the current time and one year from the current time, if not explicitly specified.

If you didn't want to use a PFX object you could sign `$x509` directly with the CA private key. e.g. `$caKey->sign($x509)`. If you did that you would have to manually set the issuer DN and the authority key identifier. That said, if you were going to go that route you could also use ssh-agent to sign. e.g.

```php
$agent = new \phpseclib4\System\SSH\Agent();
$agent->requestIdentities()[0]->sign($x509);
```
In this example the first identity is being used whereas in practice you'd probably want to find the identity that corresponded to the CA cert's public key but that's the general idea.

If you wanted to avoid using the whole `issuer.sign(subject)` paradigm then you could do this:

```php
$signature = $caKey->sign($x509['tbsCertificate']->getEncoded());
$x509['signature'] = new \phpseclib4\File\ASN1\Types\BitString("\0$signature");
```
You'd also need to set the algorithm identifiers, the issuer DN and the authority key identifier, etc, _before_ you created the signature.

## Rustls's rcgen (Rust)
With [Rustls](https://en.wikipedia.org/wiki/Rustls)'s rcgen you'd create a [CertificateParams struct](https://docs.rs/rcgen/latest/rcgen/struct.CertificateParams.html), set various fields and then you call the [`signed_by()` method](https://docs.rs/rcgen/latest/rcgen/struct.CertificateParams.html#method.signed_by), passing to it a [PublicKeyData trait](https://docs.rs/rcgen/latest/rcgen/trait.PublicKeyData.html) and an [Issuer struct](https://docs.rs/rcgen/latest/rcgen/struct.Issuer.html). `signed_by()`, in turn, returns a [Certificate struct](https://docs.rs/rcgen/latest/rcgen/struct.Certificate.html).

### Code Sample

```rust
use rcgen::{
    CertificateParams, DistinguishedName, DnType, Issuer, KeyPair,
};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let ca_cert_pem = ....;

    let ca_key_pem = ....;

    let ca_key_pair = KeyPair::from_pem(ca_key_pem)?;
    let issuer = Issuer::from_ca_cert_pem(ca_cert_pem, &ca_key_pair)?;

    let mut child_params = CertificateParams::new(vec![])?;

    let mut dn = DistinguishedName::new();
    dn.push(DnType::OrganizationName, "whatever");
    child_params.distinguished_name = dn;

    child_params.use_authority_key_identifier_extension = true;

    let child_key_pair = KeyPair::generate_for(&rcgen::PKCS_ECDSA_P256_SHA256)?;
    // could set child_key_pair to KeyPair::generate(), which defaults to nistp256 but this makes it explicit
    // KeyPair implements PublicKeyData
    let child_cert = child_params.signed_by(&child_key_pair, &issuer)?;

    println!("{}", child_cert.pem());

    Ok(())
}
```
If, in this example, public_key was a field instead of parameter to `signed_by()` then you'd have `child_params.signed_by(&issuer)`, which is basically `subject.signedBy(issuer)`. The issuer DN of the newly produced certificate comes from the issuer parameter of the `signed_by()` call. Also, whereas phpseclib 4 copies the authority key identifier from the issuer by default, Rustls's rcgen does not. Instead, with Rustls, you need to set `child_params.use_authority_key_identifier_extension` to true.

When not explicitly specified, the serial number is randomly generated and the start and end dates are Jan 1, 1975 and Jan 1, 4096.

This approach doesn't lend itself well to re-signing. Because certificates in Rustls's rcgen are immutable objects, you must copy the original parameters over.

## Bouncy Castle (Java and C#)
In [Bouncy Castle](https://en.wikipedia.org/wiki/Bouncy_Castle_(cryptography)) (available for both Java and C#) you have a [JcaX509v3CertificateBuilder](https://downloads.bouncycastle.org/java/docs/bcpkix-jdk18on-javadoc/org/bouncycastle/cert/jcajce/JcaX509v3CertificateBuilder.html#constructor-summary) object but instead of setting a bunch of fields in the newly initialized object you set them in the constructor. You then call the [`build()` method](https://downloads.bouncycastle.org/java/docs/bcpkix-jdk18on-javadoc/org/bouncycastle/cert/X509v3CertificateBuilder.html#build(org.bouncycastle.operator.ContentSigner)), passing to it an instance of [JcaContentSignerBuilder](https://downloads.bouncycastle.org/java/docs/bcpkix-jdk18on-javadoc/org/bouncycastle/operator/jcajce/JcaContentSignerBuilder.html), which is basically a thin wrapper around a private key.

### Code Sample

```java
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.Extension;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509ExtensionUtils;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.bouncycastle.openssl.jcajce.JcaPEMWriter;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;

import java.io.StringReader;
import java.io.StringWriter;
import java.math.BigInteger;
import java.security.*;
import java.security.cert.X509Certificate;
import java.security.spec.ECGenParameterSpec;
import java.util.Date;

public class Demo {
    public static void main(String[] args) throws Exception {
        Security.addProvider(new BouncyCastleProvider());

        String issuerCertPem = ....;

        String issuerKeyPem = ....;

        // 1. Parse CA Certificate
        PEMParser certParser = new PEMParser(new StringReader(issuerCertPem));
        X509CertificateHolder issuerCertHolder = (X509CertificateHolder) certParser.readObject();
        X509Certificate issuerCert = new JcaX509CertificateConverter().setProvider("BC").getCertificate(issuerCertHolder);

        // 2. Parse CA Private Key
        PEMParser keyParser = new PEMParser(new StringReader(issuerKeyPem));
        PrivateKeyInfo keyInfo = (PrivateKeyInfo) keyParser.readObject();
        PrivateKey issuerPrivateKey = new JcaPEMKeyConverter().setProvider("BC").getPrivateKey(keyInfo);

        // 3. Generate child key pair (EC P-256)
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("EC", "BC");
        kpg.initialize(new ECGenParameterSpec("secp256r1"));
        KeyPair childKeyPair = kpg.generateKeyPair();

        // 4. Construct certificate builder
        BigInteger serial = BigInteger.valueOf(System.currentTimeMillis());
        Date notBefore = new Date();
        Date notAfter = new Date(System.currentTimeMillis() + 365L * 24 * 60 * 60 * 1000);
        X500Name subject = new X500Name("O=whatever");

        JcaX509v3CertificateBuilder certBuilder = new JcaX509v3CertificateBuilder(
            issuerCert,
            serial,
            notBefore,
            notAfter,
            subject,
            childKeyPair.getPublic()
        );

        // 5. Explicitly add X.509 Key Identifier extensions
        JcaX509ExtensionUtils extUtils = new JcaX509ExtensionUtils();

        certBuilder.addExtension(
            Extension.authorityKeyIdentifier,
            false,
            extUtils.createAuthorityKeyIdentifier(issuerCert)
        );

        // 6. Sign with CA Private Key
        ContentSigner signer = new JcaContentSignerBuilder("SHA256withECDSA").setProvider("BC").build(issuerPrivateKey);
        X509CertificateHolder signedCertHolder = certBuilder.build(signer);
        X509Certificate childCert = new JcaX509CertificateConverter().setProvider("BC").getCertificate(signedCertHolder);

        // 7. Export signed certificate to PEM string
        StringWriter sw = new StringWriter();
        try (JcaPEMWriter pemWriter = new JcaPEMWriter(sw)) {
            pemWriter.writeObject(childCert);
        }

        System.out.println(sw);
    }
}
```
In this example, `certBuilder.build(signer)` is basically `subject.signedBy(issuer)`. The issuer DN of the newly produced certificate comes from the `issuerCert` parameter in the JcaX509v3CertificateBuilder constructor. Also, whereas phpseclib 4 copies the authority key identifier from the issuer by default, with Bouncy Castle, you need to explicitly copy it over.

The serial number and start and end dates are required parameters.

Existing certificates can be re-signed because one of the JcaX509v3CertificateBuilder constructors lets you pass a X509CertificateHolder instance into it.

## pyca/cryptography (Python)
In [pyca/cryptography](https://cryptography.io/en/latest/) you'd create an instance of [CertificateBuilder](https://cryptography.io/en/latest/x509/reference/#x-509-certificate-builder), chain a bunch of method calls together thanks to the class's [fluent interface](https://en.wikipedia.org/wiki/Fluent_interface) and then call the [`sign()` method](https://cryptography.io/en/latest/x509/reference/#cryptography.x509.CertificateBuilder.sign), with some sort of [private key object](https://cryptography.io/en/latest/hazmat/primitives/asymmetric/serialization/#cryptography.hazmat.primitives.serialization.load_pem_private_key) as a parameter, and in response, get an immutable [Certificate](https://cryptography.io/en/latest/x509/reference/#cryptography.x509.Certificate) instance returned back to you.

### Code Sample

```python
import datetime
from cryptography import x509
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import ec

issuer_cert_pem = ....

issuer_key_pem = ....

# 1. Load CA Certificate and CA Private Key
ca_cert = x509.load_pem_x509_certificate(issuer_cert_pem.encode())
ca_key = serialization.load_pem_private_key(issuer_key_pem.encode(), password=None)

# 2. Generate a new child private key (EC P-256)
child_key = ec.generate_private_key(ec.SECP256R1())

# 3. Build the new certificate from scratch
now = datetime.datetime.now(datetime.timezone.utc)

ca_ski = ca_cert.extensions.get_extension_for_class(x509.SubjectKeyIdentifier).value

builder = (
    x509.CertificateBuilder()
    .subject_name(x509.Name([x509.NameAttribute(x509.NameOID.ORGANIZATION_NAME, "whatever")]))
    .issuer_name(ca_cert.subject)
    .public_key(child_key.public_key())
    .serial_number(x509.random_serial_number())
    .not_valid_before(now)
    .not_valid_after(now + datetime.timedelta(days=365))
    .add_extension(
        x509.AuthorityKeyIdentifier.from_issuer_subject_key_identifier(ca_ski),
        critical=False,
    )
)

# 4. Sign with the CA's private key
cert = builder.sign(ca_key, hashes.SHA256())

# 5. Output signed certificate in PEM format
print(cert.public_bytes(serialization.Encoding.PEM).decode())
```
In this example, `builder.sign(ca_key, hashes.SHA256())` is basically `subject.signedBy(issuer)`. The issuer DN of the newly produced certificate comes from the `issuer_name(ca_cert.subject)` method call. Also, whereas phpseclib 4 copies the authority key identifier from the issuer by default, with pyca/cryptography, you need to explicitly copy it over.

Failure to explicitly set the serial number, the start date or the end date will result in an exception being thrown.

Existing certificates would need to have every property manually copied over from the immutable Certificate instance to a new mutable CertificateBuilder instance.

## Go
Go is the odd language out in that (1) X509 support is built in, natively and (2) certificate creation doesn't use OOP (Go has methods, and the x509 package uses them elsewhere, but `x509.CreateCertificate()` is a plain function). Because of that, the whole `issuer.sign(subject)` vs `subject.sign(issuer)` debate isn't really applicable. Instead, the way it works is...  you call a "[God function](https://en.wikipedia.org/wiki/God_object)" in the form of [x509.CreateCertificate](https://pkg.go.dev/crypto/x509#CreateCertificate) and pass to it the public key you want to use, the CA cert, the CA private key, a template that provides for all the X509 attributes and then out you get a byte array containing the newly generated / signed X509 certificate.

### Code Sample

```go
package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"fmt"
)

const issuerCertPem = ....

const issuerKeyPem = ....

func main() {
	// 1. Parse CA Certificate and Private Key
	certBlock, _ := pem.Decode([]byte(issuerCertPem))
	caCert, _ := x509.ParseCertificate(certBlock.Bytes)

	keyBlock, _ := pem.Decode([]byte(issuerKeyPem))
	caPrivateKey, _ := x509.ParsePKCS8PrivateKey(keyBlock.Bytes)

	// 2. Generate child key pair (EC P-256)
	childPrivateKey, _ := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)

	// 3. Construct certificate template
	template := x509.Certificate{
		Subject: pkix.Name{Organization: []string{"whatever"}},
	}

	// 4. Issue and sign certificate
	derBytes, _ := x509.CreateCertificate(
		rand.Reader,
		&template,
		caCert,
		&childPrivateKey.PublicKey,
		caPrivateKey,
	)

	// 5. Output PEM string
	certPem := pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: derBytes})
	fmt.Println(string(certPem))
}
```
In this example, both the issuer DN of the newly produced certificate and the authority key identifier are copied from the CA cert. The start and end date both default to Jan 1, 1 AD, if not explicitly specified, and, [as of Go 1.24 (released February 2025)](https://go.dev/doc/go1.24#cryptox509pkgcryptox509), serial numbers are optional, as well.

Insofar as re-signing an existing certificate is concerned...  calling the [`x509.ParseCertificate()` function](https://pkg.go.dev/crypto/x509#ParseCertificate) would return a struct. Once you have that struct you'd need to set the `ExtraExtensions` field of that struct to the `Extensions` field. Note that with `ExtraExtensions` "_values override any extensions that would otherwise be produced based on the other fields_" so, in practice, you'd need to remove the authority key identifier extension (OID 2.5.29.35), but that's left as an exercise for the reader.

## Summary

| | phpseclib 4 | rcgen | Bouncy Castle | pyca/cryptography | Go |
|---|---|---|---|---|---|
| **Paradigm** | `issuer.sign(subject)` | `subject.signedBy(issuer)` | `subject.signedBy(issuer)` | `subject.signedBy(issuer)` | plain function |
| **Issuer DN** | automatic (via PFX) | automatic (from `Issuer`) | from issuer cert passed to constructor | manual | automatic (from parent cert) |
| **Authority key identifier** | automatic (via PFX) | opt-in flag | manual | manual | automatic (from parent cert) |
| **Serial number** | optional (random 160-bit) | optional (random) | required | required | optional as of Go 1.24 |
| **Validity dates** | optional (now → +1 year) | optional (1975 → 4096) | required | required | optional (defaults to Jan 1, 1 AD) |
| **Signed output** | same mutable object | new immutable `Certificate` | new immutable `X509CertificateHolder` | new immutable `Certificate` | DER byte slice |
| **Re-signing** | in place | copy params into new `CertificateParams` | pass existing cert to builder constructor | copy every property into new builder | parse, copy `Extensions` to `ExtraExtensions` minus AKI |