---
layout: post
title:  "Change brightness with the function keys on iMac running Debian"
description: "Steps I had to follow to be able to change my iMac's brightness using the function keys on Debian"
date: 2018-06-24 18:00:00 +0300
image: "https://iridakos.com/assets/images/posts/debian-backlight/brightness.jpg"
category: "how-to"
identifier: "debian-backlight-imac"
show_popular_inline_posts: false
outline: true
tags: linux debian imac opensource how-to grub
popular: -1
search_tags: linux, debian, imac, opensource, how-to, grub
related_posts:
  - elasticsearch-linux-man-pages
  - bash-completion-script
---

In this post I will describe the steps I had to follow to be able to change the brightness on my iMac using the related keyboard function keys.

## Context

After installing Debian 9.4 (*stretch*) on my iMac, I was no longer able to control the brightness from the keyboard (`F1`, `F2` keys). When pressing these keys, although a notification was shown for increasing/decreasing it, the brightness was not changing.

## Identifying the problem

In my case, I had two entries for the backlight class in my system.

```bash
$ ls /sys/class/backlight/
acpi_video0  radeon_bl0
```

The keyboard keys were affecting the brightness value stored in the file `brightness` located in the `acpi_video0` directory.

I tried to change the brightness level manually in the `brightness` file located in the second directory, the one named `radeon_bl0` and the iMac's brightness **did actually change**.

```bash
echo 190 | sudo tee /sys/class/backlight/radeon_bl0/brightness
```

## Solution

After searching around on how to fix this, I found an [answer](https://unix.stackexchange.com/questions/110624/what-do-the-kernel-parameters-acpi-osi-linux-and-acpi-backlight-vendor-do) explaining the meaning of the`acpi_backlight` [kernel parameter](https://www.kernel.org/doc/Documentation/admin-guide/kernel-parameters.txt).

So, all I had to do was to set my grub configuration to pass the `vendor` value in the `acpi_backlight` kernel parameter upon boot so that the vendor specific driver (in my case `Radeon`) is preferred instead of the default `ACPI video.ko`.

### 1. Editing the grub configuration file

I edited the grub configuration file with vim:

```bash
sudo vim /etc/default/grub
```

### 2. Setting the kernel parameter in the appropriate section

In the line starting with `GRUB_CMDLINE_LINUX_DEFAULT` I appended the desired kernel parameter `acpi_backlight=vendor`:

```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet acpi_backlight=vendor"
```

### 3. Updating grub

Finally, I had to update grub to produce the actual configuration file being loaded at boot.

```bash
sudo update-grub
```

### 4. Reboot

After rebooting, I was able to manage the brightness with the brightness function keys.
In addition, the `/sys/class/backlight` directory now lists only one directory, the vendor's one `radeon_bl0`.

## Caution

The steps described in this post, have been tested on my system with:

* Product Name: **iMac11,3**
* VGA compatible controller: **Advanced Micro Devices, Inc. [AMD/ATI] Broadway PRO [Mobility Radeon HD 5850]**

and I can't know if they are valid for other cases. Follow them at your own risk :)

To find your iMac model, use:

```bash
sudo dmidecode | grep -A 9 "System Information"
```

and your VGA compatible controller:
```bash
lspci | grep "VGA compatible controller"
```

That's all, cat photo:

![Cat terminator](/assets/images/posts/debian-backlight/brightness.jpg)
