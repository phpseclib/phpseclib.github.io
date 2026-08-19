---
title: SFTP
sidebar_position: 3
---

To use SFTP you'll need to use the SFTP class instead of the SSH2 class. eg.

```php
use phpseclib4\Net\SFTP;

$sftp = new SFTP('localhost');
$sftp->login('username', 'password');
```

Because the SFTP class extends the SSH2 class the SFTP class has all the methods that the SSH2 class does.

## Uploading Files

The function definition for `put()` is as follows:

```php
public function put(
    string $remote_file,
    #[SensitiveParameter] mixed $data,
    int $mode = self::SOURCE_STRING,
    int $start = -1,
    int $local_start = -1,
    ?\Closure $progressCallback = null
): void
```

```php
// puts a three-byte file named filename.remote on the SFTP server
$sftp->put('filename.remote', 'xxx');
// puts an x-byte file named filename.remote on the SFTP server,
// where x is the size of filename.local
$sftp->put('filename.remote', 'filename.local', SFTP::SOURCE_LOCAL_FILE);
```

### Uploading strings vs. files

`$sftp->put('filename.remote', 'filename.local')` creates filename.remote on the remote server with 'filename.local' as the contents.

```php
$sftp->put(
    'filename.remote',
    'filename.local',
    SFTP::SOURCE_LOCAL_FILE
)
```
This creates filename.remote on the remote server such that the contents of it and filename.local match. ie. with `SFTP::SOURCE_LOCAL_FILE` it uploads a file and without it it uploads a string.

### Resuming transfers

```php
$sftp->put(
    'filename.remote',
    'xxx',
    SFTP::RESUME
)
```
This will append 'xxx' to filename.remote.

```php
$sftp->put(
    'filename.remote',
    'filename.local',
    SFTP::SOURCE_LOCAL_FILE | SFTP::RESUME_START
)
```
This will append filename.remote to filename.local.

```php
$sftp->put(
    'filename.remote',
    'filename.local',
    SFTP::SOURCE_LOCAL_FILE | SFTP::RESUME
)
```
This will append all but the first `$sftp->size('filename.remote')` bytes of filename.local to filename.remote. The idea being that if your transfer is interupted you can restart it.

### Positional control

`$start` and `$local_start` give you more fine grained control over this process and take precident over `SFTP::RESUME` when they're non-negative. ie. `$start` could let you write at the end of a file (like `SFTP::RESUME`) or in the middle of one. `$local_start` could let you start your reading from the end of a file (like `SFTP::RESUME_START`) or in the middle of one.

## Downloading Files

The function definition for `get()` is as follows:

```php
public function get(
    string $remote_file,
    mixed $local_file = null,
    int $offset = 0,
    int $length = -1,
    ?\Closure $progressCallback = null
): ?string
```

```php
// outputs the contents of filename.remote to the screen
echo $sftp->get('filename.remote');
// copies filename.remote to filename.local from the SFTP server
$sftp->get('filename.remote', 'filename.local');
```

Returns a string containing the contents of `$remote_file` if `$local_file` is left undefined or a boolean false if the operation was unsuccessful. If `$local_file` is defined, returns true or false depending on the success of the operation.

If `$local_file` is an anonymous function you can stream the download real time or whatever. eg.

```php
$sftp->get('filename.remote', function ($output) {
    echo $output;
});
```

## Preserving the Date

If you want the uploaded or downloaded file to have the same last modified / accessed time as the original file by doing `$sftp->enableDatePreservation()`. `$sftp->disableDatePreservation()` will turn this behavior off. The default status is "off".

## Directory Management

```php
$sftp->mkdir('test'); // create directory 'test'
$sftp->chdir('test'); // open directory 'test'
echo $sftp->pwd(); // show that we're in the 'test' directory
$sftp->chdir('..'); // go back to the parent directory
$sftp->rmdir('test'); // delete the directory
// if the directory had files in it we'd need to do a recursive delete
//$sftp->delete('test');
```

### mkdir

phpseclib's mkdir accepts the same parameters as PHP's [mkdir](https://www.php.net/mkdir). Here's the method definition:

```php
public function mkdir(
    string $dir,
    int $mode = -1,
    bool $recursive = false
): void
```
If `$mode` isn't specified (or if it's -1) then the operating system will most likely use the [umask](https://en.wikipedia.org/wiki/Umask). If you do want to specify the permission note that it needs to be in octal. So instead of passing `777` you'd pass in `0777`. The preceeding 0 is how PHP knows to treat an integer as an octal number as opposed to a decimal number.

`$recursive` allows the creation of nested directories specified in the pathname.

## Directory Listing

```php
print_r($sftp->nlist()); // == $sftp->nlist('.')
print_r($sftp->rawlist()); // == $sftp->rawlist('.')
```

`$sftp->nlist()`:
<div class="tree">
<details>
<summary>0</summary>
<div>uploads</div>
</details>
<details>
<summary>1</summary>
<div>..</div>
</details>
<details>
<summary>2</summary>
<div>.</div>
</details>
<details>
<summary>3</summary>
<div>.profile</div>
</details>
<details>
<summary>4</summary>
<div>.bashrc</div>
</details>
<details>
<summary>5</summary>
<div>.bash_logout</div>
</details>
</div>

`$sftp->rawlist()`:

<div class="tree">
<details>
<summary>uploads</summary>
<details>
<summary>size</summary>
<div>4096</div>
</details>
<details>
<summary>uid</summary>
<div>1001</div>
</details>
<details>
<summary>gid</summary>
<div>1002</div>
</details>
<details>
<summary>mode</summary>
<div>16877</div>
</details>
<details>
<summary>type</summary>
<div>2</div>
</details>
<details>
<summary>atime</summary>
<div>1338498490</div>
</details>
<details>
<summary>mtime</summary>
<div>1338497853</div>
</details>
<details>
<summary>filename</summary>
<div>uploads</div>
</details>
</details>
<details>
  <summary>..</summary>
<details>
<summary>size</summary>
<div>4096</div>
</details>
<details>
<summary>uid</summary>
<div>0</div>
</details>
<details>
<summary>gid</summary>
<div>0</div>
</details>
<details>
<summary>mode</summary>
<div>16877</div>
</details>
<details>
<summary>type</summary>
<div>2</div>
</details>
<details>
<summary>atime</summary>
<div>1338499576</div>
</details>
<details>
<summary>mtime</summary>
<div>1338497853</div>
</details>
<details>
<summary>filename</summary>
<div>..</div>
</details>
</details>
<details>
  <summary>.profile</summary>
<details>
<summary>size</summary>
<div>675</div>
</details>
<details>
<summary>uid</summary>
<div>1012</div>
</details>
<details>
<summary>gid</summary>
<div>1013</div>
</details>
<details>
<summary>mode</summary>
<div>33188</div>
</details>
<details>
<summary>type</summary>
<div>1</div>
</details>
<details>
<summary>atime</summary>
<div>1338497357</div>
</details>
<details>
<summary>mtime</summary>
<div>1338497357</div>
</details>
<details>
<summary>filename</summary>
<div>.profile</div>
</details>
</details>
<details>
  <summary>bashrc</summary>
<details>
<summary>size</summary>
<div>3353</div>
</details>
<details>
<summary>uid</summary>
<div>1012</div>
</details>
<details>
<summary>gid</summary>
<div>1013</div>
</details>
<details>
<summary>mode</summary>
<div>33188</div>
</details>
<details>
<summary>type</summary>
<div>1</div>
</details>
<details>
<summary>atime</summary>
<div>1338497357</div>
</details>
<details>
<summary>mtime</summary>
<div>1338497357</div>
</details>
<details>
<summary>filename</summary>
<div>bashrc</div>
</details>
</details>
<details>
  <summary>.bash_logout</summary>
<details>
<summary>size</summary>
<div>270</div>
</details>
<details>
<summary>uid</summary>
<div>1012</div>
</details>
<details>
<summary>gid</summary>
<div>1013</div>
</details>
<details>
<summary>mode</summary>
<div>33188</div>
</details>
<details>
<summary>type</summary>
<div>1</div>
</details>
<details>
<summary>atime</summary>
<div>1338497357</div>
</details>
<details>
<summary>mtime</summary>
<div>1338497357</div>
</details>
<details>
<summary>filename</summary>
<div>.bash_logout</div>
</details>
</details>
</div>

The `type` index corresponds to one of the following class constants (that live in the `phpseclib4\Net\SFTP\FileType` class):

|Name|Value|
|---|---|
|`REGULAR`|1|
|`DIRECTORY`|2|
|`SYMLINK`|3|
|`SPECIAL`|4|
|`UNKNOWN`|5|
|`SOCKET`|6|
|`CHAR_DEVICE`|7|
|`TYPE_FIFO`|8|

eg. if you want to reference one of these constants you'd need to do this:

```php
use phpseclib4\Net\SFTP\FileType;

FileType::DIRECTORY;
```

Both `nlist` and `rawlist` accept an optional second parameter - `$recursive` - that, if set to `bool(true)`, will return a list of all the files in the specified directory _and_ all subdirectories contained therein (and all subdirectories contained within those subdirectories, etc).

### Setting List Order

Directory output is not sorted by default.

If sorting is enabled directories and files will be sorted independently with directories appearing before files in the resultant array that is returned.

Any parameter returned by stat is a valid sort parameter for this function. Filename comparisons are case insensitive.

Examples:

```php
$sftp->setListOrder('filename', SORT_ASC);
$sftp->setListOrder('size', SORT_DESC, 'filename', SORT_ASC);
// separates directories from files but doesn't do any sorting beyond that:
$sftp->setListOrder(true);
// don't do any sort of sorting:
$sftp->setListOrder();
```

### Empty Directories

In recursive mode `$sftp->nlist()` includes `.` and `..` for every directory, not just the root. This means empty directories show up in the output:

```
dir/.
dir/..
dir/file.ext
file.ext
.
..
```

If `dir` were an empty directory it'd still appear in the listing (as `dir/.` and `dir/..`).

### Permissions

If you expand the `$sftp->rawlist()` output in the earlier example you'll see a key: `mode`. For .profile that value is set to 33188. What does that mean? To understand let's first convert that to binary: `chunk_split(decbin(33188), 4, ' ')`. That gives us the following:

```
1000 0001 1010 0100
```

Each bit corresponds to the following:

<table id="bitmask">
  <tr>
    <td>16</td>
    <td>15</td>
    <td>14</td>
    <td>13</td>
    <td>12</td>
    <td>11</td>
    <td>10</td>
    <td>9</td>
    <td>8</td>
    <td>7</td>
    <td>6</td>
    <td>5</td>
    <td>4</td>
    <td>3</td>
    <td>2</td>
    <td>1</td>
  </tr>
  <tr>
    <td colspan="4">File Type</td>
    <td colspan="3">Special Modes</td>
    <td colspan="3">Owner</td>
    <td colspan="3">Group</td>
    <td colspan="3">Others</td>
  </tr>
  <tr>
    <td colspan="7"></td>
    <td>r</td>
    <td>w</td>
    <td>x</td>
    <td>r</td>
    <td>w</td>
    <td>x</td>
    <td>r</td>
    <td>w</td>
    <td>x</td>
  </tr>
</table>

This first four bits mean that it's a regular file (`NET_SFTP_TYPE_REGULAR`). The last nine bits mean that the file's permissions, in numeric notation, are 644 or, in symbolic notation, `-rw-r--r-`. Here are a few scenarios;

Here are a few scenarios:

* "Others" permissions: `33188 & 07 == 4` or 100.
* "Owners" permissions: `(33188 >> 6) & 07 == 6` or 110.
* Test to see if g+r is set: `(33188 >> 5) & 1`

The special modes are [setuid, setgid and sticky](https://en.wikipedia.org/wiki/File_system_permissions#Changing_permission_behavior_with_setuid,_setgid,_and_sticky_bits).

You can learn more about the file type by looking at the implementation of `parseMode()` in Net/SFTP.php or by looking at the "_mode_ **file types**" table in [PHP: stat - Manual](https://www.php.net/stat#refsect1-function.stat-returnvalues)

For further reading see [PHP: fileperms - Manual](https://www.php.net/manual/en/function.fileperms.php)

## File Attributes

```php
$sftp->chmod('filename.remote', 0777);
//$sftp->chmod('dirname.remote', 0777, true); // recursively change permissions on a directory
// has the same syntax as http://php.net/touch
$sftp->touch('filename.remote');
$sftp->chown('filename.remote', $uid);
//$sftp->chown('filename.remote', $uid, true); // recursively change the owner
$sftp->chgrp('filename.remote', $gid);
//$sftp->chgrp('filename.remote', $gid, true); // recursively change the group
$sftp->truncate('filename.remote', $size);
```

## File Information

```php
print_r($sftp->stat('filename.remote'));
print_r($sftp->lstat('filename.remote'));
echo $sftp->fileatime('filename.remote') . "\n"; // last accessed time
echo $sftp->filemtime('filename.remote') . "\n"; // last modified time
echo $sftp->fileperms('filename.remote') . "\n";
echo $sftp->fileowner('filename.remote') . "\n";
echo $sftp->filegroup('filename.remote') . "\n";
echo $sftp->filesize('filename.remote') . "\n";
echo $sftp->filetype('filename.remote') . "\n";
echo $sftp->file_exists('filename.remote') ? "exists\n" : "doesn't exist\n";
echo $sftp->is_dir('filename.remote') ? "is dir\n" : "is not dir\n";
echo $sftp->is_file('filename.remote') ? "is file\n" : "is not file\n";
echo $sftp->is_readable('filename.remote') ? "is readable\n" : "is not readable\n";
echo $sftp->is_writeable('filename.remote') ? "is writeable\n" : "is not writeable\n";
// $sftp->is_writable() works as well
```
`stat()` and `lstat()` return associative arrays with misc information about the files. `lstat()` and `stat()` are identical with the caveat that when the file in question is a [symbolic link](http://en.wikipedia.org/wiki/Symbolic_link) the information returned refers to the link itself and not the file (or directory) being linked to.

`stat()` example:

<div class="tree">
<details>
<summary>size</summary>
<div>856</div>
</details>
<details>
<summary>uid</summary>
<div>1000</div>
</details>
<details>
<summary>gid</summary>
<div>1000</div>
</details>
<details>
<summary>mode</summary>
<div>33188</div>
</details>
<details>
<summary>type</summary>
<div>1</div>
</details>
<details>
<summary>atime</summary>
<div>1580971886</div>
</details>
<details>
<summary>mtime</summary>
<div>1555785478</div>
</details>
</div>

See [Permissions](#permissions) for more information on `mode` or `fileperms()`.

`filetype()` returns string translations of what `stat()['type']` does.

`is_readable()` and `is_writeable()` only work on files. They work by actually opening up a file for reading or writing and then closing the file immediately thereafter. The same technique does not work for directories.

`filesize()` accepts an optional second parameter - `$recursive`. By default this parameter is `false` but if you set it to `true` it'll recurse through a directory and return the size of all the files in that directory and it's subdirectories.

## Delete and Rename

```php
$sftp->delete('filename.remote'); // deletes directories recursively
// non-recursive delete
$sftp->delete('dirname.remote', false);
// rename() return false if newname.remote already exists
$sftp->rename('filename.remote', 'newname.remote');
```

## Changing SFTP Versions

There are seven different versions of SFTP that are defined (v0 through v6). OpenSSH only supports one version (v3) but some SFTP servers (eg. [Bitvise SSH Server](https://www.bitvise.com/ssh-server)) can be configured to support all versions.

SFTP servers that support multiple versions will have a default version (usually v3) and will specifiy what other SFTP versions they support through the use of an extension.

You can set the preferred version by calling `setPreferredVersion(6)`. You can see what version was ultimately negotiated by calling `getNegotiatedVersion()`. You can see what versions the server supports by calling `getSupportedVersions()`. When multiple verisons of SFTP are supported here's what the output of this method will look like:

<div class="tree">
<details>
<summary>version</summary>
<div>3</div>
</details>
<details>
<summary>extensions</summary>
<div>3,4,5,6</div>
</details>
</div>

If only one version of SFTP is supported then the extensions key will most likely not be present.

## Stream Wrapper

Files can alternatively be accessed with a stream wrapper:

```php
use phpseclib4\Net\SFTP\Stream;
use phpseclib4\Net\SFTP;

Stream::register(); // returns true if successful, false on failure

$fp = fopen('sftp://user:pass@127.0.0.1:22/home/user/filename.ext', 'r'); // the port number is optional

$temp = '';
while (!feof($fp)) {
    $temp.= fread($fp, 1024);
}
fclose($fp);
```

`fopen()` isn't the only function that works — once the protocol is registered any of PHP's filesystem functions can be pointed at an `sftp://` URL. eg.

```php
$contents = file_get_contents('sftp://user:pass@127.0.0.1/home/user/filename.ext');
file_put_contents('sftp://user:pass@127.0.0.1/home/user/filename.ext', 'xxx');
copy('filename.local', 'sftp://user:pass@127.0.0.1/home/user/filename.ext');

$list = scandir('sftp://user:pass@127.0.0.1/root/');
print_r($list);
```

### Non-Password Authentication

Putting the username and password in the URL is the simplest approach but there's no way to put a private key in a URL, so it doesn't work for public key authentication. The easiest way to do that is to login yourself and then use the `SFTP` object where the hostname would normally go:

```php
use phpseclib4\Crypt\PublicKeyLoader;

$sftp = new SFTP('terrafrost.com', 22); // the port number is optional
$sftp->login('root', PublicKeyLoader::load(file_get_contents('terrafrost.pem')));

$list = scandir("sftp://$sftp/root/");
print_r($list);
```

The other way is to use a stream context (see below).

### Customizing the Protocol

You can change the protocol (which defaults to `sftp://`) thusly:

```php
Stream::register('ssh2.sftp');

$fp = fopen("ssh2.sftp://$sftp/home/vagrant/1mb", 'r');
```

Whatever name you register is also the key you'll need to use in your stream context, so if you register `ssh2.sftp` then your context options need to be under `ssh2.sftp` as well.

### With Stream Context

```php
use phpseclib4\Crypt\PublicKeyLoader;

$protocol = 'sftp';

Stream::register($protocol);

$sftp = [
    //'session' => new SFTP('terrafrost.com'),
    'username' => 'root',
    'privkey' => PublicKeyLoader::load(file_get_contents('terrafrost.pem'))
];
$options = [$protocol => $sftp];
$context = stream_context_create($options);

$list = scandir($protocol . '://terrafrost.com/root/', context: $context);
print_r($list);
```

**Context options**

|Name|Usage|
|---|---|
|_session_|Preconnected sftp resource to be reused|
|_sftp_|Preconnected sftp resource to be reused|
|_username_|Username to connect as|
|_password_|Password to use with password authentication|
|_privkey_|Public key resource to be used|

If you supply `session` or `sftp` and it's an instance of `SFTP` then it'll assume you've already logged in and it'll ignore the username, password and privkey parameters. ie. do one or the other - not both.

Also, if you set `session` or `sftp` then the hostname in the URL doesn't matter. Instead of doing `"$protocol://domain.tld/root/"` you can do `"$protocol://dummy/root/"`, even if the server you're connecting to is domain.tld.

### Default Context

If you don't want to pass the `$context` resource to every PHP function call you can set a default context:

```php
$protocol = 'sftp';

Stream::register($protocol);

$sftp = [
    //'session' => new SFTP('terrafrost.com'),
    'username' => 'root',
    'privkey' => PublicKeyLoader::load(file_get_contents('terrafrost.pem'))
];
$options = [$protocol => $sftp];
stream_context_set_default($options);

$list = scandir($protocol . '://terrafrost.com/root/');
print_r($list);
```

Note that you can't set defaults for notifications.

### Notifications

You can also do notifications. eg.

```php
// from https://www.php.net/manual/en/function.stream-notification-callback.php
function stream_notification_callback($notification_code, $severity, $message, $message_code, $bytes_transferred, $bytes_max) {
    switch($notification_code) {
        case STREAM_NOTIFY_RESOLVE:
        case STREAM_NOTIFY_AUTH_REQUIRED:
        case STREAM_NOTIFY_COMPLETED:
        case STREAM_NOTIFY_FAILURE:
        case STREAM_NOTIFY_AUTH_RESULT:
            var_dump($notification_code, $severity, $message, $message_code, $bytes_transferred, $bytes_max);
            /* Ignore */
            break;
        case STREAM_NOTIFY_REDIRECTED:
            echo "Being redirected to: ", $message;
            break;
        case STREAM_NOTIFY_CONNECT:
            echo "Connected...";
            break;
        case STREAM_NOTIFY_FILE_SIZE_IS:
            echo "Got the filesize: ", $bytes_max;
            break;
        case STREAM_NOTIFY_MIME_TYPE_IS:
            echo "Found the mime-type: ", $message;
            break;
        case STREAM_NOTIFY_PROGRESS:
            echo "Made some progress, downloaded ", $bytes_transferred, " so far";
            break;
    }
    echo "\n";
}

$protocol = 'sftp';

Stream::register($protocol);

$sftp = [
    'username' => 'root',
    'privkey' => PublicKeyLoader::load(file_get_contents('terrafrost.pem'))
];
$options = [$protocol => $sftp];
$notifications = ['notification' => 'stream_notification_callback'];
$context = stream_context_create($options, $notifications);

$list = scandir($protocol . '://terrafrost.com/root/', context: $context);
print_r($list);
```

The callback goes in the second parameter of `stream_context_create()` - the params - and not in the first one with the rest of the options.

_(inspired by [PHP: ssh2:// - Manual](https://www.php.net/manual/en/wrappers.ssh2.php))_
