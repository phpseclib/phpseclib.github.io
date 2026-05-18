---
title: Connecting
sidebar_position: 1
---

## Basic Example with Signature Verification

As the "secure" part of Secure Shell (SSH) implies, SSH is designed to work over hostile networks. SSH encrypts your data so that eavesdroppers cannot read the data being sent back and forth and it provides a method that can be used to verify that the server you're connecting to hasn't been replaced with a hostile server. To facilitate the latter SSH servers have a host public key. Data that's unique to the SSH session is signed by the server and should be verified by the client with the host public key. Of course, simply verifying the signature is insufficient - you need to verify that the host public key is correct. X.509 / SSL / TLS does this with [certificate authorities](https://en.wikipedia.org/wiki/Certificate_authority) but in SSH, in theory, you'd get the host public key through some [out-of-band method](https://en.wikipedia.org/wiki/Out-of-band_agreement). In practice, however, people usually just cache the key the first time they connect to a server and assume all subsequent connections should be using that same key. How the expected host key is saved is up to the application designer (OpenSSH saves them in `~/.ssh/known_hosts`) but here is an example of how the host key would be retrieved from the SSH server (prior to authentication) and checked against the expected value (`$expected`):

```php
use phpseclib4\Net\SSH2;

$ssh = new SSH2('localhost', 22);
if ($expected != $ssh->getServerPublicHostKey()) {
    throw new \Exception('Host key verification failed');
}
```

All subsequent code samples omit this part for brevity but if you're concerned about eavesdroppers (which isn't always a legit concern; eg. if you're connecting to localhost) it should not be skipped.

The constructor signature is:

```php
public function __construct(
    mixed $host,
    int $port = 22,
    int $timeout = 10
)
```

The port number is optional and defaults to 22. The third argument is the TCP connect timeout in seconds.

## Connection is Lazy

The constructor doesn't actually connect to anything. The TCP connection and SSH handshake only happen on the first call to one of:

- `login()`
- `getServerIdentification()`
- `getServerAlgorithms()`
- `getAlgorithmsNegotiated()`
- `getServerPublicHostKey()`

This is intentional. It lets you configure the instance (algorithm preferences, terminal type, quirks toggles) before any wire activity starts. Calling `isConnected()` before any of the above will return `bool(false)`.

## Failure Modes

When the connection itself fails, phpseclib throws one of the following exceptions. All extend `\RuntimeException` and implement `phpseclib4\Exception\BaseException`, so a single `catch (\RuntimeException $e)` covers all of them.

|Failure|Exception|
|---|---|
|TCP connect failed|`phpseclib4\Exception\UnableToConnectException`|
|Connection dropped mid-handshake|`phpseclib4\Exception\ConnectionClosedException`|
|No mutually supported KEX / host-key / cipher / MAC / compression|`phpseclib4\Exception\NoSupportedAlgorithmsException`|
|Server identification string malformed|`phpseclib4\Exception\UnexpectedValueException`|

Note that authentication failure does _not_ throw. `$ssh->login()` returns `bool(false)` instead. See [Authenticating](auth.md) for more on that.

## Using an HTTP Proxy

```php
use phpseclib4\Net\SSH2;

$fsock = fsockopen('127.0.0.1', 80, $errno, $errstr, 1);
if (!$fsock) {
    throw new \Exception($errstr);
}
fputs($fsock, "CONNECT localhost:22 HTTP/1.0\r\n");
//fputs($fsock, "Proxy-Authorization: Basic " . base64_encode('user:pass') . "\r\n");
fputs($fsock, "\r\n");
while ($line = fgets($fsock, 1024)) {
    if ($line == "\r\n") {
        break;
    }
    //echo $line;
}

$ssh = new SSH2($fsock);
$ssh->login('username', 'password');
echo $ssh->exec('ls -latr');
```

When you pass a stream resource as the first argument, the `$port` argument is ignored but the `$timeout` argument is still honored.

## Using a SOCKS5 Proxy

```php
use phpseclib4\Net\SSH2;

// SSH connection info
$port = 22;
$address = 'localhost';

// SOCKS5 connection info
$fsock = fsockopen('127.0.0.1', 1080, $errno, $errstr, 1);
if (!$fsock) {
    throw new \Exception($errstr);
}

$port = pack('n', $port);
$address = chr(strlen($address)) . $address;

$request = "\5\1\0";
if (fwrite($fsock, $request) != strlen($request)) {
    throw new \Exception('Premature termination');
}

$response = fread($fsock, 2);
if ($response != "\5\0") {
    throw new \Exception('Unsupported protocol or unsupported method');
}

$request = "\5\1\0\3$address$port";
if (fwrite($fsock, $request) != strlen($request)) {
    throw new \Exception('Premature termination');
}

$response = fread($fsock, strlen($address) + 6);
if (substr($response, 0, 2) != "\5\0") {
echo bin2hex($response) . "\n";
    throw new \Exception("Unsupported protocol or connection refused");
}

$ssh = new SSH2($fsock);
$ssh->login('username', 'password');
echo $ssh->exec('ls -latr');
```

## Connecting to an IPv6 address

When specifying a numerical IPv6 address (e.g. `fe80::1`), you must enclose the IP in square brackets, for example `tcp://[fe80::1]:22`.

## Binding to a Specific IP Address

```php
use phpseclib4\Net\SSH2;

// http://php.net/manual/en/context.socket.php
$opts = [
    'socket' => [
        'bindto' => '127.255.255.255:0',
    ],
];
$context = stream_context_create($opts);
$socket = stream_socket_client('tcp://localhost:22', $errno, $errstr, ini_get('default_socket_timeout'), STREAM_CLIENT_CONNECT, $context);

$ssh = new SSH2($socket);
$ssh->login('username', 'password');
echo $ssh->exec('ls -latr');
```

## Using a Custom Cipher Suite

You can tell phpseclib which algorithms you'd like to use by doing `$ssh->setPreferredAlgorithms($methods)`. `$methods` should be an associative array with any or all of the following parameters (inspired by [ssh2_connect](https://www.php.net/ssh2-connect)):

| Index | Meaning | Supported Values |
|---|---|---|
| kex | List of key exchange methods to advertise, comma separated in order of preference. | _curve25519-sha256_, _curve25519-sha256@libssh.org_, _ecdh-sha2-nistp256_, _ecdh-sha2-nistp384_, _ecdh-sha2-nistp521_, _diffie-hellman-group-exchange-sha256_, _diffie-hellman-group-exchange-sha1_, _diffie-hellman-group14-sha256_, _diffie-hellman-group14-sha1_, _diffie-hellman-group15-sha512_, _diffie-hellman-group16-sha512_, _diffie-hellman_group17-sha512_, _diffie-hellman-group18-sha512_, _diffie-hellman-group1-sha1_. Pretty much anything returned by `$ssh->getSupportedKEXAlgorithms()` |
| hostkey | List of hostkey methods to advertise, comma separated in order of preference. | _ssh-ed25519_, _ecdsa-sha2-nistp256_, _ecdsa-sha2-nistp384_, _ecdsa-sha2-nistp521_, _rsa-sha2-256_, _rsa-sha2-512_, _ssh-rsa_, _ssh-dss_. Pretty much anything returned by `$ssh->getSupportedHostKeyAlgorithms()` |
| client_to_server | Associative array containing crypt, compression, and message authentication code (MAC) method preferences for messages sent from client to server. ||
| server_to_client | Associative array containing crypt, compression, and message authentication code (MAC) method preferences for messages sent from server to client. ||

`client_to_server` and `server_to_client` should be an associative array with any or all of the following parameters.

| Index | Meaning | Supported Values |
|---|---|---|
| crypt | List of crypto methods to advertise, comma separated in order of preference. | _aes128-gcm@openssh.com_, _aes256-gcm@openssh.com_, _arcfour256_, _arcfour128_, _aes128-ctr_, _aes192-ctr_, _aes256-ctr_, _chacha20-poly1305@openssh.com_, _twofish128-ctr_, _twofish192-ctr_, _twofish256-ctr_, _aes128-cbc_, _aes192-cbc_, _aes256-cbc_, _twofish128-cbc_, _twofish192-cbc_, _twofish256-cbc_, _twofish-cbc_, _blowfish-ctr_, _blowfish-cbc_, _3des-ctr_, _3des-cbc_. Pretty much anything returned by `$ssh->getSupportedEncryptionAlgorithms()` |
| comp | List of compression methods to advertise, comma separated in order of preference. | _none_, _zlib@openssh.com_, _zlib_. Pretty much anything returned by `$ssh->getSupportedCompressionAlgorithms()`. The latter two require that the [zlib extension be installed](https://www.php.net/manual/en/zlib.installation.php) (until such time that a shim can be written). |
| mac | List of MAC methods to advertise, comma separated in order of preference. | _hmac-sha2-256-etm@openssh.com_, _hmac-sha2-512-etm@openssh.com_, _umac-64-etm@openssh.com_, _umac-128-etm@openssh.com_, _hmac-sha1-etm@openssh.com_, _hmac-sha2-256_, _hmac-sha2-512_, _umac-64@openssh.com_, _umac-128@openssh.com_, _hmac-sha1-96_, _hmac-sha1_, _hmac-md5-96_, _hmac-md5_. Pretty much anything returned by `$ssh->getSupportedMACAlgorithms()` |

Note that a given algorithm will only be used if it's supported by both phpseclib and the server. The algorithms that the server supports can be determined by doing `$ssh->getServerAlgorithms()`. The algorithms that ultimately wind up being used can be determined by doing `$ssh->getAlgorithmsNegotiated()`.

Using a custom cipher suite is not recommended. phpseclib's prioritization of algorithms is intended to maximize speed and security. For example, if OpenSSL is installed _aes128-gcm@openssh.com_ will be the preferred encryption algorithm. If OpenSSL is not installed but libsodium is, then _aes256-gcm@openssh.com_ will be preferred. If neither OpenSSL nor libsodium is installed the preferred encryption algorithm will be _aes128-ctr_. You can override this priority and force a slower algorithm to be used, but your connection will be slowed down because the pure-PHP implementations of those algorithms are not nearly as fast as OpenSSL / libsodium.

_chacha20-poly1305@openssh.com_ is the latest hotness in the cryptographic community but it is not prioritized higher because (1) while OpenSSL supports ChaCha20, it doens't support Poly1305 and (2) libsodium doesn't use Poly1305 in the same way that SSH uses it. Despite that, _chacha20-poly1305@openssh.com_ is still pretty fast but not as fast as some of the other available algorithms.

## Additional Tweaks

A handful of servers misbehave in protocol corners. phpseclib provides toggles for working around them. Reach for these only when a connection fails against a specific buggy server. Don't apply them prophylactically.

```php
$ssh->sendIdentificationStringFirst();   // send our SSH-2.0-... before reading the server's
$ssh->sendIdentificationStringLast();    // wait for the server's identification string first

$ssh->sendKEXINITFirst();                // send SSH_MSG_KEXINIT before the server does
$ssh->sendKEXINITLast();                 // wait for the server to send it first
```

The SSH protocol allows either side to send their identification string and `KEXINIT` packet first, so neither order is wrong, but a buggy server may only accept one of the two. If you're seeing handshake failures and the protocol logs (see [getLog()](diagnosis.md#getlog)) show the connection dying before authentication, one of these toggles may help.
