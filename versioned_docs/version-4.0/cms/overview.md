---
title: Overview
---

Every [Cryptographic Message Syntax (CMS)](https://en.wikipedia.org/wiki/Cryptographic_Message_Syntax) file has two main attributes from the get go: `contentType` and `content`.

`contentType` can be stuff like `id-signedData`, `id-envelopedData`, `id-encryptedData`, etc.

The structure of `content` depends on the value of `contentType`.

Within `content` you'll have a bunch of fields specific to the `contentType` and either `encapContentInfo` or `encryptedContentInfo`. Both of these "content info" fields, in turn, have their own `contentType` and `content` fields and within _those_ fields, `content` is basically akin to a single file.

So like if you wanted to sign multiple files you'd need multiple CMS's, one for each file. Likewise, if you wanted to sign and then encrypt you'd need to manually nest one CMS inside the other.

## Reading a CMS
All CMS's are read basically the same way:

```php
use phpseclib4\File\CMS;

$cms = CMS::load(file_get_contents('sample.p7m'));

print_r($cms);
```
At this point `$cms` can be an instance of any of the following classes:

- [CMS\SignedData](signed.mdx)
- [CMS\EncryptedData](encrypted.mdx)
- [CMS\DigestedData](digested.mdx)
- [CMS\CompressedData](compressed.mdx)

Each of those classes have their own unique methods (and some common ones, as well).

If you're only dealing with CMS\SignedData then you'll probably want to add an if statement into the code. eg.

```php
if (!$cms instanceof CMS\SignedData) {
    throw new UnexpectedValueException('Expected CMS\\SignedData');
}
```