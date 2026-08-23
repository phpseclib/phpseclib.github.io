---
title: Overview
---

phpseclib's `File` namespace handles the file formats that appear throughout public-key cryptography - certificates, certificate requests, key bundles, revocation lists, and signed/encrypted/compressed message containers. This
page is a map of what's covered and how the pieces fit together.

## The two families of File formats

The formats split into two groups:

### Identity & key material

These describe *who someone is* and *what keys they hold*. They're the building blocks of PKI.

| Format | What it is | Class |
| --- | --- | --- |
| [X.509](x509.mdx) | A [certificate](https://en.wikipedia.org/wiki/X.509) - a public key bound to an identity, signed by a CA | `phpseclib4\File\X509` |
| [CSR](csr.mdx) | A [Certificate Signing Request](https://en.wikipedia.org/wiki/Certificate_signing_request) - what you send to a CA to get an X.509 cert issued | `phpseclib4\File\CSR` |
| [SPKAC](spkac.mdx) | A simpler alternative to CSRs ([Signed Public Key And Challenge](https://en.wikipedia.org/wiki/SPKAC)) | `phpseclib4\File\SPKAC` |
| [CRL](crl.mdx) | A [Certificate Revocation List](https://en.wikipedia.org/wiki/Certificate_revocation_list) - what a CA publishes to announce that previously-issued certs are no longer valid | `phpseclib4\File\CRL` |
| [PFX](pfx.mdx) | A bundle ([PKCS #12](https://en.wikipedia.org/wiki/PKCS_12)) that packages a private key together with its certificate (and often a chain), optionally encrypted with a password | `phpseclib4\File\PFX` |

### Message wrapping

These take an arbitrary payload and do something to it - sign it, encrypt it, hash it, compress it - producing a self-describing
container that another implementation can unwrap. All four are variants of
the [Cryptographic Message Syntax](https://en.wikipedia.org/wiki/Cryptographic_Message_Syntax).

| Format | What it does | Class |
| --- | --- | --- |
| [SignedData](cms/signed.mdx) | Signs a payload so recipients can verify origin and integrity | `phpseclib4\File\CMS\SignedData` |
| [EncryptedData](cms/encrypted.mdx) | Encrypts a payload with a symmetric key | `phpseclib4\File\CMS\EncryptedData` |
| [DigestedData](cms/digested.mdx) | Attaches a hash of a payload (no signature) | `phpseclib4\File\CMS\DigestedData` |
| [CompressedData](cms/compressed.mdx) | Compresses a payload, typically as an inner layer before signing or encrypting | `phpseclib4\File\CMS\CompressedData` |

CMS containers stack. To sign-then-encrypt a payload, you wrap it in a `SignedData` and then wrap _that_ in an `EncryptedData`.

## Identifying a file by its contents

| If the file looks like... | It's probably... |
| --- | --- |
| `-----BEGIN CERTIFICATE-----` | An X.509 certificate → [X.509](x509.mdx) |
| `-----BEGIN CERTIFICATE REQUEST-----` | A CSR → [CSR](csr.mdx) |
| `-----BEGIN X509 CRL-----` | A CRL → [CRL](crl.mdx) |
| `.p12` or `.pfx` extension | A PFX bundle → [PFX](pfx.mdx) |
| `.p7m`, `.p7s`, or `-----BEGIN CMS-----` | A CMS container - use [`CMS::load()`](cms/overview.md#reading-a-cms) and let it dispatch |
| Starts with `MII…` (no PEM header) | Base64-encoded DER - try [X.509](x509.mdx) or [CSR](csr.mdx) first; the load methods will tell you if you've guessed wrong |

For CMS containers specifically, you don't need to know the variant in advance - `CMS::load()` reads the `contentType` field and returns the appropriate subclass. See [CMS Overview](cms/overview.md) for details.

## Deep dives

Two pages cover the machinery underneath every class on this list:

- [Constructed Objects](detail-constructed.mdx) - the generic ASN.1 container class that everything else is built on. Worth reading if you need to manipulate fields the higher-level classes don't expose, or if you're building your own wrapper.
- [Distinguished Names](detail-dns.mdx) - the structure used for issuer and subject fields throughout X.509, CSR, and CRL.

Both are linked from the sidebar under "Deep Dives."