---
id: versioning
title: Versioning
---

phpseclib uses [Romantic Versioning](https://github.com/romversioning/romver) (HUMAN.MAJOR.MINOR) with the following definitions:

- HUMAN version when you make any conceptual change, major rewrite, major documentation change, or any other change which requires additional HUMAN involvement.
- MAJOR version when you make incompatible API changes,
- MINOR version when you add functionality in a backward-compatible manner or fix with backward-compatible bug fixes.

As with the more popular [Semantic Versioning](https://semver.org/), a [best effort](https://xkcd.com/1172/) is made to maintain backwards compatibility when the least significant number (MINOR) is changed, however, unlike semantic versioning, one should not assume that a change to the middle number (MAJOR) will be backwards compatible with previous MAJOR releases.

An example of the differences between Semantic Versioning and Romantic Versioning as it applies to phpseclib is the introduction of support for encrypted OpenSSH private keys, which was introduced in [3.0.15](https://github.com/phpseclib/phpseclib/releases/tag/3.0.15). That's a new feature but doesn't break any existent feature (unless you specifically did not want to support encrypted OpenSSH private keys, which is a hard to fathom use case). In Semantic Versioning that would have required the middle number to be changed (eg. 3.1.0) whereas in Romantic Versioning only the least significant number needed to be changed (eg. 3.0.15).

As for the most significant number...  back in the early days of [Netscape](https://en.wikipedia.org/wiki/Netscape_(web_browser)) changes to the most significant version number were releases to really look forward to and the changes between those versions were ones you'd talk about. That's not really the case with Semantic Versioning. In 2023 [Google Chrome](https://en.wikipedia.org/wiki/Google_Chrome) released [Chrome 109](https://developer.chrome.com/blog/new-in-chrome-109) through [Chrome 119](https://developer.chrome.com/blog/new-in-chrome-119) and I couldn't tell you at all what changed from one version to the next. For the most part I don't look forward to new releases of Google Chrome (although neither do I dread them) and if there was a version of Google Chrome that really merited excitement you certainly couldn't tell from the version number.

As for the middle number...  the last time a release was made wherein that number was non-zero was [February 4, 2015](https://github.com/phpseclib/phpseclib/blob/master/CHANGELOG.md#0310---2015-02-04). The possibility of a phpseclib release updating the middle number shouldn't be ruled out but, sufficient to say, there hasn't been sufficient reason to do so in nearly a decade.

## Long Term Support

Versions of PHP wherein the middle number is changed receive '(security) support for [three years after their initial release](https://www.php.net/supported-versions.php). eg. 8.3.x was first released on Nov 23, 2023 and will receive security support until Nov 23, 2026.

Versions of phpseclib wherein the middle number is changed are intended to be supported into perpetuity, contingent upon my ability to provide said support. At this time this is not overwhelmingly burdensome as there are relatively few MAJOR versions.