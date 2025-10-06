---
title: Speed
---

Where math operations are concerned phpseclib will use whatever extensions are availale to speed up operations. The impact of these extensions on various versions of PHP is shown below.

Note that the following benchmarks were performed with phpseclib v1. phpseclib v3's performance should be comparable. The reason phpseclib v1 was employed is to show how PHP has sped up over the years.

The benchmarks were [performed on GitHub Actions](https://github.com/phpseclib/benchmarks) using Docker containers from [phpseclib/docker-php](https://github.com/phpseclib/docker-php).

## Benchmarks

<table border="1" style={{display: 'table'}}>
  <thead>
    <tr>
      <td style={{background: 'white'}}></td>
      <td>PHP32</td>
      <td>PHP64</td>
      <td>BCMath</td>
      <td>PHP32</td>
      <td>PHP64</td>
      <td>BCMath</td>
      <td>GMP</td>
    </tr>
    <tr>
      <td style={{background: 'white'}}></td>
      <td colspan="3" style={{background: 'wheat', fontWeight: 'normal', textAlign: 'center'}}>w/o OpenSSL</td>
      <td colspan="3" style={{background: 'wheat', fontWeight: 'normal', textAlign: 'center'}}>w/ OpenSSL</td>
      <td style={{background: 'white'}}></td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 4.4</b>
      </td>
      <td style={{background: '#ffd0d0'}}>7.033</td>
      <td style={{background: '#ff6161'}}>4.606</td>
      <td style={{background: '#ffb0b0'}}>2.310</td>
      <td style={{background: '#ffe7e7'}}>0.710</td>
      <td style={{background: '#ffebeb'}}>0.587</td>
      <td style={{background: '#fffdfd'}}>0.062</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 5.0</b>
      </td>
      <td style={{background: '#ff0000'}}>7.396</td>
      <td style={{background: '#ff5959'}}>4.825</td>
      <td style={{background: '#ffb1b1'}}>2.265</td>
      <td style={{background: '#ffe6e6'}}>0.749</td>
      <td style={{background: '#ffeaea'}}>0.617</td>
      <td style={{background: '#fffdfd'}}>0.061</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 5.1</b>
      </td>
      <td style={{background: '#ff8e8e'}}>3.278</td>
      <td style={{background: '#ffbaba'}}>2.024</td>
      <td style={{background: '#ffb2b2'}}>2.257</td>
      <td style={{background: '#fff2f2'}}>0.403</td>
      <td style={{background: '#fff3f3'}}>0.352</td>
      <td style={{background: '#fffdfd'}}>0.060</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 5.2</b>
      </td>
      <td style={{background: '#ff8181'}}>3.666</td>
      <td style={{background: '#ffb7b7'}}>2.092</td>
      <td style={{background: '#ffb2b2'}}>2.244</td>
      <td style={{background: '#fff3f3'}}>0.368</td>
      <td style={{background: '#fff5f5'}}>0.316</td>
      <td style={{background: '#fffdfd'}}>0.058</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 5.3</b>
      </td>
      <td style={{background: '#ff8e8e'}}>3.288</td>
      <td style={{background: '#ffbdbd'}}>1.939</td>
      <td style={{background: '#ffb1b1'}}>2.276</td>
      <td style={{background: '#fff3f3'}}>0.356</td>
      <td style={{background: '#fff5f5'}}>0.297</td>
      <td style={{background: '#fffefe'}}>0.058</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 5.4</b>
      </td>
      <td style={{background: '#ffb8b8'}}>2.067</td>
      <td style={{background: '#ffd5d5'}}>1.242</td>
      <td style={{background: '#ffb1b1'}}>2.288</td>
      <td style={{background: '#fff7f7'}}>0.254</td>
      <td style={{background: '#fff8f8'}}>0.209</td>
      <td style={{background: '#fffdfd'}}>0.059</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 5.5</b>
      </td>
      <td style={{background: '#ffb8b8'}}>2.060</td>
      <td style={{background: '#ffd6d6'}}>1.200</td>
      <td style={{background: '#ffb0b0'}}>2.314</td>
      <td style={{background: '#fff7f7'}}>0.249</td>
      <td style={{background: '#fff8f8'}}>0.205</td>
      <td style={{background: '#fffefe'}}>0.058</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 5.6</b>
      </td>
      <td style={{background: '#ffbbbb'}}>1.989</td>
      <td style={{background: '#ffd6d6'}}>1.192</td>
      <td style={{background: '#ffb0b0'}}>2.311</td>
      <td style={{background: '#fff7f7'}}>0.243</td>
      <td style={{background: '#fff8f8'}}>0.206</td>
      <td style={{background: '#fffefe'}}>0.057</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 7.0</b>
      </td>
      <td style={{background: '#ffe0e0'}}>0.908</td>
      <td style={{background: '#ffeded'}}>0.548</td>
      <td style={{background: '#ffb1b1'}}>2.282</td>
      <td style={{background: '#fffcfc'}}>0.089</td>
      <td style={{background: '#fffdfd'}}>0.073</td>
      <td style={{background: '#fffefe'}}>0.055</td>
      <td style={{background: '#ffffff'}}>0.001</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 7.1</b>
      </td>
      <td style={{background: '#ffe5e5'}}>0.773</td>
      <td style={{background: '#ffeeee'}}>0.500</td>
      <td style={{background: '#ffb0b0'}}>2.305</td>
      <td style={{background: '#fffdfd'}}>0.082</td>
      <td style={{background: '#fffdfd'}}>0.072</td>
      <td style={{background: '#fffefe'}}>0.056</td>
      <td style={{background: '#ffffff'}}>0.001</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 7.2</b>
      </td>
      <td style={{background: '#ffe7e7'}}>0.701</td>
      <td style={{background: '#fff0f0'}}>0.460</td>
      <td style={{background: '#ffb0b0'}}>2.314</td>
      <td style={{background: '#fffdfd'}}>0.064</td>
      <td style={{background: '#fffefe'}}>0.055</td>
      <td style={{background: '#fffefe'}}>0.055</td>
      <td style={{background: '#ffffff'}}>0.001</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 7.3</b>
      </td>
      <td style={{background: '#ffe8e8'}}>0.683</td>
      <td style={{background: '#fff0f0'}}>0.445</td>
      <td style={{background: '#ffb0b0'}}>2.305</td>
      <td style={{background: '#fffdfd'}}>0.063</td>
      <td style={{background: '#fffefe'}}>0.054</td>
      <td style={{background: '#fffefe'}}>0.053</td>
      <td style={{background: '#ffffff'}}>0.001</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 7.4</b>
      </td>
      <td style={{background: '#ffeaea'}}>0.614</td>
      <td style={{background: '#fff2f2'}}>0.403</td>
      <td style={{background: '#ffafaf'}}>2.349</td>
      <td style={{background: '#fffdfd'}}>0.059</td>
      <td style={{background: '#fffefe'}}>0.050</td>
      <td style={{background: '#fffefe'}}>0.055</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 8.0</b>
      </td>
      <td style={{background: '#ffe9e9'}}>0.642</td>
      <td style={{background: '#fff1f1'}}>0.415</td>
      <td style={{background: '#ffb2b2'}}>2.251</td>
      <td style={{background: '#fffdfd'}}>0.060</td>
      <td style={{background: '#fffefe'}}>0.052</td>
      <td style={{background: '#fffefe'}}>0.053</td>
      <td style={{background: '#ffffff'}}>0.001</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 8.1</b>
      </td>
      <td style={{background: '#ffe9e9'}}>0.642</td>
      <td style={{background: '#fff1f1'}}>0.416</td>
      <td style={{background: '#ffb2b2'}}>2.234</td>
      <td style={{background: '#fffdfd'}}>0.060</td>
      <td style={{background: '#fffefe'}}>0.051</td>
      <td style={{background: '#fffefe'}}>0.053</td>
      <td style={{background: '#ffffff'}}>0.003</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 8.2</b>
      </td>
      <td style={{background: '#ffeaea'}}>0.619</td>
      <td style={{background: '#fff1f1'}}>0.407</td>
      <td style={{background: '#ffb2b2'}}>2.235</td>
      <td style={{background: '#fffdfd'}}>0.060</td>
      <td style={{background: '#fffefe'}}>0.051</td>
      <td style={{background: '#fffefe'}}>0.054</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 8.3</b>
      </td>
      <td style={{background: '#ffe9e9'}}>0.646</td>
      <td style={{background: '#fff1f1'}}>0.417</td>
      <td style={{background: '#ffb3b3'}}>2.205</td>
      <td style={{background: '#fffdfd'}}>0.061</td>
      <td style={{background: '#fffefe'}}>0.052</td>
      <td style={{background: '#fffefe'}}>0.052</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 8.4</b>
      </td>
      <td style={{background: '#ffeaea'}}>0.634</td>
      <td style={{background: '#fff1f1'}}>0.417</td>
      <td style={{background: '#fffefe'}}>0.056</td>
      <td style={{background: '#fffdfd'}}>0.061</td>
      <td style={{background: '#fffefe'}}>0.053</td>
      <td style={{background: '#ffffff'}}>0.010</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
  </tbody>
</table>

## Benchmarks with JIT

PHP 8 [introduced](https://wiki.php.net/rfc/jit) a new [Just-In-Time (JIT) compilation](https://en.wikipedia.org/wiki/Just-in-time_compilation) engine. The specific JIT settings that were used can be seen in the Docker containers [opcache.ini](https://github.com/phpseclib/docker-php/blob/8.0jit/opcache.ini).

<!--
PHP 8.4 introduced a new [JIT implementation based on the IR framework](https://wiki.php.net/rfc/jit-ir) but it doesn't seem to have amounted to much improvement gain where phpseclib is concerned.
-->

<table border="1" style={{display: 'table'}}>
  <thead>
    <tr>
      <td style={{background: 'white'}}></td>
      <td>PHP32</td>
      <td>PHP64</td>
      <td>BCMath</td>
      <td>PHP32</td>
      <td>PHP64</td>
      <td>BCMath</td>
      <td>GMP</td>
    </tr>
    <tr>
      <td style={{background: 'white'}}></td>
      <td colspan="3" style={{background: 'wheat', fontWeight: 'normal', textAlign: 'center'}}>w/o OpenSSL</td>
      <td colspan="3" style={{background: 'wheat', fontWeight: 'normal', textAlign: 'center'}}>w/ OpenSSL</td>
      <td style={{background: 'white'}}></td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 8.0</b>
      </td>
      <td style={{background: '#fff8f8'}}>0.204</td>
      <td style={{background: '#fffcfc'}}>0.103</td>
      <td style={{background: '#ffb2b2'}}>2.255</td>
      <td style={{background: '#fffefe'}}>0.032</td>
      <td style={{background: '#ffffff'}}>0.029</td>
      <td style={{background: '#fffefe'}}>0.053</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 8.1</b>
      </td>
      <td style={{background: '#fff9f9'}}>0.190</td>
      <td style={{background: '#fffdfd'}}>0.087</td>
      <td style={{background: '#ffb2b2'}}>2.234</td>
      <td style={{background: '#fffefe'}}>0.033</td>
      <td style={{background: '#ffffff'}}>0.029</td>
      <td style={{background: '#fffefe'}}>0.055</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 8.2</b>
      </td>
      <td style={{background: '#fff9f9'}}>0.188</td>
      <td style={{background: '#fffcfc'}}>0.089</td>
      <td style={{background: '#ffb2b2'}}>2.238</td>
      <td style={{background: '#fffefe'}}>0.033</td>
      <td style={{background: '#fffefe'}}>0.042</td>
      <td style={{background: '#fffefe'}}>0.054</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 8.3</b>
      </td>
      <td style={{background: '#fff9f9'}}>0.189</td>
      <td style={{background: '#fffcfc'}}>0.087</td>
      <td style={{background: '#ffb3b3'}}>2.207</td>
      <td style={{background: '#fffefe'}}>0.033</td>
      <td style={{background: '#ffffff'}}>0.029</td>
      <td style={{background: '#fffefe'}}>0.052</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
    <tr>
      <td style={{background: 'yellow'}}>
        <b>PHP 8.4</b>
      </td>
      <td style={{background: '#fff9f9'}}>0.179</td>
      <td style={{background: '#fffdfd'}}>0.087</td>
      <td style={{background: '#fffefe'}}>0.058</td>
      <td style={{background: '#fffefe'}}>0.036</td>
      <td style={{background: '#fffefe'}}>0.032</td>
      <td style={{background: '#ffffff'}}>0.012</td>
      <td style={{background: '#ffffff'}}>0.002</td>
    </tr>
  </tbody>
</table>

## GMP Engine

[GMP](http://en.wikipedia.org/wiki/GNU_Multiple_Precision_Arithmetic_Library), to quote wikipedia, "_aims to be faster than any other bignum library_", using "_highly optimized assembly language code_".

## BCMath

BCMath was _significantly_ sped up in PHP 8.4. [BCMath Performance Improvement Explanation](https://speakerdeck.com/sakitakamachi/bcmath-performance-improvement-explanation) (in Japanese) explains how this was done.

## PHP32 / PHP64

These days, most systems are 64-bit, however, a notable exception are [Raspberry Pi](https://en.wikipedia.org/wiki/Raspberry_Pi_OS)'s.

On 32-bit systems phpseclib uses base-2**26 to reduce the number of digits of each number. When two 26-bit numbers are multiplied together the result is a 64-bit floating point (of which only 48 bits are used), which is then converted back to two 32-bit signed integers (of which only 26 bits are used).

On 64-bit systems phpseclib uses base-2**31 to reduce the number of digits of each number. When two 31-bit numbers are multiplied together the result is a 64-bit signed integer (of which only 62 bits are used), which is then converted back to two 32-bit signed integers (of which only 31 bits are used).

## OpenSSL Enhancements

Only used for powMod(). Converts the exponent and the modulo to an appropriately formatted RSA public key and performs unpadded RSA encryption with that.