---
id: install
title: Installation
---

## With Composer

After [installing Composer](https://getcomposer.org/doc/00-intro.md) type the following into your shell:

```
composer require phpseclib/phpseclib:~3.0
```

## Without Composer

phpseclib 3.0 uses Composer for dependency management and autoloading. But let's say you're writing an application for end users that may not have access to the CLI. In that scenario, _you_ will still need Composer but the end users won't.

The first step will be to create a new directory. In this new directory create a new file - composer.json - and prepopulate it with the following:

```
{
    "require": {
        "phpseclib/phpseclib": "~3.0"
    }
}
```
Then, in your shell, type the following in:

```
composer install
```
Once you do that the new directory will then have the following structure:

```
composer.json
composer.lock
vendor/
```
Include these files in your application and do this at the top of your file and you'll be golden:

```
require __DIR__ . '/vendor/autoload.php';
```
One limitation of this is that phpseclib's dependencies may require higher versions of PHP then your application is targeting. Like phpseclib 3.0 works on PHP 5.6+ but if you do `composer install` with PHP 8.0 then paragonie/constant_time_encoding v2.4.0 will be installed, which requires php "^7|^8", as opposed to v1.0.4, which requires php "~^5.3|~^7". So if you want your application to work with PHP 5.6 then do `composer install` with PHP 5.6.


