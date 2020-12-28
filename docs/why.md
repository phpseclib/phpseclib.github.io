---
id: why
title: Why phpseclib?
---

phpseclib provides pure-PHP implementations of SSH2, SFTP, RSA, DSA, Elliptic Curves, AES, ChaCha20, X.509, CSR, CRL, SPKAC, etc.

## Portability

The only requirement that phpseclib 3.0 has is that you must be using PHP 5.6+.

Extensions like bcmath, gmp, libsodium and openssl, if they're available, for speed, but they're not required.

## phpseclib 3.0 vs phspeclib 1.0 / 2.0

phpseclib 3.0.x offers a completely redesigned public key interface featuring immutability, among other things. And whereas 1.0 / 2.0 only supported RSA keys 3.0 supports DSA, ECDSA and EdDSA keys.

More modern symmetric key algorithms have been added as well, including ChaCha20-Poly1305 and GCM modes.

The default hash algorithm has also been changed from sha1 to sha256 and public keys are now immutable. So let's say you had created an RSA encrypted ciphertext with phpseclib 2.0 using the default encryption mode and default hashes. Here's how you'd decrypt it with phpseclib 2:

```php
use phpseclib\Crypt\RSA;

$rsa = new RSA;
$rsa->loadKey(...);
echo $rsa->decrypt(...);
```

Here's how you'd decrypt it with phpeclib 3:

```php
use phpseclib3\Crypt\PublicKeyLoader;

$key = PublicKeyLoader::load(...)->withHash('sha1')->withMGFHash('sha1');
echo $key->decrypt(...);
```

SSH2, SFTP and X.509 are largely unchanged.

The name space has also been changed from `\phpseclib` to `\phpsecib3`.

phpseclib 1.0 / 2.0 documentation lives at http://phpseclib.sourceforge.net/

## phpseclib2_compat

Due to the namespace change, phpseclib 3.0 can be used to emulate phpseclib 2.0. [phpseclib2_compat](https://github.com/phpseclib/phpseclib2_compat) does just that. So let's say you want to use phpseclib 3 but some of your dependencies are still using phpseclib 2. In this scenario you can require phpseclib/phpseclib:~3.0 and phpseclib/phpseclib2_compat:~1.0 and you're dependencies will then start using phpseclib 3 even if they don't know it.

Using phpseclib2_compat will actually bring a few enhancements to your dependency. For example, while phpseclib 2.0 only supports RSA keys phpseclib2_compat sports support for ECDSA / DSA / Ed25519 / Ed449 keys.

Consider this code sample:

```php
use phpseclib\Crypt\RSA;

$rsa = new RSA;
$rsa->loadKey('ecdsa private key');

$ssh = new SSH2('website.com');
$ssh->login('username', $rsa);
```
That'll work with phpseclib2_compat, even with an ECDSA private key, whereas in phpseclib 2.0 it would not work.

SSH1 and SCP are not supported but those were likely never frequently used anyway.

## phpseclib vs libsodium

libsodium is the latest hotness in PHP cryptography but there's a lot of things phpseclib does that libsodium doesn't even pretend to do. phpseclib provides an SSH2 implementation, an SFTP implementation, an X.509 implementation, CSR, CRL, BigInteger, etc. libsodium doesnt aim to provide any of these things.

In so far as cryptographic applications are concerned...  libsodium trades flexibility for security. If you need to use AES-128-CBC, RSA or ECDSA / ECDH with nistp256 or secp256k1 (aka the bitcoin curve) or any other algorithm that [isn't explicitly supported by libsodium](https://wiki.php.net/rfc/libsodium) you're out of luck.

That said, if you want ease of use and want to rely on the defaults of whatever library you're using, libsodium is definitely recommended. phpseclib 3.0 is much less error tolerant than 1.0 / 2.0 anyway now. Symmetric keys / IVs are no longer padded to the default length, the mode must _explicitly_ be specified now for symmetric key algorithms, etc. The goal is to make it less "friendly" to use cryptographic primitives so that only those who truly know what they're doing will do so henceforth.

## phpseclib vs OpenSSL

As with libsodium, there are a lot of things phpseclib provides that OpenSSL doesn't even aim to provide. SSH, SFTP, BigInteger, etc.

In so far as cryptographic applications are concerned, phpseclib still provides some advantages to OpenSSL. PHP's bindings to OpenSSL don't let you specify the hashes for RSA OAEP, for example. Both the hash and the MGF hash are hard-coded as sha1. You also can't use RSA PSS with PHP's OpenSSL bindings. You can do all this and more with phpseclib.

Further, OpenSSL doesn't have native support for "progressive encryption" / "continuous mode" for symmetric key algorithms whereas phpseclib does. Certainly that mode can be simulated (which is what phpseclib does if OpenSSL is installed) but that adds a whole extra layer of complexity that phpseclib eliminates.

The OpenSSL extension also doesn't provide support for [ECDH](https://stackoverflow.com/q/56222220/569976) or [Ed25519](https://stackoverflow.com/q/56222067/569976).

phpseclib also supports public and private keys in a myriad of more formats than OpenSSL.

## phpseclib vs libssh2

Whether or not the API is better than [libssh2](http://php.net/ssh2) is debatable. Here, we consider more objective criteria.

### Portability

libssh2 exists as a PECL extension that most hosts are not going to have installed.

If you're a library author then any extra dependenicies that you have (that can't be installed through Composer) are going to be additional pain points for your end users.

If you're writing a website then, if you're not using Docker or Ansible or whatever, then you're going to need to somehow document that that extension was installed so that the production (or dev) servers can be updated with it as well and so that the extension can be reinstalled if either of the servers need to be rebuilt.

### Algorithm Support

phpseclib 3.0 supports best practices algorithms that libssh2 [does not support](https://www.php.net/manual/en/function.ssh2-connect.php). Algorithms like curve25519-sha256, ecdh-sha2-nistp256, ssh-ed25519, ecdsa-sha2-nistp256, aes128-gcm, chacha20-poly1305, etc.

### Speed

The following table shows how long, in seconds, it took to transfer a 10mb file via phpseclib and libssh2 to localhost.

<table border="1">
  <tbody>
    <tr>
      <td style="background: tan" rowspan="2">Upload</td>
      <td><strong>libssh2</strong></td>
      <td>0.6125</td>
    </tr>
    <tr>
      <td><strong>phpseclib</strong></td>
      <td style="background: lightgreen">0.1680</td>
    </tr>
    <tr>
      <td style="background: tan" rowspan="2">Download</td>
      <td><strong>libssh2</strong></td>
      <td>1.5422</td>
    </tr>
    <tr>
      <td><strong>phpseclib</strong></td>
      <td style="background: lightgreen">0.2389</td>
    </tr>
  </tbody>
</table>

So phpseclib uploads files <strong>3.5x</strong> faster than libssh2 and downloads files <strong>6.5x</strong> faster than libssh2.

Note that these numbers are _with_ the [openssl](http://php.net/openssl), [sodium](https://www.php.net/sodium) and [gmp](https://www.php.net/gmp) extensions installed. Removal of openssl and sodium, in particular, will _significantly_ slow phpseclib down. Uploads and downloads will still happen, but at significantely reduced speed (unless the network is a more significant bottleneck).

These numbers were obtained [on Travis CI](https://travis-ci.org/github/phpseclib/benchmarks/builds/706532232).

### Public Key Support

Here's how you do it with libssh2:

```php
$ssh = ssh2_connect('domain.tld');
ssh2_auth_pubkey_file($ssh, 'username', '/home/ubuntu/pubkey', '/home/ubuntu/privkey'/*, 'password'*/);

$stream = ssh2_exec($ssh, 'ls -la');
echo stream_get_contents($stream);
```

Here's how you do it with phpseclib:

```php
$ssh = new SSH2('domain.tld');
$ssh->login('username', PublicKeyLoader::load(file_get_contents('/home/ubuntu/privkey')/*, 'password'*/);

echo $ssh->exec('ls -la');
```

Ignoring the API for the time being there are a few clear ways phpseclib comes out on top here:

- phpseclib takes in strings - not file paths. If you want to do a file you can do file_get_contents.
- phpseclib doesn't require a public key. Private keys have the public key embedded within them so phpseclib just extracts it.
- phpseclib can take in pretty much any standardized format, from PKCS#1 formatted keys, to PuTTY keys, to XML Signature keys.

### Diagnosing Problems

Why didn't top or sudo work? With phpseclib you can get logs. They look like this:

[complex.txt](/logs/complex.txt)

You can also do `print_r($ssh->getErrors())` or echo `$ssh->getLastError()`.

See [SSH2: Diagnosing Issues](diagnosis.md) for more information.

### Changing Directories

I don't see any cd or chdir functions at [http://php.net/ssh2](http://php.net/ssh2). phpseclib, however, has it - `SFTP::chdir(...)`.

### Interactive Shell

Let's try to do sudo on the remote system.

With phpseclib: [read() with regular expressions: sudo](/docs/commands#read-with-regular-expressions-sudo)

With libssh2? I have no clue. My best guess (doesn't work):

```php
$ssh = ssh2_connect('domain.tld'); 
ssh2_auth_password($ssh, 'username', 'password');

$shell = ssh2_shell($ssh);
echo fread($shell, 1024*1024);
fwrite($shell, "sudo ls -la\n");
$output = fread($shell, 1024*1024);
echo $output;
if (preg_match('#[pP]assword[^:]*:#', $output)) {
    fwrite($shell, "password\n");
}
echo fread($shell, 1024*1024);
```
It is additionally unclear how to get top working with libssh2 but it works perfectly fine with phpseclib: [exec() with and without a PTY vs Interactive Shells: top](/docs/commands#top)