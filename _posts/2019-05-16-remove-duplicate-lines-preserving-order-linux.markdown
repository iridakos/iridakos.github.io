---
layout: default
title:  "How to remove duplicate lines from files keeping the original order"
description: "How to remove duplicate lines of a file in Linux without sorting or changing their order (awk one-liner explained)."
preview: "How to remove duplicate lines of a file in Linux without sorting or changing their order (awk one-liner explained)."
date: 2019-05-16 11:30:00 +0300
image: "https://iridakos.com/assets/images/posts/remove-duplicates/post.png"
category: "how-to"
identifier: "remove-duplicate-lines-linux"
outline: true
tags:
  - linux
  - bash
  - scripts
  - file
  - awk
popular: -1
featured:
  state: true
  publications:
    - site: Hacker News
      discriminator: hacker-news
      logo: <i class="fa fa-hacker-news"></i>
      data:
        - type: date
          date: "on May 29th 2019"
          link: https://news.ycombinator.com/item?id=20037366
related_posts:
  - bash-completion-script
  - faviconicious
---

Suppose you have a text file and you need to remove all of its duplicate lines.

## TL;DR

To remove the duplicate lines **preserving their order in the file** use:

```bash
awk '!visited[$0]++' your_file > deduplicated_file
```

## How it works

The script keeps an associative array with *indices* equal to the unique lines of the file and *values* equal to their occurrences. For each line of the file, if the line occurrences are zero then it increases them by one and **prints the line**, otherwise it just increases the occurrences **without printing the line**.

I was not familiar with `awk` and I wanted to understand how is this accomplished with such a short script (`awk`ward). I did my research and here is what is going on:

* the awk "script" `!visited[$0]++` is executed for **each line** of the input file
* `visited[]` is a variable of type [associative array](http://kirste.userpage.fu-berlin.de/chemnet/use/info/gawk/gawk_12.html) (a.k.a. [Map](https://en.wikipedia.org/wiki/Associative_array)). We don't have to initialize it, `awk` will do this for us the first time we access it.
* the `$0` variable holds the contents of the line currently being processed
* `visited[$0]` accesses the value stored in the map with key equal to `$0` (the line being processed), a.k.a. the occurrences (which we set below)
* the `!` negates the occurrences value:
  * [In awk, any nonzero numeric value or any nonempty string value is true](https://www.gnu.org/software/gawk/manual/html_node/Truth-Values.html)
  * [By default, variables are initialized to the empty string, which is zero if converted to a number](https://ftp.gnu.org/old-gnu/Manuals/gawk-3.0.3/html_chapter/gawk_8.html)
  * That being said:
    * if `visited[$0]` returns a number greater than zero, this negation is resolved to `false`.
    * if `visited[$0]` returns a number equal to zero or an empty string, this negation is resolved to `true`.
* the `++` operation increases the variable's value (`visited[$0]`) by one.
  * If the value is empty, `awk` converts it to `0` (number) automatically and then it gets increased.
  * **Note:** the operation is executed after we access the variable's value.

Summing up, the whole expression evaluates to:
* **true** if the occurrences are zero/empty string
* **false** if the occurrences are greater than zero

**`awk`** statements consist of a [**pattern-expression** and an **associated action**](http://kirste.userpage.fu-berlin.de/chemnet/use/info/gawk/gawk_9.html).

```awk
<pattern/expression> { <action> }
```

**If the pattern succeeds then the associated action is being executed**. If we don't provide an action, `awk` by default `print`s the input.

> An omitted action is equivalent to `{ print $0 }`

Our script consists of one `awk` statement with an expression, omitting the action.
So this:

```awk
awk '!visited[$0]++' your_file > deduplicated_file
```

is equivalent to this:

```awk
awk '!visited[$0]++ { print $0 }' your_file > deduplicated_file
```

For every line of the file, if the expression succeeds the line is printed to the output. Otherwise, the action is not executed, nothing is printed.

## Why not use the `uniq` command?

The `uniq` commands removes only the **adjacent duplicate lines**. Demonstration:

```bash
$ cat test.txt
A
A
A
B
B
B
A
A
C
C
C
B
B
A
$ uniq < test.txt
A
B
A
C
B
A
```

## Other approaches

<h3>Using the <code>sort</code> command</h3>

We can also use the following [`sort`](http://man7.org/linux/man-pages/man1/sort.1.html) command to remove the duplicate lines but **the line order is not preserved**.

```bash
sort -u your_file > sorted_deduplicated_file
```

<h3>Using <code>cat</code>, <code>sort</code> and <code>cut</code></h3>

The previous approach would produce a de-duplicated file whose lines would be sorted based on the contents. [Piping a bunch of commands](https://stackoverflow.com/a/20639730/2292448) we can overcome this issue:

```bash
cat -n your_file | sort -uk2 | sort -nk1 | cut -f2-
```

#### How it works

Suppose we have the following file:

```text
abc
ghi
abc
def
xyz
def
ghi
klm
```

**`cat -n test.txt`** prepends the order number in each line.

```text
1	abc
2	ghi
3	abc
4	def
5	xyz
6	def
7	ghi
8	klm
```

**`sort -uk2`** sorts the lines based on the second column (`k2` option) and keeps only the first occurrence of the lines with the same second column value (`u` option)

```text
1	abc
4	def
2	ghi
8	klm
5	xyz
```

**`sort -nk1`** sorts the lines based on their first column (`k1` option) treating the column as a number (`-n` option)

```text
1	abc
2	ghi
4	def
5	xyz
8	klm
```

Finally, **`cut -f2-`** prints each line starting from the second column until its end (`-f2-` option: *note the `-` suffix which instructs to include the rest of the line*)

```text
abc
ghi
def
xyz
klm
```

## References

- [The GNU Awk User’s Guide
](https://www.gnu.org/software/gawk/manual/html_node/)
- [Arrays in Awk](http://kirste.userpage.fu-berlin.de/chemnet/use/info/gawk/gawk_12.html)
- [Awk - Truth values](https://www.gnu.org/software/gawk/manual/html_node/Truth-Values.html)
- [Awk expressions](https://ftp.gnu.org/old-gnu/Manuals/gawk-3.0.3/html_chapter/gawk_8.html)
- [How can I delete duplicate lines in a file in Unix?
](https://stackoverflow.com/questions/1444406/how-can-i-delete-duplicate-lines-in-a-file-in-unix)
- [Remove duplicate lines without sorting [duplicate]](https://stackoverflow.com/questions/11532157/remove-duplicate-lines-without-sorting)
- [How does awk '!a[$0]++' work?](https://unix.stackexchange.com/questions/159695/how-does-awk-a0-work/159734#159734)

That's all. Cat photo.

![duplicate cat](/assets/images/posts/remove-duplicates/duplicate-cat.jpg)

<div class="alert alert-light">
  <div class="alert-heading"><i class="fa fa-comments"></i> Comments and feedback</div>

  For feedback, comments, typos etc. please use this <a class="alert-link" href="https://github.com/iridakos/iridakos-posts/issues/3">issue</a>.

  <hr>

  <strong>Thanks for visiting!</strong>
</div>
