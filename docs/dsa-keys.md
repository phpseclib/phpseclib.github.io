---
id: dsa-keys
title: Supported DSA Key Formats
---

All keys are the same key (L = 1024, N = 160) encoded differently. Encrypted keys use `demo` as the key.

See [DSA: Supported Formats](dsa.md#supported-formats) for a more in depth discussion of the various formats (the features they support, the standards to which they conform, etc).

## PKCS1

### Private Keys

Generated with `$key->toString('PKCS1')`.

```
-----BEGIN DSA PRIVATE KEY-----
MIIBugIBAAKBgQC2grUl+ofVa7A7tB8QICqyJudylXoQ76QM+VtymvnYGtejrV6i
2uQWBe94Za9zVkz1kz66XjY4lQdBQ3RqpT0KOnIPCiBZ2sccl1MKbVqcg0p6rnAG
wyzGyRJP5jw3jekcgeXzzfXmvflZSPjBfhJub6NPqsfJaCPOJo5AecLPQQIVAKXZ
jsqxQPFbLWJc7ciyfS84Ag0lAoGAW6qWBeZevOHylvBQTOJ5ZZMOYiLL8dQx2Aho
Tn3fIkFL2qu6SplL43V8CJjyN42c7TeaR+ZRP+XG9fuV2iLan5L8zZ80Xg8ef2wL
g61ZyZmEh1XVX2nI7IVhQVzimX7xd9KmOcva3GrtkA86BGMlO6J7xNHNoA4QhtGn
oTAWqS8CgYAPXpTPP6NcFmoh921gw82rCRSYRemERu+OlVnDLliyQiooHn4AjtNl
B8cWugJL8sfq5ZVg2lO6RDZ9vnarySUsUWdr5aUGpUkFXhCELVyVh+62M8pSkrqz
zKIvIMYPWHhzCFkSwQHndR8chZ3alWbLYT96ZU9CgFbT+phAuF3IxQIUZ8KYNKuQ
Dx9ZfV4yGp1ff29LbLI=
-----END DSA PRIVATE KEY-----
```

### Encrypted Private Keys

Generated with `$key->withPassword('demo')->toString('PKCS1')`.

```
-----BEGIN DSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-128-CBC,69D3925F4D3872CC5BD020F2F445CF4D

5d8zihmrqPfGNyZ38nmWRorF5w3mk5o+V1v2W52QR6aA9M0V4tJv4Xq9G0Yal+nu
/HWwTWEjsKkL1vF8v/WTCViOQKaG6NLaq0dS5pbpi2E1tGHWU3kD52thqhDB+wcX
+YpGEFxfYexYmFT2uVvX0i0cr143VI131n3x22c7fXR2hTaOmAvIgN7Cwm+7bODD
qLI/FieUQAFT6vAJBbI5r4ea9o0xOUX4oHsRf+saZtdTo621byQ4ASKFCrN+hHVo
ZRHswu9JP2NRaUUuKDYOqqu0ywYiWTv3YNm3khQ7XqBMx6XPAqmWyrbW6vOYS7LY
6qUzYmqnEDXPKglYKVA56l25vFEmEM4ydgtG9/9UiOiJy2Dxubp83LGKsshyZG/R
v7jEuSn4CsnUSbbREkSNeyX/hGEB2q0qy0w4dAsDoR6uI3dQGvPt2psf8LTDGoXo
MNEDHtL5CPaI6vmw9SLgOBoyTgD4l/WOhhWXO45AhcZIKE0msnBNIKAg6Nply4nQ
bpepPSxAQt7b4J88dajyyHjiw+MLJq1klfbwaGHBernqi0HvoakrPEMTSjpEnbQN
FHYsS0o4gj/cpnyrxQ6fQw==
-----END DSA PRIVATE KEY-----
```

### Public Keys

Generated with `$key->toString('PKCS1')`.

```
-----BEGIN DSA PUBLIC KEY-----
AoGAD16Uzz+jXBZqIfdtYMPNqwkUmEXphEbvjpVZwy5YskIqKB5+AI7TZQfHFroC
S/LH6uWVYNpTukQ2fb52q8klLFFna+WlBqVJBV4QhC1clYfutjPKUpK6s8yiLyDG
D1h4cwhZEsEB53UfHIWd2pVmy2E/emVPQoBW0/qYQLhdyMU=
-----END DSA PUBLIC KEY-----
```

### Parameters

Generated with `$key->getParameters()->toString('PKCS1')`.

```
-----BEGIN DSA PARAMETERS-----
MIIBHgKBgQC2grUl+ofVa7A7tB8QICqyJudylXoQ76QM+VtymvnYGtejrV6i2uQW
Be94Za9zVkz1kz66XjY4lQdBQ3RqpT0KOnIPCiBZ2sccl1MKbVqcg0p6rnAGwyzG
yRJP5jw3jekcgeXzzfXmvflZSPjBfhJub6NPqsfJaCPOJo5AecLPQQIVAKXZjsqx
QPFbLWJc7ciyfS84Ag0lAoGAW6qWBeZevOHylvBQTOJ5ZZMOYiLL8dQx2AhoTn3f
IkFL2qu6SplL43V8CJjyN42c7TeaR+ZRP+XG9fuV2iLan5L8zZ80Xg8ef2wLg61Z
yZmEh1XVX2nI7IVhQVzimX7xd9KmOcva3GrtkA86BGMlO6J7xNHNoA4QhtGnoTAW
qS8=
-----END DSA PARAMETERS-----
```

## PKCS8

### Private Keys

Generated with `$key->toString('PKCS8')`.

```
-----BEGIN PRIVATE KEY-----
MIIBSgIBADCCASsGByqGSM44BAEwggEeAoGBALaCtSX6h9VrsDu0HxAgKrIm53KV
ehDvpAz5W3Ka+dga16OtXqLa5BYF73hlr3NWTPWTPrpeNjiVB0FDdGqlPQo6cg8K
IFnaxxyXUwptWpyDSnqucAbDLMbJEk/mPDeN6RyB5fPN9ea9+VlI+MF+Em5vo0+q
x8loI84mjkB5ws9BAhUApdmOyrFA8VstYlztyLJ9LzgCDSUCgYBbqpYF5l684fKW
8FBM4nllkw5iIsvx1DHYCGhOfd8iQUvaq7pKmUvjdXwImPI3jZztN5pH5lE/5cb1
+5XaItqfkvzNnzReDx5/bAuDrVnJmYSHVdVfacjshWFBXOKZfvF30qY5y9rcau2Q
DzoEYyU7onvE0c2gDhCG0aehMBapLwQWAhRnwpg0q5APH1l9XjIanV9/b0tssg==
-----END PRIVATE KEY-----
```

### Encrypted Private Keys

Generated with `$key->withPassword('demo')->toString('PKCS8')`.

```
-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIBrTBXBgkqhkiG9w0BBQ0wSjApBgkqhkiG9w0BBQwwHAQI//olJhiwDeMCAggA
MAwGCCqGSIb3DQIJBQAwHQYJYIZIAWUDBAECBBB5gyQl0ySwR+Dqb6ZrcHpiBIIB
UJvuFY+LZUsAPXbfyHp+PNDA1Zuo0HS30DzsEfCRn6Iv/3ZiWxvImmOZlJoCSTQ/
vsEX1dLhC9hseAVGrqQHCs2Bm3hlRHI59ZSZz5VuKXi2ivPM5vm2UQzy/4GACsKj
eoSZmEL38nxuAf0sZ/rWE/qCJ9M3cE2lRUKlB9IXQLD3f4MqCHGgjPHdx2LdoCOU
R0gzbsWdh2zAWcpsTw1cWNFrKWxSq1X3an1IkZjKmdDPRb1iEt/l888+gIpIXv0D
k49qhINXykrn7E9zor/3yVaqQeUFVcKasYgCLAHGo70N40AdQSq5lY47cYA72mJZ
5OL1lXCzT4VDdWGiAGDUhB2eWFvQFRwQyvKud8pcejejmGHc/cV2ymPgnAfMTqgy
JdTptwwLWyI72BKxerW+A12tLndz2pIGLjdySznV0OLzYxiAMyJKZqtntWq8upB6
Mw==
-----END ENCRYPTED PRIVATE KEY-----
```

### Public Keys

Generated with `$key->getPublicKey()->toString('PKCS8')`.

```
-----BEGIN PUBLIC KEY-----
MIIBtjCCASsGByqGSM44BAEwggEeAoGBALaCtSX6h9VrsDu0HxAgKrIm53KVehDv
pAz5W3Ka+dga16OtXqLa5BYF73hlr3NWTPWTPrpeNjiVB0FDdGqlPQo6cg8KIFna
xxyXUwptWpyDSnqucAbDLMbJEk/mPDeN6RyB5fPN9ea9+VlI+MF+Em5vo0+qx8lo
I84mjkB5ws9BAhUApdmOyrFA8VstYlztyLJ9LzgCDSUCgYBbqpYF5l684fKW8FBM
4nllkw5iIsvx1DHYCGhOfd8iQUvaq7pKmUvjdXwImPI3jZztN5pH5lE/5cb1+5Xa
ItqfkvzNnzReDx5/bAuDrVnJmYSHVdVfacjshWFBXOKZfvF30qY5y9rcau2QDzoE
YyU7onvE0c2gDhCG0aehMBapLwOBhAACgYAPXpTPP6NcFmoh921gw82rCRSYRemE
Ru+OlVnDLliyQiooHn4AjtNlB8cWugJL8sfq5ZVg2lO6RDZ9vnarySUsUWdr5aUG
pUkFXhCELVyVh+62M8pSkrqzzKIvIMYPWHhzCFkSwQHndR8chZ3alWbLYT96ZU9C
gFbT+phAuF3IxQ==
-----END PUBLIC KEY-----
```

## PuTTY

### Private Keys

Generated with `$key->toString('PuTTY')`.

```
PuTTY-User-Key-File-2: ssh-dsa
Encryption: none
Comment: phpseclib-generated-key
Public-Lines: 10
AAAAB3NzaC1kc2EAAACBALaCtSX6h9VrsDu0HxAgKrIm53KVehDvpAz5W3Ka+dga
16OtXqLa5BYF73hlr3NWTPWTPrpeNjiVB0FDdGqlPQo6cg8KIFnaxxyXUwptWpyD
SnqucAbDLMbJEk/mPDeN6RyB5fPN9ea9+VlI+MF+Em5vo0+qx8loI84mjkB5ws9B
AAAAFQCl2Y7KsUDxWy1iXO3Isn0vOAINJQAAAIBbqpYF5l684fKW8FBM4nllkw5i
Isvx1DHYCGhOfd8iQUvaq7pKmUvjdXwImPI3jZztN5pH5lE/5cb1+5XaItqfkvzN
nzReDx5/bAuDrVnJmYSHVdVfacjshWFBXOKZfvF30qY5y9rcau2QDzoEYyU7onvE
0c2gDhCG0aehMBapLwAAAIAPXpTPP6NcFmoh921gw82rCRSYRemERu+OlVnDLliy
QiooHn4AjtNlB8cWugJL8sfq5ZVg2lO6RDZ9vnarySUsUWdr5aUGpUkFXhCELVyV
h+62M8pSkrqzzKIvIMYPWHhzCFkSwQHndR8chZ3alWbLYT96ZU9CgFbT+phAuF3I
xQ==
Private-Lines: 1
AAAAFGfCmDSrkA8fWX1eMhqdX39vS2yy
Private-MAC: abcb1fb56660533720513989adfbb4294f229669
```

### Encrypted Private Keys

Generated with `$key->withPassword('demo')->toString('PuTTY')`.

```
PuTTY-User-Key-File-2: ssh-dsa
Encryption: aes256-cbc
Comment: phpseclib-generated-key
Public-Lines: 10
AAAAB3NzaC1kc2EAAACBALaCtSX6h9VrsDu0HxAgKrIm53KVehDvpAz5W3Ka+dga
16OtXqLa5BYF73hlr3NWTPWTPrpeNjiVB0FDdGqlPQo6cg8KIFnaxxyXUwptWpyD
SnqucAbDLMbJEk/mPDeN6RyB5fPN9ea9+VlI+MF+Em5vo0+qx8loI84mjkB5ws9B
AAAAFQCl2Y7KsUDxWy1iXO3Isn0vOAINJQAAAIBbqpYF5l684fKW8FBM4nllkw5i
Isvx1DHYCGhOfd8iQUvaq7pKmUvjdXwImPI3jZztN5pH5lE/5cb1+5XaItqfkvzN
nzReDx5/bAuDrVnJmYSHVdVfacjshWFBXOKZfvF30qY5y9rcau2QDzoEYyU7onvE
0c2gDhCG0aehMBapLwAAAIAPXpTPP6NcFmoh921gw82rCRSYRemERu+OlVnDLliy
QiooHn4AjtNlB8cWugJL8sfq5ZVg2lO6RDZ9vnarySUsUWdr5aUGpUkFXhCELVyV
h+62M8pSkrqzzKIvIMYPWHhzCFkSwQHndR8chZ3alWbLYT96ZU9CgFbT+phAuF3I
xQ==
Private-Lines: 1
52W00EMyrrQh9h+hZwMwbaR775Odci/67MHmqX0pijU=
Private-MAC: f69109be25dffac3a35f2021a218138d7e0721ee
```

### Public Keys

Generated with `$key->getPublicKey()->toString('PuTTY')`.

```
---- BEGIN SSH2 PUBLIC KEY ----
Comment: "phpseclib-generated-key"
AAAAB3NzaC1kc2EAAACBALaCtSX6h9VrsDu0HxAgKrIm53KVehDvpAz5W3Ka+dga
16OtXqLa5BYF73hlr3NWTPWTPrpeNjiVB0FDdGqlPQo6cg8KIFnaxxyXUwptWpyD
SnqucAbDLMbJEk/mPDeN6RyB5fPN9ea9+VlI+MF+Em5vo0+qx8loI84mjkB5ws9B
AAAAFQCl2Y7KsUDxWy1iXO3Isn0vOAINJQAAAIBbqpYF5l684fKW8FBM4nllkw5i
Isvx1DHYCGhOfd8iQUvaq7pKmUvjdXwImPI3jZztN5pH5lE/5cb1+5XaItqfkvzN
nzReDx5/bAuDrVnJmYSHVdVfacjshWFBXOKZfvF30qY5y9rcau2QDzoEYyU7onvE
0c2gDhCG0aehMBapLwAAAIAPXpTPP6NcFmoh921gw82rCRSYRemERu+OlVnDLliy
QiooHn4AjtNlB8cWugJL8sfq5ZVg2lO6RDZ9vnarySUsUWdr5aUGpUkFXhCELVyV
h+62M8pSkrqzzKIvIMYPWHhzCFkSwQHndR8chZ3alWbLYT96ZU9CgFbT+phAuF3I
xQ==
---- END SSH2 PUBLIC KEY ----
```

## OpenSSH

### Private Keys

Generated with `$key->toString('OpenSSH')`.

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABsQAAAAdzc2gtZH
NzAAAAgQC2grUl+ofVa7A7tB8QICqyJudylXoQ76QM+VtymvnYGtejrV6i2uQWBe94Za9z
Vkz1kz66XjY4lQdBQ3RqpT0KOnIPCiBZ2sccl1MKbVqcg0p6rnAGwyzGyRJP5jw3jekcge
XzzfXmvflZSPjBfhJub6NPqsfJaCPOJo5AecLPQQAAABUApdmOyrFA8VstYlztyLJ9LzgC
DSUAAACAW6qWBeZevOHylvBQTOJ5ZZMOYiLL8dQx2AhoTn3fIkFL2qu6SplL43V8CJjyN4
2c7TeaR+ZRP+XG9fuV2iLan5L8zZ80Xg8ef2wLg61ZyZmEh1XVX2nI7IVhQVzimX7xd9Km
Ocva3GrtkA86BGMlO6J7xNHNoA4QhtGnoTAWqS8AAACAD16Uzz+jXBZqIfdtYMPNqwkUmE
XphEbvjpVZwy5YskIqKB5+AI7TZQfHFroCS/LH6uWVYNpTukQ2fb52q8klLFFna+WlBqVJ
BV4QhC1clYfutjPKUpK6s8yiLyDGD1h4cwhZEsEB53UfHIWd2pVmy2E/emVPQoBW0/qYQL
hdyMUAAAHwFflvwxX5b8MAAAAHc3NoLWRzcwAAAIEAtoK1JfqH1WuwO7QfECAqsibncpV6
EO+kDPlbcpr52BrXo61eotrkFgXveGWvc1ZM9ZM+ul42OJUHQUN0aqU9CjpyDwogWdrHHJ
dTCm1anINKeq5wBsMsxskST+Y8N43pHIHl88315r35WUj4wX4Sbm+jT6rHyWgjziaOQHnC
z0EAAAAVAKXZjsqxQPFbLWJc7ciyfS84Ag0lAAAAgFuqlgXmXrzh8pbwUEzieWWTDmIiy/
HUMdgIaE593yJBS9qrukqZS+N1fAiY8jeNnO03mkfmUT/lxvX7ldoi2p+S/M2fNF4PHn9s
C4OtWcmZhIdV1V9pyOyFYUFc4pl+8XfSpjnL2txq7ZAPOgRjJTuie8TRzaAOEIbRp6EwFq
kvAAAAgA9elM8/o1wWaiH3bWDDzasJFJhF6YRG746VWcMuWLJCKigefgCO02UHxxa6Akvy
x+rllWDaU7pENn2+dqvJJSxRZ2vlpQalSQVeEIQtXJWH7rYzylKSurPMoi8gxg9YeHMIWR
LBAed1HxyFndqVZsthP3plT0KAVtP6mEC4XcjFAAAAFGfCmDSrkA8fWX1eMhqdX39vS2yy
AAAAF3BocHNlY2xpYi1nZW5lcmF0ZWQta2V5AQIDBA==
-----END OPENSSH PRIVATE KEY-----
```

### Encrypted Private Keys

Generated with `$key->withPassword('demo')->toString('OpenSSH')`.

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABA58VgpxG
cZAZp3LwzzPZPmAAAAEAAAAAEAAAGxAAAAB3NzaC1kc3MAAACBALaCtSX6h9VrsDu0HxAg
KrIm53KVehDvpAz5W3Ka+dga16OtXqLa5BYF73hlr3NWTPWTPrpeNjiVB0FDdGqlPQo6cg
8KIFnaxxyXUwptWpyDSnqucAbDLMbJEk/mPDeN6RyB5fPN9ea9+VlI+MF+Em5vo0+qx8lo
I84mjkB5ws9BAAAAFQCl2Y7KsUDxWy1iXO3Isn0vOAINJQAAAIBbqpYF5l684fKW8FBM4n
llkw5iIsvx1DHYCGhOfd8iQUvaq7pKmUvjdXwImPI3jZztN5pH5lE/5cb1+5XaItqfkvzN
nzReDx5/bAuDrVnJmYSHVdVfacjshWFBXOKZfvF30qY5y9rcau2QDzoEYyU7onvE0c2gDh
CG0aehMBapLwAAAIAPXpTPP6NcFmoh921gw82rCRSYRemERu+OlVnDLliyQiooHn4AjtNl
B8cWugJL8sfq5ZVg2lO6RDZ9vnarySUsUWdr5aUGpUkFXhCELVyVh+62M8pSkrqzzKIvIM
YPWHhzCFkSwQHndR8chZ3alWbLYT96ZU9CgFbT+phAuF3IxQAAAfCQvkkZCkUcNwvLLx6U
Oys6wgycEfYcnFatTDF08dzz5kRvLRJSP4Er+V2AZvZkueV6ueoWW5QfEmjEJVaHbPg1Z8
c76YNQ2wqgycnbavNMAcgYSMy+u8GtkmWtSd+v8is+W7Wd9uJykG295qWiI9ZdMiPPC2Ye
86148xVvnu5xogPYjmZx7Ta6I3scjYtSeIpGoBA4MltBC9ORJF3pqfoSnAKgNdtKQHmc1x
G2D/Nprnvbs+ouLTJnAa6V0HMqtZNbkFOreUWHMMtg2PYdk18+jKkgsb98iGK/CatMDTvj
dHZb7SbK1RObxSJogtYM8uiYy6DotuuYCCHjVNLsPOd17R/WNgE/zf9RdK42WboE9+9+Nf
IgF+C8VxQC3HZ614kQ18N0WOu4qjw+Lo69TDN9OKAXxzOfgKj+neZ02I0ww7Ch9ostCFIG
qNq+i2iF/ROIwNV2ZTlMn7bACj6VWD4kptusvZ9SWaT8gPj+5Y/DnA93duWWwd2kfklbVj
tChOcmlne32+Ym/MKir5SKR6UKzOCX3kOwmBCDiCQPjqU1tv49JznA2/ixM2Jm0Sc4zlhg
SNYAICc34Yv2kyw1MH2FK3UUKIlt/AnYeUomEmJWiTsmMw9Z0wcspRIL0IhM7frZtNRSNh
2IURS4/VOod9m5
-----END OPENSSH PRIVATE KEY-----
```

### Public Keys

Generated with `$key->getPublicKey()->toString('OpenSSH')`.

```
ssh-dss AAAAB3NzaC1kc3MAAACBALaCtSX6h9VrsDu0HxAgKrIm53KVehDvpAz5W3Ka+dga16OtXqLa5BYF73hlr3NWTPWTPrpeNjiVB0FDdGqlPQo6cg8KIFnaxxyXUwptWpyDSnqucAbDLMbJEk/mPDeN6RyB5fPN9ea9+VlI+MF+Em5vo0+qx8loI84mjkB5ws9BAAAAFQCl2Y7KsUDxWy1iXO3Isn0vOAINJQAAAIBbqpYF5l684fKW8FBM4nllkw5iIsvx1DHYCGhOfd8iQUvaq7pKmUvjdXwImPI3jZztN5pH5lE/5cb1+5XaItqfkvzNnzReDx5/bAuDrVnJmYSHVdVfacjshWFBXOKZfvF30qY5y9rcau2QDzoEYyU7onvE0c2gDhCG0aehMBapLwAAAIAPXpTPP6NcFmoh921gw82rCRSYRemERu+OlVnDLliyQiooHn4AjtNlB8cWugJL8sfq5ZVg2lO6RDZ9vnarySUsUWdr5aUGpUkFXhCELVyVh+62M8pSkrqzzKIvIMYPWHhzCFkSwQHndR8chZ3alWbLYT96ZU9CgFbT+phAuF3IxQ== phpseclib-generated-key
```

## XML

### Public Keys

Generated with `$key->getPublicKey()->toString('XML')`.

```
<DSAKeyValue>
  <P>toK1JfqH1WuwO7QfECAqsibncpV6EO+kDPlbcpr52BrXo61eotrkFgXveGWvc1ZM9ZM+ul42OJUHQUN0aqU9CjpyDwogWdrHHJdTCm1anINKeq5wBsMsxskST+Y8N43pHIHl88315r35WUj4wX4Sbm+jT6rHyWgjziaOQHnCz0E=</P>
  <Q>pdmOyrFA8VstYlztyLJ9LzgCDSU=</Q>
  <G>W6qWBeZevOHylvBQTOJ5ZZMOYiLL8dQx2AhoTn3fIkFL2qu6SplL43V8CJjyN42c7TeaR+ZRP+XG9fuV2iLan5L8zZ80Xg8ef2wLg61ZyZmEh1XVX2nI7IVhQVzimX7xd9KmOcva3GrtkA86BGMlO6J7xNHNoA4QhtGnoTAWqS8=</G>
  <Y>D16Uzz+jXBZqIfdtYMPNqwkUmEXphEbvjpVZwy5YskIqKB5+AI7TZQfHFroCS/LH6uWVYNpTukQ2fb52q8klLFFna+WlBqVJBV4QhC1clYfutjPKUpK6s8yiLyDGD1h4cwhZEsEB53UfHIWd2pVmy2E/emVPQoBW0/qYQLhdyMU=</Y>
</DSAKeyValue>
```