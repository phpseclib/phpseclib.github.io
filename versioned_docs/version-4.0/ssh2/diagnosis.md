---
title: Diagnosing Issues
sidebar_position: 4
---

## isConnected(), isAuthenticated()

SSH2.php doesn't connect to a server after the constructor has been called - it makes the connection after one of the following methods is called:

- `login()`
- `getServerIdentification()`
- `getServerAlgorithms()`
- `getAlgorithmsNegotiated()`
- `getServerPublicHostKey()`

Calling `isConnected()` prior to any of these methods will return `bool(false)`. Premature closure of the session will also result in `isConnected()` returning `bool(false)`.

The function definition for `isConnected()` is as follows:

```php
public function isConnected(int $level = 0): bool
```

The `$level` parameter selects the method used to test if the connection is still open:

- `isConnected(0)`. The default method.  Calls `feof()` on the socket object, which often means that the [server has closed the connection](https://stackoverflow.com/a/1321716/569976)
- `isConnected(1)`. Sends a SSH_MSG_IGNORE packet to the server.
- `isConnected(2)`. Sends a SSH_MSG_CHANNEL_OPEN packet to the server and then immediately closes the channel. Unlike `isConnected(1)` this method actually results in the server sending a response, however, some servers may limit the number of open channels that you can have, most notably, Cisco IOS Routers, which limit you to just one channel per session.

`isAuthenticated()` returns `bool(true)` only after you've been successfully logged in.

## SFTP::getErrors()

Whenever an error is encountered an exception is thrown. The only exception to this is the SFTP class, which logs errors on (most) functions operating in recursive mode.

So let's say you had a directory (directory A) with one file (file B) and one directory (directory C) that you did not have permission to access. If you try to delete file B or directory C (or to do `nlist()`, `rawlist()`, etc) and _weren't_ in recursive mode, you'd get an Exception. If, however, you _were_ in recursive mode then it'll silently fail. Silent failures aren't so useful if trying to delete file B or directory C, however, if trying to delete directory A then what'll happen is that it'll try to delete every _other_ directory and file contained therein.

`getErrors()` let's you see which files failed and how. Here's the output of `print_r($sftp->getErrors())` after trying to do `$sftp->delete('A')` on a directory with the previously mentioned layout:

```php
Array
(
    [0] => REMOVE /home/test/A (FAILURE): Failure
    [1] => REMOVE /home/test/A/B (PERMISSION_DENIED): Permission denied
    [2] => OPENDIR /home/test/A/C (PERMISSION_DENIED): Permission denied
    [3] => RMDIR /home/test/A/C (FAILURE): Failure
    [4] => RMDIR /home/test/A (FAILURE): Failure
)
```
Here's a more in-depth explanation of what's going on:

1. Not knowing that A is a directory, phpseclib first tries to delete it as a file (REMOVE) and it fails. phpseclib then assumes that A is a directory and directory A's contents (OPENDIR) without issue.
2. phpseclib tries to delete file B (REMOVE) and fails. It doesn't try to do OPENDIR on B as a directory because it learned via OPENDIR that it _wasn't_ a directory
3. phpseclib tries to open directory C (OPENDIR) and fails.
4. phpseclib tries to delete directory C and fails (RMDIR).
5. phpseclib tries to delete directory A and fails (RMDIR).

The lone function that continues to throw exceptions on errors, even in recursive mode, is `mkdir()`. To understand the reason for that one, say you're trying to create `/home/test/new`. It first tries to create `/home` and fails, either because the directory already exists or because you don't have the appropriate permission to create a directory in root. Then it tries to create `/home/test` and that fails because that directory already exists. Once it gets around to creating the final directory - `/home/test/new` - there's zero possibility of it creating any additional directories, hence phpseclib throwing an Exception, despite being in recursive mode.

Note that `getErrors()` will continue to build up its list of errors until you call it. So like if you delete two directories recursively and then do `getErrors()` then you'll see errors from _both_ directory deletions.

Also note that if you call `getErrors()` twice, in succession, that the second `getErrors()` call will return an empty array because the error "buffer" has been cleared.

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

   Can be obtained with `$ssh->getLog()`, which returns an array that, when passed through `print_r`, looks like [simple.txt](pathname:///logs/simple4.0.txt).
* `SSH2::LOG_COMPLEX`.

   Can be obtained with `$ssh->getLog()`, which return a string that looks like [complex.txt](pathname:///logs/complex4.0.txt). These logs are capped at 1 MiB.
* `SSH2::LOG_REALTIME`.

   Outputs, in realtime, logs that look like [complex.txt](pathname:///logs/complex4.0.txt). `$ssh->getLog()` does nothing with this method.
* `SSH2::LOG_REALTIME_FILE`

   Logs data to a file realtime. Useful if your script is stalling or dying before you have a chance to call `$ssh->getLog()`.

   Used in conjunction with `define('NET_SSH2_LOG_REALTIME_FILENAME', 'log.txt');`.

   Log sizes are capped at 1 MiB. If they go over the log file will wrap around. Outside of the wrap around boundry the log files otherwise look like [complex.txt](pathname:///logs/complex4.0.txt).

For all log types, if you're logging in with password authentication, whatever password you were using is replaced with 'password'. So if your password was actually '123456' (the [most common password in 2019](https://en.wikipedia.org/wiki/List_of_the_most_common_passwords)) it'll be replaced with 'password' in the logs.

## getSFTPLog()

SFTP logs can be enabled thusly:

```php
define('NET_SFTP_LOGGING', SFTP::LOG_COMPLEX);
```

The logging options are largely the same as they are for SSH2, with the caveat that there is no analog to `SSH2::LOG_REALTIME_FILE`.

## getServerAlgorithms()

If you get a "No compatible ... algorithms found" error it may be beneficial to do `$ssh->getServerAlgorithms()`. The corresponding exception type is `phpseclib4\Exception\NoSupportedAlgorithmsException`. See [Failure Modes](connect.md#failure-modes) for the full list.

You can additionally see the algorithms that were negotiated by doing `$ssh->getAlgorithmsNegotiated()`. See [Using a Custom Cipher Suite](connect.md#using-a-custom-cipher-suite) for more info.
