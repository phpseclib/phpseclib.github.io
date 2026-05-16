---
title: Versioning
---

phpseclib uses [Romantic Versioning](https://github.com/romversioning/romver) (**PROJECT.MAJOR.MINOR**) with the following definitions:

- **PROJECT** is incremented when the library is considered a new, separate project or undergoes a total paradigm shift (e.g., the transition from v3.0 to v4.0). Conceptually significant rewrites, major documentation overhauls, or any other change that requires additional human involvement also bump this number.
- **MAJOR** is incremented when intentional breaking changes are introduced to the existing API.
- **MINOR** is incremented for new features, bug fixes, and security patches that maintain full backward compatibility.

As with the more popular [Semantic Versioning](https://semver.org/), a [best effort](https://xkcd.com/1172/) is made to maintain backwards compatibility when the least significant number (MINOR) is changed. Unlike semantic versioning, however, one should not assume that a change to the middle number (MAJOR) will be backwards compatible with previous MAJOR releases.

An example of the differences between Semantic Versioning and Romantic Versioning as it applies to phpseclib is the introduction of support for encrypted OpenSSH private keys, which was introduced in [3.0.15](https://github.com/phpseclib/phpseclib/releases/tag/3.0.15). That's a new feature but doesn't break any existing feature (unless you specifically did not want to support encrypted OpenSSH private keys, which is a hard to fathom use case). In Semantic Versioning that would have required the middle number to be changed (eg. 3.1.0) whereas in Romantic Versioning only the least significant number needed to be changed (eg. 3.0.15).

As for the most significant number... back in the early days of [Netscape](https://en.wikipedia.org/wiki/Netscape_(web_browser)), changes to the most significant version number were releases to really look forward to and the changes between those versions were ones you'd talk about. That's not really the case with Semantic Versioning. In 2023 [Google Chrome](https://en.wikipedia.org/wiki/Google_Chrome) released [Chrome 109](https://developer.chrome.com/blog/new-in-chrome-109) through [Chrome 119](https://developer.chrome.com/blog/new-in-chrome-119) and I couldn't tell you at all what changed from one version to the next. For the most part I don't look forward to new releases of Google Chrome (although neither do I dread them), and if there was a version of Google Chrome that really merited excitement you certainly couldn't tell from the version number. PROJECT-level bumps in phpseclib are meant to mean something.

As for the middle number... the last time a release was made wherein that number was non-zero was [February 4, 2015](https://github.com/phpseclib/phpseclib/blob/master/CHANGELOG.md#0310---2015-02-04). The possibility of a phpseclib release updating the middle number shouldn't be ruled out but, sufficient to say, there hasn't been sufficient reason to do so in nearly a decade.

## Breaking Change Policy

To ensure stability for enterprise integrations and mission-critical applications:

1. **Stability guarantee.** Breaking changes are strictly prohibited within MINOR version increments. Users may safely automate updates within a MAJOR series (e.g., `^3.0`) without risk of API breakage.
2. **Consolidation.** Intentional breaking changes are consolidated into MAJOR or PROJECT releases.
3. **Bug fixes.** Bug fixes may technically alter behavior that a developer was unintentionally relying on, but these are not considered policy-breaking changes and will be released in MINOR versions.

## Long Term Support

All MAJOR versions of phpseclib (eg. 1.0.x, 2.0.x, 3.0.x) are treated as Long-Term Support branches and are intended to be supported into perpetuity, contingent upon the maintainer's ability to provide said support. At this time this is not overwhelmingly burdensome, as there are relatively few MAJOR versions.

In the event that a MAJOR version is slated for End-of-Life — meaning the cessation of security patches and bug fixes — notice will be posted prominently in the `README.md` and on the official website at least **one year (12 months) in advance**. This gives developers a predictable window to plan and execute migrations before support for a legacy branch is withdrawn.

## Deprecation and Future-Proofing

phpseclib does not use traditional `E_USER_DEPRECATED` notices for most changes, as runtime deprecation warnings have a tendency to disrupt production environments. Instead, a "version-targeted" communication strategy is used in the source code documentation itself.

### Informational tags

Rather than generic deprecation warnings, phpseclib uses specific PHPDoc tags to signal future state:

- **`@removed in phpseclib [version]`** — the method, class, or property is stable in the current version but will be removed entirely in the specified future version.
- **`@changed in phpseclib [version]`** — the API signature (parameter order, type-hinting, return type, etc.) will be altered in the specified version.

### Persistence guarantee

Any feature marked with `@removed` or `@changed` is **guaranteed to remain functional in its current state for the remainder of the current PROJECT/MAJOR version's lifecycle**. These tags serve as a long-term roadmap, giving developers time to plan migrations without immediate pressure.

## Migration Support

For PROJECT-level transitions (e.g., v3.0 to v4.0), phpseclib provides:

1. **Migration guides** — dedicated documentation outlining the differences between the legacy and modern APIs.
2. **Implementation examples** — side-by-side code comparisons to assist developers in adapting to new paradigms.
