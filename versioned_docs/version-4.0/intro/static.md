---
title: Static Analysis
---

[`PublicKeyLoader::load()`](../publickeys/overview.mdx#loading-keys) can return a PublicKey or PrivateKey instance of EC, RSA or DSA  and the methods that each of those possible objects have differ. Like a PublicKey object isn't going to have a `sign()` method and an RSA object isn't going to have a `getCurve()` method either.

This polymorphism makes static analysis tricky. For example, if you're loading a fixed key then checking to see if that fixed key object is an RSA\PrivateKey object is as unnecessary as this:

```php
$found = false;
assert(is_bool($found));
```
Like of course `$found` is bool - you just defined it as a bool.

On the other hand, if you're loading a key that someone uploaded then, at that point, checking the type makes much more sense. Maybe you could check it as part of a switch statement or with an if statement or whatever. But the point is that it's not always needed and although phpseclib can identify the appropriate object from the string that's passed to `PublicKeyLoader::load()` psalm can't.

The same holds true for `CMS::load()`. Like maybe it'll return a [CMS\SignedData](../cms/signed.mdx) instance or maybe it'll return a [CMS\EncryptedData](../cms/encrypted.mdx) instance. Outside of unit tests it's hard to imagine fixed strings being passed into this anywhere near as frequently as fixed strings are liable to be passed into `PublicKeyLoader::load()`.

Another example: `ASN1::map()`. It *can* return an instance of Constructed but it could also return an instance of UTF8String. And although Constructed has a `toArray()` method UTF8String doesn't.

So does that mean that one should do `assert($var instanceof Constructed)` after every `ASN1::map()` call where an instance of Constructed is expected? I would argue not. `ASN1::map()` takes two parameters and the second is a link to the actual map, which is almost always going to be hard-coded and whether or not Constructed would be returned ultimately depends on the map. A fixed map will result in a fixed `ASN1::map()` return value. I suppose one could do `/** @var Constructed */` before every `ASN1::map()` (where appropriate) as well, however, that's a fair amount of work for relatively little gain. Maybe at a future date but not right now.

Since phpseclib makes extensive use of `ASN1::map()` phpseclib's own psalm.xml suppresses UndefinedMethod errors rather than adding a bunch of `assert()` calls that ultimately serve no point other than to appease static analysis. A robust unit test suite should catch any *truly* undefined methods, anyway.