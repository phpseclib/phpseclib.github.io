---
title: Overview
---

All exceptions thrown by phpseclib implement the `\phpseclib3\Exception\BaseException` interface and extend `\Exception`. Consequently, if you wanted to catch exceptions thrown _exclusively_ by phpseclib one could do `catch (\phpseclib3\Exception\BaseException $e)`.

Exceptions are organized into several categories as elaborated below.

## BadConfigurationException

**Environmental setup.** The library is told to use tools it doesn't have. For example, calling `BigInteger::setEngine('GMP')` when the GMP extension is unavailable would trigger this exception.

## InvalidStateException

**Developer error.** The code is structured wrong or you're calling things in the wrong order. Or else code that shouldn't be possible to reach was somehow reached.

Exceptions that extend this exception are:

- `BadMethodCallException`. eg. you tried to call `setIV()` on a symmetric cipher that's in a mode that doesn't us IV's (eg. ECB)
- `InvalidArgumentException`. eg. you called `DH::computeSecret()` with an EC\PrivateKey instance for secp256k1 and an EC\PublicKey instance for nistp256 (they need to match)
- `InvalidModeException`. eg. you tried to call `new AES('zzz')` vs `new AES('ctr')`.

## UnexpectedValueException

**External/Unknown failure.** Data is garbled or the environment failed in an unexpected way. Note that this doesn't always mean that _unexpected_ data was encountered so much as it means that _expected_ data wasn't found. eg. the index of a book says that somebody or something is mentioned on page 50 and then you go to look for page 50 and you don't find it. you find page 49 and 52 but pages 50 and 51 have been ripped out.

Exceptions that extend this exception are:

- `BadDecryptionException`. eg. you tried to decrypt a string encrypted with CBC mode that has bad padding.
- `CharacterConversionException`. eg. you tried to convert a malformed UTF8String to a PrintableString.
- `ConnectionClosedException`. eg. the connection to an SSH2 server was unexpectedly closed.
- `FileSystemException`. eg. you're trying to download a file locally via SFTP but the local file can't be opened for writing.
- `NoKeyLoadedException`. eg. `PublicKeyLoader::load('...')` failed to load the key in question.
- `UnexpectedSFTPPacketException`. eg. phpseclib was expecting the SFTP server to send either an SSH_FXP_STATUS or SSH_FXP_HANDLE packet but a SSH_FXP_NAME packet was sent out instead.
- `UnexpectedSSHMessageException`. eg. phpseclib was expecting the SSH2 server to send a SSH_MSG_NEWKEYS packet got some other packet back instead.
<!-- the following are mainly used internally: -->
<!-- `EncodedDataUnavailableException` -->
<!-- `EOCException` -->
<!-- `InvalidPacketLengthException` -->

## UnsupportedValueException

**Known limitation.** We know what this is, but either phpseclib or the algorithm can't do it.

Exceptions that extend this exception are:

- `ExcessivelyDeepDataException`. eg. an ASN.1 SEQUENCE with a bunch of SEQUENCES recursively nested within it. Extends ResourceLimitException.
- `KeyConstraintException`. eg. you're trying to use RSA to encrypt a string that's longer than the key length.
- `LengthException`. eg. you're trying to use use an 80 bit key (strlen of 10) with AES.
<!-- in some cases LengthException is thrown by RSA; maybe these ought to be replaced with KeyConstraintException? -->
- `NoSupportedAlgorithmsException`. eg. you're trying to connect to an SSH server that doesn't support any of the encryption algorithms that phpseclib supports.
- `PasswordNeededException`. eg. `PublicKeyLoader::load('...')` failed because the key is encrypted and you didn't provide a password.
- `ResourceLimitException`. eg. you're trying to test the primality of a number that's 1MB in length.
- `ServiceUnavailableException`. eg. you're trying to connect to a server with SSH2 but there's not an SSH2 server running on that machine.
- `UnsupportedAlgorithmException`. eg. when you try to load an encrypted PKCS1 private key that's encrypted with an algorithm phpseclib doesn't support.
- `UnsupportedCurveException`. eg. when you try to load a elliptic curve key that uses a curve that phpseclib doesn't support.

## TimeoutException

**Recoverable network failure.** The data might be fine, but the clock ran out. Thrown by the SSH2 and SFTP classes.