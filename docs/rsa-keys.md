---
id: rsa-keys
title: Sample RSA Keys
---

All keys are the same 512-bit key encoded differently. Encrypted keys use `demo` as the key.

See [RSA: Supported Formats](rsa.md#supported-formats) for a more in depth discussion of the various formats (the features they support, the standards to which they conform, etc).

## PKCS1

### Private Keys

Generated with `$key->toString('PKCS1')`.

```
-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf9Cnzj4p4WGeKLs1Pt8Qu
KUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQJAIJLixBy2qpFoS4DSmoEm
o3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2k
TQIhAKMSvzIBnni7ot/OSie2TmJLY4SwTQAevXysE2RbFDYdAiEBCUEaRQnMnbp7
9mxDXDf6AU0cN/RPBjb9qSHDcWZHGzUCIG2Es59z8ugGrDY+pxLQnwfotadxd+Uy
v/Ow5T0q5gIJAiEAyS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3okCIBOs
/5OiPgoTdSy7bcF9IGpSE8ZgGKzgYQVZeN97YE00
-----END RSA PRIVATE KEY-----
```

### Encrypted Private Keys

Generated with `$key->withPassword('demo')->toString('PKCS1')`.

```
-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-128-CBC,5C724CE55C702828F3F74B555F594366

odKAmV6AbsoWsyL3thUoYVDEJAsQl8RrH+JuQ9HWUnDLunDdLEM6oNl15XP1xLOH
z3bEq1rvATiQmAByKNOiVujd1gsq7JxfQYDdHRzDhZZrUstnetvGTDBtMHmhzbBX
Oih+1q3eA2RMQ5izXOEkyMKrWWlcKMWVJzMSYjFeFJB8D8wJNmq1ArNCO3uXfwkZ
uMnMhYhx/OYvCs4sMWKe5/etyR2gz0Fvp6VDUa0jNRvoad+8/pHK7KDxB8nW5Kgm
pSjfkl1Ut3zChtwEuAFnSDuypbrODBdphZHD40WmX0f69VKKs44vsKCHr8nzJ8R5
dw+2Ggyq5W5hl3PDTMTqn8Pc+cwmPdVe4bkNqxbCHe2omZXpNIgC31wrMBvkyUYv
pY8rMoBXqgm9hC5JsXzn6Z6X1kpGFhDjkNSdzx4jYzw=
-----END RSA PRIVATE KEY-----
```

### Public Keys

Generated with `$key->toString('PKCS1')`.

```
-----BEGIN RSA PUBLIC KEY-----
MEgCQQCo9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp84+KeFhnii7NT7fELilKUSnx
S30WAvQCCo2yU1orfgqr41mM70MBAgMBAAE=
-----END RSA PUBLIC KEY-----
```

## PKCS8

### Private Keys

Generated with `$key->toString('PKCS8')`.

```
-----BEGIN PRIVATE KEY-----
MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAqPfgaTEWEP3S9w0t
gsicURfo+nLW09/0KfOPinhYZ4ouzU+3xC4pSlEp8Ut9FgL0AgqNslNaK34Kq+NZ
jO9DAQIDAQABAkAgkuLEHLaqkWhLgNKagSajeobLS3rPT0Agm0f7k55FXVt743hw
Ngkp98bMNrzy9AQ1mJGbQZGrpr4c8ZAx3aRNAiEAoxK/MgGeeLui385KJ7ZOYktj
hLBNAB69fKwTZFsUNh0CIQEJQRpFCcydunv2bENcN/oBTRw39E8GNv2pIcNxZkcb
NQIgbYSzn3Py6AasNj6nEtCfB+i1p3F35TK/87DlPSrmAgkCIQDJLhFoj1gbwRbH
/bDRPrtlRUDDx44wHoEhSDRdy77eiQIgE6z/k6I+ChN1LLttwX0galITxmAYrOBh
BVl433tgTTQ=
-----END PRIVATE KEY-----
```

### Encrypted Private Keys

Generated with `$key->withPassword('demo')->toString('PKCS8')`.

```
-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIBvTBXBgkqhkiG9w0BBQ0wSjApBgkqhkiG9w0BBQwwHAQIpZHwLtkYRb4CAggA
MAwGCCqGSIb3DQIJBQAwHQYJYIZIAWUDBAECBBCCGsoP7F4bd8O5I1poTn8PBIIB
YBtM1tgqsAQgbSZT0475aHufzFuJuPWOYqiHag8OUKMeZuxVHndElipEY2V5lS9m
wddwtWaGuYD/Swcdt0Xht8U8BF0SjSyzQ4YtRsG9CmEHYhWmQ5AqK1W3mDUApO38
Cm5L1HrHV4YJnYmmK9jgq+iWlLFDmB8s4TA6kMPWbCENlpr1kEXz4hLwY3ylH8XW
I65WX2jGSn61jayCwpf1HPFBPDUaS5s3f92aKjk0AE8htsDBBiCVS3Yjq4QSbhfz
uNIZ1TooXT9Xn+EJC0yjVnlTHZMfqrcA3OmVSi4kftugjAax4Z2qDqO+onkgeJAw
P75scMcwH0SQUdrNrejgfIzJFWzcH9xWwKhOT9s9hLx2OfPlMtDDSJVRspqwwQrF
QwinX0cR9Hx84rSMrFndxZi52o9EOLJ7cithncoW1KOAf7lIJIUzP0oIKkskAndQ
o2UiZsxgoMYuq02T07DOknc=
-----END ENCRYPTED PRIVATE KEY-----
```

### Public Keys

Generated with `$key->getPublicKey()->toString('PKCS8')`.

```
-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKj34GkxFhD90vcNLYLInFEX6Ppy1tPf
9Cnzj4p4WGeKLs1Pt8QuKUpRKfFLfRYC9AIKjbJTWit+CqvjWYzvQwECAwEAAQ==
-----END PUBLIC KEY-----
```

## PuTTY

### Private Keys

Generated with `$key->toString('PuTTY')`.

```
PuTTY-User-Key-File-2: ssh-rsa
Encryption: none
Comment: phpseclib-generated-key
Public-Lines: 2
AAAAB3NzaC1yc2EAAAADAQABAAAAQQCo9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp
84+KeFhnii7NT7fELilKUSnxS30WAvQCCo2yU1orfgqr41mM70MB
Private-Lines: 4
AAAAQCCS4sQctqqRaEuA0pqBJqN6hstLes9PQCCbR/uTnkVdW3vjeHA2CSn3xsw2
vPL0BDWYkZtBkaumvhzxkDHdpE0AAAAhAKMSvzIBnni7ot/OSie2TmJLY4SwTQAe
vXysE2RbFDYdAAAAIQEJQRpFCcydunv2bENcN/oBTRw39E8GNv2pIcNxZkcbNQAA
ACATrP+Toj4KE3Usu23BfSBqUhPGYBis4GEFWXjfe2BNNA==
Private-MAC: bc712a70870b4b8ddf120530f02b9068e782a21a
```

### Encrypted Private Keys

Generated with `$key->withPassword('demo')->toString('PuTTY')`.

```
PuTTY-User-Key-File-2: ssh-rsa
Encryption: aes256-cbc
Comment: phpseclib-generated-key
Public-Lines: 2
AAAAB3NzaC1yc2EAAAADAQABAAAAQQCo9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp
84+KeFhnii7NT7fELilKUSnxS30WAvQCCo2yU1orfgqr41mM70MB
Private-Lines: 4
vdqfIladR4JIsN6wmmfJ9rt+PzuY+sZVP/vbsiOODeU24BYGj5arK/qjC2Bsr8vU
h/bkkK9AVqzd5sPaMzQ3HPya+ogEDoTKTr3SKg+twjItQb7q2gHwIvebPw67i8HN
hL+DmVZ2cJ1BXDHt79wJMQApmMlpRhJs0QziWhu1nTfnb8dPcC4B1RKCLPvtv+Iw
AjomU6mTfZs3ZVrxkH8e50q7cbkxQinQ9Su/9jYvtjIjMT6C0jgRUQUrQIHGFKGX
Private-MAC: 9b86c10fa3325ed53cee0d283a3f71791355acd1
```

### Public Keys

Generated with `$key->getPublicKey()->toString('PuTTY')`.

```
---- BEGIN SSH2 PUBLIC KEY ----
Comment: "phpseclib-generated-key"
AAAAB3NzaC1yc2EAAAADAQABAAAAQQCo9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp
84+KeFhnii7NT7fELilKUSnxS30WAvQCCo2yU1orfgqr41mM70MB
---- END SSH2 PUBLIC KEY ----
```

## OpenSSH

### Private Keys

Generated with `$key->toString('OpenSSH')`.

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAVwAAAAdzc2gtcn
NhAAAAAwEAAQAAAEEAqPfgaTEWEP3S9w0tgsicURfo+nLW09/0KfOPinhYZ4ouzU+3xC4p
SlEp8Ut9FgL0AgqNslNaK34Kq+NZjO9DAQAAATB+9/CSfvfwkgAAAAdzc2gtcnNhAAAAQQ
Co9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp84+KeFhnii7NT7fELilKUSnxS30WAvQCCo2y
U1orfgqr41mM70MBAAAAAwEAAQAAAEAgkuLEHLaqkWhLgNKagSajeobLS3rPT0Agm0f7k5
5FXVt743hwNgkp98bMNrzy9AQ1mJGbQZGrpr4c8ZAx3aRNAAAAIBOs/5OiPgoTdSy7bcF9
IGpSE8ZgGKzgYQVZeN97YE00AAAAIQCjEr8yAZ54u6Lfzkontk5iS2OEsE0AHr18rBNkWx
Q2HQAAACEBCUEaRQnMnbp79mxDXDf6AU0cN/RPBjb9qSHDcWZHGzUAAAAXcGhwc2VjbGli
LWdlbmVyYXRlZC1rZXkBAgME
-----END OPENSSH PRIVATE KEY-----
```

### Public Keys

Generated with `$key->getPublicKey()->toString('OpenSSH')`.

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAAQQCo9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp84+KeFhnii7NT7fELilKUSnxS30WAvQCCo2yU1orfgqr41mM70MB phpseclib-generated-key
```

## XML

### Private Keys

Generated with `$key->toString('XML')`.

```
<RSAKeyPair>
  <Modulus>qPfgaTEWEP3S9w0tgsicURfo+nLW09/0KfOPinhYZ4ouzU+3xC4pSlEp8Ut9FgL0AgqNslNaK34Kq+NZjO9DAQ==</Modulus>
  <Exponent>AQAB</Exponent>
  <P>oxK/MgGeeLui385KJ7ZOYktjhLBNAB69fKwTZFsUNh0=</P>
  <Q>AQlBGkUJzJ26e/ZsQ1w3+gFNHDf0TwY2/akhw3FmRxs1</Q>
  <DP>bYSzn3Py6AasNj6nEtCfB+i1p3F35TK/87DlPSrmAgk=</DP>
  <DQ>yS4RaI9YG8EWx/2w0T67ZUVAw8eOMB6BIUg0Xcu+3ok=</DQ>
  <InverseQ>E6z/k6I+ChN1LLttwX0galITxmAYrOBhBVl433tgTTQ=</InverseQ>
  <D>IJLixBy2qpFoS4DSmoEmo3qGy0t6z09AIJtH+5OeRV1be+N4cDYJKffGzDa88vQENZiRm0GRq6a+HPGQMd2kTQ==</D>
</RSAKeyPair>
```

### Public Keys

Generated with `$key->getPublicKey()->toString('XML')`.

```
<RSAKeyValue>
  <Modulus>qPfgaTEWEP3S9w0tgsicURfo+nLW09/0KfOPinhYZ4ouzU+3xC4pSlEp8Ut9FgL0AgqNslNaK34Kq+NZjO9DAQ==</Modulus>
  <Exponent>AQAB</Exponent>
</RSAKeyValue>
```

## MSBLOB

### Private Keys

Generated with `$key->toString('MSBLOB')`.

```
BwIAAACkAABSU0EyAAIAAAEAAQABQ++MWeOrCn4rWlOyjQoC9AIWfUvxKVFKKS7Et0/NLopnWHiKj/Mp9N/T1nL66BdRnMiCLQ330v0QFjFp4PeoHTYUW2QTrHy9HgBNsIRjS2JOtidKzt+iu3ieATK/EqM1G0dmccMhqf02Bk/0NxxNAfo3XENs9nu6ncwJRRpBCQEJAuYqPeWw878y5Xdxp7XoB5/QEqc+NqwG6PJzn7OEbYnevstdNEghgR4wjsfDQEVluz7RsP3HFsEbWI9oES7JNE1ge994WQVh4KwYYMYTUmogfcFtuyx1Ewo+opP/rBNNpN0xkPEcvqarkUGbkZg1BPTyvDbMxvcpCTZweON7W11FnpP7R5sgQE/PekvLhnqjJoGa0oBLaJGqthzE4pIg
```

### Public Keys

Generated with `$key->getPublicKey()->toString('MSBLOB')`.

```
BgIAAACkAABSU0ExAAIAAAEAAQABQ++MWeOrCn4rWlOyjQoC9AIWfUvxKVFKKS7Et0/NLopnWHiKj/Mp9N/T1nL66BdRnMiCLQ330v0QFjFp4Peo
```