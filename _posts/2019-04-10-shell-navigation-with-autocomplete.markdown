---
layout: default
title:  "Linux shell navigation to aliased directories with autocomplete"
description: "A Linux shell script for registering directory aliases and navigating to them with tab completion."
preview: "A Linux shell script for registering directory aliases and navigating to them with tab completion."
date: 2019-04-10 16:00:00 +0300
image: "https://iridakos.com/assets/images/posts/goto/goto.gif"
category: "tutorials"
identifier: "shell-navigation-goto"
outline: true
tags:
  - linux
  - opensource
  - bash
  - scripts
popular: -1
redirect_from:
  - /tutorials/2019/04/09/shell-navigation-with-autocomplete.html
related_posts:
  - bash-completion-script
---

I use the terminal a lot and in my day to day work I tend to navigate to the same bunch of directories.

There are some awesome tools out there (like [autojump](https://github.com/wting/autojump) or [z](https://github.com/rupa/z)) but sometimes, especially when the directories are similarly named, there is a need **to be explicit** to navigate to the proper one.

I decided to write a script to overcome this issue and to avoid having to edit my `.bash*` files to manage [`aliases`](http://tldp.org/LDP/abs/html/aliases.html) each time I wanted to add or remove a directory.

## goto

`goto` is a shell utility to quickly navigate to aliased directories with autocomplete *(tab completion)*.

<!-- Place this tag where you want the button to render. -->
<a class="github-button" href="https://github.com/iridakos/goto" data-size="large" data-show-count="true" aria-label="View iridakos/goto on GitHub">goto at GitHub</a>

![goto gif]({{site.url}}/assets/images/posts/goto/goto.gif)

User registers directory aliases, for example:

```bash
goto --register dev /home/iridakos/development
```

and then cds to that directory with:

```bash
goto dev
```

Find below documentation on the script but make sure you check the [script's documentation page](https://github.com/iridakos/goto/blob/master/README.md) for updates.

**Sorry for the name, I know it brings back memories but it's not what it seems :)**

## Installation

To install `goto` all you have to do is clone the <a href="https://github.com/iridakos/goto">repository</a> locally:

```bash
git clone https://github.com/iridakos/goto.git
```

navigate to it

```bash
cd goto
```

and execute:

```bash
sudo ./install
```

You need to restart your shell after installation.

## Usage

* [Change to an aliased directory](#change-to-an-aliased-directory)
* [Register an alias](#register-an-alias)
* [Unregister an alias](#unregister-an-alias)
* [List aliases](#list-aliases)
* [Expand an alias](#expand-an-alias)
* [Cleanup](#cleanup)
* [Help](#help)
* [Version](#version)
* [Extras](#extras)
  * [Push before changing directories](#push-before-changing-directories)
  * [Revert to a pushed directory](#revert-to-a-pushed-directory)

### Change to an aliased directory
To change to an aliased directory, type:
```bash
goto <alias>
```

#### Example
```bash
goto dev
```

### Register an alias
To register a directory alias, type:
```bash
goto -r <alias> <directory>
```
or
```bash
goto --register <alias> <directory>
```

#### Example
```bash
goto -r blog /mnt/external/projects/html/blog
```
or
```bash
goto --register blog /mnt/external/projects/html/blog
```

#### Notes

* `goto` **expands** the directories hence you can easily alias your current directory with:
```bash
goto -r last_release .
```
and it will automatically be aliased to the whole path.
* Pressing the `tab` key after the alias name, you have the default directory suggestions by the shell.

### Unregister an alias

To unregister an alias, use:
```bash
goto -u <alias>
```
or
```bash
goto --unregister <alias>
```
#### Example
```
goto -u last_release
```
or
```
goto --unregister last_release
```

#### Notes

Pressing the `tab` key after the command (`-u` or `--unregister`), the completion script will prompt you with the list of registered aliases for your convenience.

### List aliases

To get the list of your currently registered aliases, use:
```bash
goto -l
```
or
```bash
goto --list
```

### Expand an alias

To expand an alias to its value, use:
```bash
goto -x <alias>
```
or
```bash
goto --expand <alias>
```

#### Example
```bash
goto -x last_release
```
or
```bash
goto --expand last_release
```

### Cleanup

To cleanup the aliases from directories that are no longer accessible in your filesystem, use:

```bash
goto -c
```
or
```bash
goto --cleanup
```

### Help

To view the tool's help information, use:
```bash
goto -h
```
or
```bash
goto --help
```

### Version

To view the tool's version, use:
```bash
goto -v
```
or
```bash
goto --version
```

### Extras

#### Push before changing directories

To first push the current directory onto the directory stack before changing directories, type:
```bash
goto -p <alias>
```
or
```bash
goto --push <alias>
```

#### Revert to a pushed directory
To return to a pushed directory, type:
```bash
goto -o
```
or
```bash
goto --pop
```

##### Notes

This command is equivalent to `popd`, but within the `goto` command.

## Behind the scenes

Upon installation, a line is appended to your `.bashrc` file which sources the script, registering a `goto` function responsible for changing the directory based on the defined aliases of the database.

The script creates a directory alias database file under `~/.goto`.
Every `register` or `unregister` action modifies this file.

The script also uses the [Bash programmable completion](https://www.tldp.org/LDP/abs/html/tabexpansion.html) feature to define tab completions resolved via extraction of the aliases defined in the `goto` database file.

That's all! Cat photo.

![I'll be back](https://iridakos.com/assets/images/programming-cat/terminator.png)


<div class="alert alert-light">
  <div class="alert-heading"><i class="fa fa-comments"></i> Code and comments</div>

  You can find the code of goto at <a class="alert-link" href="https://github.com/iridakos/goto"><i class="fa fa-github"></i> https://github.com/iridakos/goto</a>.

  <hr />

  For feedback, comments, typos etc. please open an <a class="alert-link" href="https://github.com/iridakos/goto/issues">issue</a> in the repository.

  <hr>

  <strong>Thanks for visiting!</strong>
</div>

<!-- Place this tag in your head or just before your close body tag. -->
<script async defer src="https://buttons.github.io/buttons.js"></script>
