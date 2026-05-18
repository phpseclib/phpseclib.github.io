---
title: Special Characters
---

When you're using an interactive shell via `$ssh->write()` (see [Sending Special Characters](commands.md#sending-special-characters)), printable keys like letters and digits can just be written as themselves. Non-printable keys (arrows, function keys, <kbd>Ctrl</kbd> combinations) need to be sent as the byte sequences a real terminal would send.

The sequences below are correct for `vt100` (phpseclib's default) and `xterm`.

## Quick reference

|Key|String|
|---|---|
|<kbd>Ctrl</kbd> + <kbd>C</kbd>|`"\x03"`|
|<kbd>Ctrl</kbd> + <kbd>D</kbd>|`"\x04"`|
|<kbd>Ctrl</kbd> + <kbd>Z</kbd>|`"\x1A"`|
|<kbd>Esc</kbd>|`"\x1B"`|
|<kbd>Tab</kbd>|`"\t"`|
|<kbd>Enter</kbd>|`"\n"`|
|<kbd>Backspace</kbd>|`"\x7F"`|
|<kbd>↑</kbd>|`"\x1B[A"`|
|<kbd>↓</kbd>|`"\x1B[B"`|
|<kbd>→</kbd>|`"\x1B[C"`|
|<kbd>←</kbd>|`"\x1B[D"`|
|<kbd>Home</kbd>|`"\x1B[H"`|
|<kbd>End</kbd>|`"\x1B[F"`|
|<kbd>Page Up</kbd>|`"\x1B[5~"`|
|<kbd>Page Down</kbd>|`"\x1B[6~"`|
|<kbd>Insert</kbd>|`"\x1B[2~"`|
|<kbd>Delete</kbd>|`"\x1B[3~"`|
|<kbd>F1</kbd>|`"\x1BOP"`|
|<kbd>F2</kbd>|`"\x1BOQ"`|
|<kbd>F3</kbd>|`"\x1BOR"`|
|<kbd>F4</kbd>|`"\x1BOS"`|
|<kbd>F5</kbd>|`"\x1B[15~"`|
|<kbd>F6</kbd>|`"\x1B[17~"`|
|<kbd>F7</kbd>|`"\x1B[18~"`|
|<kbd>F8</kbd>|`"\x1B[19~"`|
|<kbd>F9</kbd>|`"\x1B[20~"`|
|<kbd>F10</kbd>|`"\x1B[21~"`|
|<kbd>F11</kbd>|`"\x1B[23~"`|
|<kbd>F12</kbd>|`"\x1B[24~"`|

## Why F1–F4 look different from F5+

F1 through F4 use `\x1BO` (uppercase letter O) as the introducer; F5 onward use `\x1B[`. This is a holdover from the original VT100 keyboard, which had four function keys distinct from the rest. Modern terminals keep the split for backward compatibility.

If your server-side program isn't responding to a sequence you sent, double-check the terminal type with `$ssh->setTerminal(...)`. Sequences for `vt220`, `linux`, and others can differ from the table above.
