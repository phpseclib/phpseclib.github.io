---
id: auth
title: Authenticating
---

## Password

```php
use phpseclib3\Net\SSH2;

$ssh = new SSH2('localhost');
if (!$ssh->login('username', 'password')) {
    throw new \Exception('Login failed');
}
```

If you're absolutely certain that the password / username you've entered are correct it's possible the server isn't using SSH authentication and that what's prompting you for your credentials is the terminal itself. In this scenario you would want to authenticate in the manner demonstrated in the [No Authentication](#no-authentication) example.

## Public Key

```php
use phpseclib3\Net\SSH2;
use phpseclib3\Crypt\PublicKeyLoader;

$key = PublicKeyLoader::load(file_get_contents('privatekey'));

$ssh = new SSH2('localhost');
if (!$ssh->login('username', $key)) {
    throw new \Exception('Login failed');
}
```

Public Key Authentication is one of the most secure ways to connect to a server. Even if the server is being "spoofed" or otherwise compromised the worst thing that'll happen is that the public key will be exposed to the attacker. The private key remains private and the hostile actor will be unable to login as you. This is in contrast to password authentication wherein supplying your password to a "spoofed" server means that the attacker could use that same password to login as you to the legit server.

[RSA](rsa.md), [DSA](dsa.md), [ECDSA and EdDSA (Ed25519)](ec.md) keys are supported, in a myriad of different formats. Click the links for a more detailed breakdown.

## Password Protected Public Key

```php
use phpseclib3\Net\SSH2;
use phpseclib3\Crypt\PublicKeyLoader;

$key = PublicKeyLoader::load(file_get_contents('privatekey'), 'password');

$ssh = new SSH2('localhost');
if (!$ssh->login('username', $key)) {
    throw new \Exception('Login failed');
}
```

## Keyboard-Interactive

```php
use phpseclib3\Net\SSH2;

$ssh = new SSH2('localhost', 22);
$result = $ssh->login('username', [
    ['Password' => 'pass1'],
    ['Verification code' => 'code1']
]);

if (!$result) {
    throw new \Exception('Login failed');
}
```

When doing password authentication phpseclib tries keyboard-interactive if password auth fails. Only after both fail does `$ssh->login()` return false. The reason for this is that a lot of systems just prompt for the password via keyboard-interactive. So if your server only has one keyboard-interactive prompt using the password authentication method would be sufficient.

The method utilized in this example is mainly useful when you have multiple keyboard-interactive prompts and need to disambiguate between them. This example utilizes prompt-based disambiguation. One can also distinguish between the various keyboard-interactive prompts via order-based disambiguation. This method is demonstrated in the [Multi-Factor](#multi-factor) example. What'll happen in that example is that password auth will be tried, will presumably fail and then when keyboard-interactive succeeds all subsequent authentications will utilize keyboard-interactive (unless you're trying to auth with a public key).

## Multi Factor

```php
use phpseclib3\Net\SSH2;

$ssh = new SSH2('localhost');
if (!$ssh->login('username', 'pass1', 'code1')) {
    throw new \Exception('Login failed');
}
// this does the same thing as the above
//if (!$ssh->login($username, 'pass1') && !$ssh->login('username', 'code1')) {
//    throw new \Exception('Login failed');
//}
```

## SSH Agent

```php
use phpseclib3\Net\SSH2;
use phpseclib3\System\SSH\Agent;

$agent = new Agent;

$ssh = new SSH2('localhost');
if (!$ssh->login('username', $agent)) {
    throw new \Exception('Login failed');
}
```

See [ssh-agent](https://en.wikipedia.org/wiki/Ssh-agent) for more information.

By default, the socket path is determined by looking at `$_SERVER['SSH_AUTH_SOCK']` and (failing the former) `$_ENV['SSH_AUTH_SOCK']`.

If necessary, the socket path can be passed to the `Agent` constructor. eg. if, on the CLI, `echo $SSH_AUTH_SOCK` returns `/run/user/1000/keyring/ssh` you can do `$agent = new Agent('/run/user/1000/keyring/ssh')`.

### Agent Forwarding

Let's say you wanted to connect to another SSH server (hereinafter referred to as server B) from the server that you're already SSH'd into (hereinafter referred to as server A). Let's also say that you use the same private key to access both servers. Normally this would mean that you'd need to have your private key on server A to connect to server B from server A _but_ with Agent Forwarding that ceases to be the case. Instead you can do something like this:

```php
$agent->startSSHForwarding($ssh);
echo $ssh->exec('ssh user@domain.tld "ls -latr"');
```

## No Authentication

```php
use phpseclib3\Net\SSH2;

$ssh = new SSH2('localhost');
$ssh->login('username');
$ssh->read('User Name:');
$ssh->write("username\n");
$ssh->read('Password:');
$ssh->write("password\n");

$ssh->setTimeout(1);
$ssh->read();
$ssh->write("ls -la\n");
echo $ssh->read();
```

I would provide a better example but have never had direct access to an SSH server that did authentication in this manner nor do I know how to set one up.