---
id: sftp
title: SFTP
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

To use SFTP you'll need to use the SFTP class instead of the SSH2 class. eg.

```php
use phpseclib3\Net\SFTP;

$sftp = new SFTP('localhost');
$sftp->login('username', 'password');
```

Because the SFTP class extends the SSH2 class the SFTP class has all the methods that the SSH2 class does.

## Uploading Files

```php
// puts a three-byte file named filename.remote on the SFTP server
$sftp->put('filename.remote', 'xxx');
// puts an x-byte file named filename.remote on the SFTP server,
// where x is the size of filename.local
$sftp->put('filename.remote', 'filename.local', SFTP::SOURCE_LOCAL_FILE);
```

The function definition for `put()` is as follows:

```php
function put($remote_file, $data, $mode = SFTP::SOURCE_STRING, $start = -1, $local_start = -1, $progressCallback = null)
```

### Uploading strings vs. files

`$sftp->put('filename.remote', 'filename.local')` creates filename.remote on the remote server with 'filename.local' as the contents.

`$sftp->put('filename.remote', 'filename.local', SFTP::SOURCE_LOCAL_FILE)` creates filename.remote on the remote server such that the contents of it and filename.local match. ie. with `SFTP::SOURCE_LOCAL_FILE` it uploads a file and without it it uploads a string.

### Resuming transfers

`$sftp->put('filename.remote', 'xxx', SFTP::RESUME)` will append 'xxx' to filename.remote.

`$sftp->put('filename.remote', 'filename.local', SFTP::SOURCE_LOCAL_FILE | SFTP::RESUME_START)` will append filename.remote to filename.local.

`$sftp->put('filename.remote', 'filename.local', SFTP::SOURCE_LOCAL_FILE | SFTP::RESUME)` will append all but the first `$sftp->size('filename.remote')` bytes of filename.local to filename.remote. The idea being that if your transfer is interupted you can restart it.

### Positional control

`$start` and `$local_start` give you more fine grained control over this process and take precident over `SFTP::RESUME` when they're non-negative. ie. `$start` could let you write at the end of a file (like `SFTP::RESUME`) or in the middle of one. `$local_start` could let you start your reading from the end of a file (like `SFTP::RESUME_START`) or in the middle of one.

## Downloading Files

```php
// outputs the contents of filename.remote to the screen
echo $sftp->get('filename.remote');
// copies filename.remote to filename.local from the SFTP server
$sftp->get('filename.remote', 'filename.local');
```

The function definition for `get()` is as follows:

```php
function get($remote_file, $local_file = false, $offset = 0, $length = -1, $progressCallback = null)
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
public function mkdir($dir, $mode = -1, $recursive = false)
```
If `$mode` isn't specified (or if it's -1) then the operating system will most likely use the [umask](https://en.wikipedia.org/wiki/Umask). If you do want to specify the permission note that it needs to be in octal. So instead of passing `777` you'd pass in `0777`. The preceeding 0 is how PHP knows to treat an integer as an octal number as opposed to a decimal number.

`$recursive` allows the creation of nested directories specified in the pathname.

## Directory Listing

```php
print_r($sftp->nlist()); // == $sftp->nlist('.')
print_r($sftp->rawlist()); // == $sftp->rawlist('.')
```

`$sftp->nlist()`:
<ul class="printr" style="margin-bottom: 15px"><li><span class="name">0</span><ul><li>uploads</li></ul></li><li><span class="name">1</span><ul><li>..</li></ul></li><li><span class="name">2</span><ul><li>.</li></ul></li><li><span class="name">3</span><ul><li>.profile</li></ul></li><li><span class="name">4</span><ul><li>.bashrc</li></ul></li><li><span class="name">5</span><ul><li>.bash_logout</li></ul></li></ul>

`$sftp->rawlist()`:
<ul class="printr" style="margin-bottom: 15px"><li><span class="name">uploads</span><ul><li><span class="name">size</span><ul><li>4096</li></ul></li><li><span class="name">uid</span><ul><li>1001</li></ul></li><li><span class="name">gid</span><ul><li>1002</li></ul></li><li><span class="name">mode</span><ul><li>16877</li></ul></li><li><span class="name">type</span><ul><li>2</li></ul></li><li><span class="name">atime</span><ul><li>1338498490</li></ul></li><li><span class="name">mtime</span><ul><li>1338497853</li></ul></li><li><span class="name">filename</span><ul><li>uploads</li></ul></li></ul></li><li><span class="name">..</span><ul><li><span class="name">size</span><ul><li>4096</li></ul></li><li><span class="name">uid</span><ul><li>0</li></ul></li><li><span class="name">gid</span><ul><li>0</li></ul></li><li><span class="name">mode</span><ul><li>16877</li></ul></li><li><span class="name">type</span><ul><li>2</li></ul></li><li><span class="name">atime</span><ul><li>1338499576</li></ul></li><li><span class="name">mtime</span><ul><li>1338497853</li></ul></li><li><span class="name">filename</span><ul><li>..</li></ul></li></ul></li><li><span class="name">.</span><ul><li><span class="name">size</span><ul><li>4096</li></ul></li><li><span class="name">uid</span><ul><li>0</li></ul></li><li><span class="name">gid</span><ul><li>0</li></ul></li><li><span class="name">mode</span><ul><li>16877</li></ul></li><li><span class="name">type</span><ul><li>2</li></ul></li><li><span class="name">atime</span><ul><li>1338499576</li></ul></li><li><span class="name">mtime</span><ul><li>1338497853</li></ul></li><li><span class="name">filename</span><ul><li>.</li></ul></li></ul></li><li><span class="name">.profile</span><ul><li><span class="name">size</span><ul><li>675</li></ul></li><li><span class="name">uid</span><ul><li>1012</li></ul></li><li><span class="name">gid</span><ul><li>1013</li></ul></li><li><span class="name">mode</span><ul><li>33188</li></ul><li><span class="name">type</span><ul><li>1</li></ul></li></li><li><span class="name">atime</span><ul><li>1338497357</li></ul></li><li><span class="name">mtime</span><ul><li>1338497357</li></ul></li><li><span class="name">filename</span><ul><li>.profile</li></ul></li></ul></li><li><span class="name">bashrc</span><ul><li><span class="name">size</span><ul><li>3353</li></ul></li><li><span class="name">uid</span><ul><li>1012</li></ul></li><li><span class="name">gid</span><ul><li>1013</li></ul></li><li><span class="name">mode</span><ul><li>33188</li></ul></li><li><span class="name">type</span><ul><li>1</li></ul></li><li><span class="name">atime</span><ul><li>1338497357</li></ul></li><li><span class="name">mtime</span><ul><li>1338497357</li></ul></li><li><span class="name">filename</span><ul><li>bashrc</li></ul></li></ul></li><li><span class="name">.bash_logout</span><ul><li><span class="name">size</span><ul><li>270</li></ul></li><li><span class="name">uid</span><ul><li>1012</li></ul></li><li><span class="name">gid</span><ul><li>1013</li></ul></li><li><span class="name">mode</span><ul><li>33188</li></ul></li><li><span class="name">type</span><ul><li>1</li></ul></li><li><span class="name">atime</span><ul><li>1338497357</li></ul></li><li><span class="name">mtime</span><ul><li>1338497357</li></ul></li><li><span class="name">filename</span><ul><li>.bash_logout</li></ul></li></ul></li></ul>
The type index corresponds to one of the following named constants:

* `NET_SFTP_TYPE_REGULAR` (1)
* `NET_SFTP_TYPE_DIRECTORY` (2)
* `NET_SFTP_TYPE_SYMLINK` (3)
* `NET_SFTP_TYPE_SPECIAL` (4)
* `NET_SFTP_TYPE_UNKNOWN` (5)
* `NET_SFTP_TYPE_SOCKET` (6)
* `NET_SFTP_TYPE_CHAR_DEVICE` (7)
* `NET_SFTP_TYPE_FIFO` (8)

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

In 1.0 / 2.0 `$sftp->nlist()` doesn't return empty directories in recursive mode. Here's the sample output you'd get back from `nlist()`:
```
dir/file.ext
file.ext
.
..
```
If `dir` was an empty directory you wouldn't see it because . and .. were only included in the root directory - not in subdirectories.
Here's the output you'll get in 3.0:
```
dir/.
dir/..
dir/file.ext
file.ext
.
..
```

### Permissions

If you expand the `$sftp->rawlist()` output in the earlier example you'll see a key: `mode`. For .profile that value is set to 33188. What does that mean? To understand let's first convert that to binary: `chunk_split(decbin(33188), 4, ' ')`. That gives us the following:

```
1000 0001 1010 0100
```

Each bit corresponds to the following:

![](/img/perms.png)

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
$sftp->chmod(0777, 'filename.remote');
//$sftp->chmod(0777, 'dirname.remote', true); // recursively change permissions on a directory
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

<ul class="printr"><li><span class="name">size</span><ul><li>856</li></ul></li><li><span class="name">uid</span><ul><li>1000</li></ul></li><li><span class="name">gid</span><ul><li>1000</li></ul></li><li><span class="name">mode</span><ul><li>33188</li></ul></li><li><span class="name">type</span><ul><li>1</li></ul></li><li><span class="name">atime</span><ul><li>1580971886</li></ul></li><li><span class="name">mtime</span><ul><li>1555785478</li></ul></li></ul>

See [Permissions](#permissions) for more information on `mode` or `fileperms()`.

`filetype()` returns string translations of what `stat()['type']` does.

`is_readable()` and `is_writeable()` only work on files. They work by actually opening up a file for reading or writing and then closing the file immediately thereafter. The same technique does not work for directories.

## Delete and Rename

```php
$sftp->delete('filename.remote'); // deletes directories recursively
// non-recursive delete
$sftp->delete('dirname.remote', false);
// rename() return false if newname.remote already exists
$sftp->rename('filename.remote', 'newname.remote');
```

## Stream Wrapper

Files can alternatively be accessed with a stream wrapper:

```php
use phpseclib3\Net\SFTP\Stream;
use phpseclib3\Net\SFTP;

Stream::register();

$fp = fopen('sftp://user:pass@127.0.0.1:22/home/user/filename.ext', 'r'); // the port number is optional

$temp = '';
while (!feof($fp)) {
    $temp.= fread($fp, 1024);
}
fclose($fp);
```

### Customizing the Protocol

You can change the protocol (which defaults to `sftp://`) thusly:

```php
Stream::register('ssh2.sftp');

$fp = fopen("ssh2.sftp://$sftp/home/vagrant/1mb", 'r');
```

### Non-Password Authentication

```php
$sftp = new SFTP('127.0.0.1', 22); // the port number is optional
$sftp->login('username', $key);

$fp = fopen("sftp://$sftp/home/user/filename.ext", 'r');

$temp = '';
while (!feof($fp)) {
    $temp.= fread($fp, 1024);
}
fclose($fp);
```

### With Stream Context

```php
$protocol = 'sftp';

Stream::register($protocol);

$context = [
    $protocol => ['sftp' => $sftp]
];
$context = stream_context_create($context);

$fp = fopen($protocol . '://dummy.com/home/user/filename.txt', 'r', false, $context);
```

**Context options**

|Name|Usage|
|---|---|
|_session_|Preconnected sftp resource to be reused|
|_sftp_|Preconnected sftp resource to be reused|
|_username_|Username to connect as|
|_password_|Password to use with password authentication|
|_privkey_|Public key resource to be used|
_(inspired by [PHP: ssh2:// - Manual](https://www.php.net/manual/en/wrappers.ssh2.php))_