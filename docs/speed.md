---
id: speed
title: Speed
---

<style>
table { border: 1px outset; zborder-spacing: 2px; border-collapse: separate }
td { border: 1px inset gray; zpadding: 3px }
thead { background: yellow }
thead td { font-weight: bold }
tbody td {text-align: right }
</style>

Where math operations are concerned phpseclib will use whatever extensions are availale to speed up operations. The impact of these extensions on various versions of PHP is shown below.

Note that the following benchmarks were performed with phpseclib v1. phpseclib v3's performance should be comparable. The reason phpseclib v1 was employed is to show how PHP has sped up over the years.

The benchmarks were [performed on GitHub Actions](https://github.com/phpseclib/benchmarks) using Docker containers from [phpseclib/docker-php](https://github.com/phpseclib/docker-php).

## Benchmarks

<table border="1">
  <thead>
    <tr><td style="border: 0; background: white"></td><td>PHP32</td><td>PHP64</td><td>BCMath</td><td>PHP32</td><td>PHP64</td><td>BCMath</td><td>GMP</td></tr>
    <tr><td style="border: 0; background: white"></td><td colspan="3" style="background: wheat; font-weight: normal; text-align: center">w/o OpenSSL</td><td colspan="3" style="background: wheat; font-weight: normal; text-align: center">w/ OpenSSL</td><td style="border: 0; background: white"></td></tr>
  </thead>
  <tbody>
<tr><td style="background: yellow"><b>PHP 4.4</b></td><td style="background: #ff0000">11.038</td></td><td style="background: #ff7c7c">5.683</td></td><td style="background: #ffb6b6">3.177</td></td><td style="background: #ffebeb">0.904</td></td><td style="background: #ffeeee">0.767</td></td><td style="background: #fffdfd">0.087</td></td><td style="background: #ffffff">0.003</td></td></tr><tr><td style="background: yellow"><b>PHP 5.0</b></td><td style="background: #ff3030">8.963</td></td><td style="background: #ff8484">5.346</td></td><td style="background: #ffabab">3.649</td></td><td style="background: #ffe7e7">1.064</td></td><td style="background: #ffeaea">0.950</td></td><td style="background: #fffdfd">0.094</td></td><td style="background: #ffffff">0.002</td></td></tr><tr><td style="background: yellow"><b>PHP 5.1</b></td><td style="background: #ffa0a0">4.119</td></td><td style="background: #ffb9b9">3.047</td></td><td style="background: #ffbaba">3.022</td></td><td style="background: #fff5f5">0.464</td></td><td style="background: #fff7f7">0.387</td></td><td style="background: #fffdfd">0.091</td></td><td style="background: #ffffff">0.002</td></td></tr><tr><td style="background: yellow"><b>PHP 5.2</b></td><td style="background: #ff7f7f">5.553</td></td><td style="background: #ffc5c5">2.552</td></td><td style="background: #ffc1c1">2.725</td></td><td style="background: #fff5f5">0.437</td></td><td style="background: #fff4f4">0.499</td></td><td style="background: #fffefe">0.085</td></td><td style="background: #ffffff">0.003</td></td></tr><tr><td style="background: yellow"><b>PHP 5.3</b></td><td style="background: #ff8d8d">4.944</td></td><td style="background: #ffc3c3">2.600</td></td><td style="background: #ffbfbf">2.797</td></td><td style="background: #fff6f6">0.421</td></td><td style="background: #fff6f6">0.412</td></td><td style="background: #fffefe">0.080</td></td><td style="background: #ffffff">0.002</td></td></tr><tr><td style="background: yellow"><b>PHP 5.4</b></td><td style="background: #ffc6c6">2.491</td></td><td style="background: #ffe1e1">1.337</td></td><td style="background: #ffbebe">2.840</td></td><td style="background: #fff9f9">0.297</td></td><td style="background: #fffafa">0.255</td></td><td style="background: #fffdfd">0.098</td></td><td style="background: #ffffff">0.002</td></td></tr><tr><td style="background: yellow"><b>PHP 5.5</b></td><td style="background: #ffc8c8">2.383</td></td><td style="background: #ffdbdb">1.574</td></td><td style="background: #ffbfbf">2.811</td></td><td style="background: #fff9f9">0.294</td></td><td style="background: #fff9f9">0.294</td></td><td style="background: #fffdfd">0.101</td></td><td style="background: #ffffff">0.002</td></td></tr><tr><td style="background: yellow"><b>PHP 5.6</b></td><td style="background: #ffcbcb">2.252</td></td><td style="background: #ffe1e1">1.330</td></td><td style="background: #ffbbbb">2.946</td></td><td style="background: #fff9f9">0.302</td></td><td style="background: #fffafa">0.233</td></td><td style="background: #fffefe">0.086</td></td><td style="background: #ffffff">0.002</td></td></tr><tr><td style="background: yellow"><b>PHP 7.1</b></td><td style="background: #ffeeee">0.743</td></td><td style="background: #fff3f3">0.530</td></td><td style="background: #ffb2b2">3.360</td></td><td style="background: #fffdfd">0.088</td></td><td style="background: #fffefe">0.073</td></td><td style="background: #fffefe">0.076</td></td><td style="background: #ffffff">0.002</td></td></tr><tr><td style="background: yellow"><b>PHP 7.2</b></td><td style="background: #ffecec">0.847</td></td><td style="background: #fff5f5">0.458</td></td><td style="background: #ffbfbf">2.787</td></td><td style="background: #fffdfd">0.098</td></td><td style="background: #fffefe">0.070</td></td><td style="background: #fffefe">0.083</td></td><td style="background: #ffffff">0.002</td></td></tr><tr><td style="background: yellow"><b>PHP 7.3</b></td><td style="background: #ffe8e8">1.015</td></td><td style="background: #fff3f3">0.559</td></td><td style="background: #ffb8b8">3.109</td></td><td style="background: #fffefe">0.077</td></td><td style="background: #fffefe">0.063</td></td><td style="background: #fffdfd">0.090</td></td><td style="background: #ffffff">0.002</td></td></tr><tr><td style="background: yellow"><b>PHP 7.4</b></td><td style="background: #ffecec">0.862</td></td><td style="background: #fff6f6">0.401</td></td><td style="background: #ffb5b5">3.204</td></td><td style="background: #fffefe">0.069</td></td><td style="background: #fffefe">0.067</td></td><td style="background: #fffefe">0.077</td></td><td style="background: #ffffff">0.002</td></td></tr><tr><td style="background: yellow"><b>PHP 8.0</b></td><td style="background: #ffefef">0.732</td></td><td style="background: #fff4f4">0.498</td></td><td style="background: #ffc3c3">2.639</td></td><td style="background: #fffefe">0.068</td></td><td style="background: #fffefe">0.068</td></td><td style="background: #fffefe">0.073</td></td><td style="background: #ffffff">0.002</td></td></tr><tr><td style="background: yellow"><b>PHP 8.1</b></td><td style="background: #fff1f1">0.614</td></td><td style="background: #fff6f6">0.393</td></td><td style="background: #ffc3c3">2.606</td></td><td style="background: #fffdfd">0.088</td></td><td style="background: #fffefe">0.069</td></td><td style="background: #fffdfd">0.088</td></td><td style="background: #ffffff">0.002</td></td></tr><tr><td style="background: yellow"><b>PHP 8.2</b></td><td style="background: #ffeaea">0.922</td></td><td style="background: #fff6f6">0.408</td></td><td style="background: #ffc3c3">2.608</td></td><td style="background: #fffefe">0.084</td></td><td style="background: #fffefe">0.060</td></td><td style="background: #fffefe">0.076</td></td><td style="background: #ffffff">0.002</td></td></tr></tbody></table>

## Benchmarks with JIT

PHP 8 [introduced](https://wiki.php.net/rfc/jit) a new [Just-In-Time (JIT) compilation](https://en.wikipedia.org/wiki/Just-in-time_compilation) engine. The specific JIT settings that were used can be seen in the Docker containers [opcache.ini](https://github.com/phpseclib/docker-php/blob/8.0jit/opcache.ini).

<table border="1">
  <thead>
    <tr><td style="border: 0; background: white"></td><td>PHP32</td><td>PHP64</td><td>BCMath</td><td>PHP32</td><td>PHP64</td><td>BCMath</td><td>GMP</td></tr>
    <tr><td style="border: 0; background: white"></td><td colspan="3" style="background: wheat; font-weight: normal; text-align: center">w/o OpenSSL</td><td colspan="3" style="background: wheat; font-weight: normal; text-align: center">w/ OpenSSL</td><td style="border: 0; background: white"></td></tr>
  </thead>
  <tbody>
<tr><td style="background: yellow"><b>PHP 8.0</b></td><td style="background: #fff7f7">0.375</td></td><td style="background: #fffcfc">0.131</td></td><td style="background: #ffb6b6">3.184</td></td><td style="background: #ffffff">0.042</td></td><td style="background: #fffefe">0.053</td></td><td style="background: #fffefe">0.073</td></td><td style="background: #ffffff">0.003</td></td></tr><tr><td style="background: yellow"><b>PHP 8.1</b></td><td style="background: #fff7f7">0.355</td></td><td style="background: #fffdfd">0.122</td></td><td style="background: #ffc3c3">2.608</td></td><td style="background: #ffffff">0.041</td></td><td style="background: #fffefe">0.045</td></td><td style="background: #fffefe">0.084</td></td><td style="background: #ffffff">0.002</td></td></tr><tr><td style="background: yellow"><b>PHP 8.2</b></td><td style="background: #fff8f8">0.333</td></td><td style="background: #fffcfc">0.151</td></td><td style="background: #ffb7b7">3.133</td></td><td style="background: #fffefe">0.052</td></td><td style="background: #fffefe">0.046</td></td><td style="background: #fffefe">0.075</td></td><td style="background: #ffffff">0.003</td></td></tr></tbody></table>

## GMP Engine

[GMP](http://en.wikipedia.org/wiki/GNU_Multiple_Precision_Arithmetic_Library), to quote wikipedia, "_aims to be faster than any other bignum library_", using "_highly optimized assembly language code_".

## PHP32 / PHP64

These days, most systems are 64-bit, however, a notable exception are [Raspberry Pi](https://en.wikipedia.org/wiki/Raspberry_Pi_OS)'s.

On 32-bit systems phpseclib uses base-2**26 to reduce the number of digits of each number. When two 26-bit numbers are multiplied together the result is a 64-bit floating point (of which only 48 bits are used), which is then converted back to two 32-bit signed integers (of which only 26 bits are used).

On 64-bit systems phpseclib uses base-2**31 to reduce the number of digits of each number. When two 31-bit numbers are multiplied together the result is a 64-bit signed integer (of which only 62 bits are used), which is then converted back to two 32-bit signed integers (of which only 31 bits are used).

## OpenSSL Enhancements

Only used for powMod(). Converts the exponent and the modulo to an appropriately formatted RSA public key and performs unpadded RSA encryption with that.