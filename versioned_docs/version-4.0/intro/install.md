---
title: Installation
---

## With Composer

After [installing Composer](https://getcomposer.org/doc/00-intro.md) type the following into your shell:

```
composer require phpseclib/phpseclib:~4.0
```

## Without Composer

phpseclib 4.0 uses Composer for dependency management and autoloading. But let's say you're writing an application for end users that may not have access to the CLI. In that scenario, _you_ will still need Composer but the end users won't.

The first step will be to create a new directory. In this new directory create a new file - composer.json - and prepopulate it with the following:

```json
{
    "require": {
        "phpseclib/phpseclib": "~4.0"
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

```php
require __DIR__ . '/vendor/autoload.php';
```

