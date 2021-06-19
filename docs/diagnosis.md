---
id: diagnosis
title: Diagnosing Issues
---

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="/js/jquery.treeview.js"></script>
<link rel="stylesheet" href="/css/jquery.treeview.css">
<script>
$(document).ready(function() {
  $('.printr').treeview({
     persist: "location",
     collapsed: true,
     unique: true
   });
})
</script>

## Exceptions

Exceptions are thrown whenever a `bool(true)` or a `bool(false)` is insufficient to capture the error.

Consider `login()` for example. If `bool(true)` means that the login was successful then it stands to reason that `bool(false)` would mean that the login was _not_ successful. But what if there was a connection error in the login process? `bool(false)` _could_ be returned but then you couldn't distinguish between bad passwords (which is a bit of an oversimplification) or connection errors.

phpseclib throws exceptions for various errors:

- Connection Errors:
  - `\phpseclib3\Exception\UnableToConnectException`
  - `\phpseclib3\Exception\ConnectionClosedException`
  - `\UnexpectedValueException`

- Key Exchange Errors:
  - `\phpseclib3\Exception\NoSupportedAlgorithmsException`

- Authentication Errors:
  - `\phpseclib3\Exception\UnsupportedCurveException`
  - `\phpseclib3\Exception\UnsupportedAlgorithmException`

- Misc Errors:
  - `\RuntimeException`
  - `\phpseclib3\Exception\InsufficientSetupException`: thrown when you try to perform certain operations prior to being logged in

Depending on the situation an exception may or may not result in the SSH2 session being closed.

## isConnected(), isAuthenticated()

SSH2.php doesn't connect to a server after the constructor has been called - it makes the connection after one of the following methods is called:

- `login()`
- `getServerIdentification()`
- `getServerAlgorithms()`
- `getAlgorithmsNegotiated()`
- `getServerPublicHostKey()`

Calling `isConnected()` prior to any of these methods will return `bool(false)`. Premature closure of the session will also result in `isConnected()` returning `bool(false)`.

`isAuthenticated()` returns `bool(true)` only after you've been successfully logged in.

## getErrors(), getLastError()

`getErrors()` returns an array of all errors or messages that have been reported by the server. `getLastError()` returns the most recent of these errors / messages.

`getSFTPErrors()` and `getSFTPLastError()` work similarily for the SFTP layer.

## getServerIdentification()

`getServerIdentification()` returns the server identification string. eg. `SSH-2.0-OpenSSH_8.0p1 Ubuntu-6build1` or whatever.

## getBannerMessage()

Quoting [RFC4252 § 5.4. Banner Message](https://tools.ietf.org/html/rfc4252#section-5.4), "_In some jurisdictions, sending a warning message before authentication may be relevant for getting legal protection.  Many UNIX machines, for example, normally display text from /etc/issue, use TCP wrappers, or similar software to display a banner before issuing a login prompt._"

## getLog()

Logging can be enabled by doing the following:

```php
define('NET_SSH2_LOGGING', SSH2::LOG_COMPLEX);
```

Several different logging options exist:

* `SSH2::LOG_SIMPLE`

   Can be obtained with `$ssh->getLog()`, which returns an array that, when passed through `print_r`, looks like [simple.txt](/logs/simple.txt).
* `SSH2::LOG_COMPLEX`.

   Can be obtained with `$ssh->getLog()`, which return a string that looks like [complex.txt](/logs/complex.txt). These logs are capped at 1 MiB.
* `SSH2::LOG_REALTIME`.

   Outputs, in realtime, logs that look like [complex.txt](/logs/complex.txt). `$ssh->getLog()` does nothing with this method.
* `SSH2::LOG_REALTIME_FILE`

   Logs data to a file realtime. Useful if your script is stalling or dying before you have a chance to call `$ssh->getLog()`.

   Used in conjunction with `define('NET_SSH2_LOG_REALTIME_FILENAME', 'log.txt');`.

   Log sizes are capped at 1 MiB. If they go over the log file will wrap around. Outside of the wrap around boundry the log files otherwise look like [complex.txt](/logs/complex.txt).

For all log types, if you're logging in with password authentication, whatever password you were using is replaced with 'password'. So if your password was actually '123456' (the [most common password in 2019](https://en.wikipedia.org/wiki/List_of_the_most_common_passwords)) it'll be replaced with 'password' in the logs.

## getSFTPLog()

SFTP logs can be enabled thusly:

```php
define('NET_SFTP_LOGGING', SFTP::LOG_COMPLEX);
```

The logging options are largely the same as they are for SSH2, with the caveat that there is no analog to `SSH2::LOG_REALTIME_FILE`.

## getSupportedVersions()

There are seven different versions of SFTP that are defined (v0 through v6). OpenSSH only supports one version (v3) but some SFTP servers (eg. Syncplify.me Server!<sup style="color: red"><strong>[1]</strong></sup>) can be configured to support all versions.

SFTP servers that support multiple versions will have a default version (usually v3) and will specifiy what other SFTP versions they support through the use of an extension.

When muliple verisons of SFTP are supported here's what the output of this method will look like:

<ul class="printr" style="margin-bottom: 15px"><li><span class="name">version</span><ul><li>3</li></ul></li><li><span class="name">extensions</span><ul><li>3,4,5,6</li></ul></li></ul>

If only one version of SFTP is supported then the extensions key will most likely not be present.

<div style="font-size: 11px">

<sup style="color: red"><strong>[1]</strong></sup> If Syncplify, Inc. or any other organization that makes an SFTP server that supports multiple versions of SFTP wants me to actually include a hyperlink to them I'd be willing to do so for $5.00 / month [via Patreon](https://www.patreon.com/phpseclib).
</div>