---
layout: default
title:  "Composing better emails"
description: "Tips for writing effective emails avoiding misunderstandings with examples from the software development world."
preview: "Tips for writing effective emails avoiding misunderstandings with examples from the software development world."
date: 2019-06-26 16:30:00 +0300
image: "https://iridakos.com/assets/images/posts/better-emails/post.png"
category: "how-to"
identifier: "composing-better-emails"
outline: true
tags:
  - email
  - communication
  - productivity
popular: 120
featured:
  state: true
  publications:
    - site: Hacker News
      discriminator: hacker-news
      logo: <i class="fa fa-hacker-news"></i>
      data:
        - type: date
          date: "August 1st 2019"
          link: https://news.ycombinator.com/item?id=20581240
    - site: Better Dev Link
      discriminator: betterldevlink
      logo: <i class="fa fa-envelope"></i>
      data:
        - type: issue
          issue: "108"
          link: https://betterdev.link/issues/108
---

**Email communication** is not my favorite but since I can't avoid it, I am trying to compose messages in a way that I think it makes it easier for both me and the recipient:
- to **quickly address what is being communicated**
- **avoid misunderstandings**
- **save time**

Here are some tips. They don't apply to all type of messages, I provide `before` and `after` examples to better describe each case.

## Emphasize text with bold/underlined font

**Emphasizing** the appropriate parts of a message, especially when it's a long one, you help readers **quickly get an idea** of what the email is about and easily **locate the important stuff** after going back to it at some point in the future.

### Examples

#### Before

<div class="border p-2 no-overflow">
<pre>Hello all,

I noticed that there are many logs for blabla the last few days and I don't think that it is normal. I believe the problem is the updated version of gem blabla.

I have opened an issue describing the case in Redmine (&#35;455) in the current version.
Feel free to change its priority in case blabla.

Thanks,
Lazarus
</pre>
</div>

#### After

<div class="border p-2 no-overflow">
<pre>Hello all,

I noticed that there are <b>many logs for blabla the last few days</b> and I don't think that it is normal. I believe the problem is the updated version of gem blabla.

I have opened <b>a Redmine issue (&#35;455)</b> describing the case in the current version.
Feel free to change its priority in case blabla.

Thanks,
Lazarus
</pre>
</div>

## Use specific dates instead of `yesterday`, `tomorrow` etc

The moment you send an email is not the moment that it will be read by its recipients. **Avoid using only temporal adverbs/nouns** like `yesterday`, `today`, `tomorrow`, `two hours ago` etc but **include also the specific dates/times** otherwise they might be misunderstood or require from recipients to check the email's sent date/time to calculate the actual time.

### Examples

#### Before

<div class="p-2 border no-overflow">
<pre>Dear QA,

Yesterday we released a fix for the bug 455 on staging and we plan to release it next Monday if you give us the green light by tomorrow end of day.

Thanks,
Lazarus</pre>
</div>

#### After

<div class="p-2 border no-overflow">
<pre>Dear QA,

<b>Yesterday</b>, June 25th, 2019 we released a fix for the <b>bug &#35;455 on staging</b> and we plan to release it on <b>production next Monday (July 1st, 2019)</b> if you give us the <b>green light by tomorrow (June 27th, 2019)</b> end of day.

Thanks,
Lazarus</pre>
</div>

## Use links for references

Use bookmarkable links when you refer to something that would eventually require from the recipient to search for in another platform.

This has two benefits:
- Save time
- Eliminate ambiguous references

### Examples

#### Before

<div class="p-2 border no-overflow">
<pre>Dear Phoebe,

I didn't understand the process described on the issue about the logging bug. Irida's comment was not very clear either. Can you please help me?

Thanks,
Lazarus</pre>
</div>

#### After

<div class="p-2 border no-overflow">
<pre>Dear Phoebe,

I didn't understand the process described on the issue about the logging bug (<a href="#redmine453">Redmine #453</a>). <a href="#redmine453-comment">This comment from Irida</a> was not very clear either. Can you please help me?

Thanks,
Lazarus</pre>
</div>

## Structure long messages

Long messages are in general not very effective and parts of them are prone to be ignored.

When I have to compose such a message I try to **categorize the text in contextual sections** and then structure them **using headers and paragraphs** allowing readers to navigate to them at a glance.

### Examples

#### Before

<div class="p-2 border no-overflow">
  <pre>Dear team,

Last week we had a problem with the logs in the production environment. I am talking about the Redmine issue &#35;453. We noticed a huge increase in the log messages blabla leading to delayed responses because blah blah blah. At some point the server run out of disk and everything fell apart blah blah blah. Administrators backed up the logs and removed them from the server to blah blah blah. We started investigating what is going on immediately and after two days we managed to reproduce the error in the staging environment as well. The problem was the usage of an external library that had a bug which blah blah blah. We removed the library and the bug was no longer reproducable in the staging environment. The buggy library was blah blah blah. We released the fix yesterday and everything seems to be back to normal. We also added some scripts that will notify us immediately if such conditions start to emerge.

Thank you for your time,
Lazarus</pre>
</div>

#### After

<div class="p-2 border no-overflow">
  <pre>Dear team,

<strong><u>Background</u></strong>
Last week we had a problem with the logs in the production environment. We noticed a huge increase in the log messages blabla.

<strong><u>Consequences</u></strong>
The increase led to delayed responses because blah blah blah. At some point the server run out of disk and everything fell apart blah blah blah.

<strong><u>Cause of the problem</u></strong>
We started investigating what is going on immediately and after two days we managed to reproduce the error in the staging environment as well.
The problem was the usage of an external library that had a bug which blah blah blah. The buggy library was blah blah blah.

<strong><u>Actions taken</u></strong>

1. Administrators <strong>backed up the logs</strong> and removed them from the server to blah blah blah.
2. We <strong>removed the library</strong> and the bug was no longer reproducible in the staging environment.
3. We <strong>released the fix</strong> yesterday, June 26th, 2019.
4. We also <strong>added some scripts that will notify us on time</strong> if such conditions start to emerge.

<strong><u>Current status</u></strong>
<strong>The server is up and running, everything seems to be back to normal.</strong>

<strong><u>More info</u></strong>
<a href="#redmine453">Related Redmine issue &#35;453</a>
<a href="#external-library">External library - Official bug report</a>

Thank you for your time,
Lazarus</pre>
</div>

## Be specific on what you request from whom

I have seen many many many emails for which:
- the sender wanted **something** by **someone**
- the recipients
  - didn't think they were the ones to provide it
  - understood something else than what the sender asked for

I try to be very specific and provide details (when possible) on what I need and when there's more than one recipients I refer to each one explicitly using `@`.

### Examples

#### Before

<div class="p-2 border no-overflow">
<pre>Dear all,

I have pushed a commit that possibly fixes the bug with the logging in staging. I won't be here tomorrow so can you review and release if ok?

Bye.
</pre>
</div>

#### After

<div class="p-2 border no-overflow mb-4">
<pre>Hey,

I have pushed a <strong><a href="#git-commit-reference">commit</a> that possibly fixes the bug <a href="#redmine453">(Redmine #453)</a></strong> with the logging in staging.

Since <strong>I won't be here tomorrow, June 27th</strong>, can you please:

<strong><u>@captain:</u></strong> <strong>review</strong> the <a href="#git-commit-reference">commit</a>
<strong><u>@qa:</u></strong> <strong>run the suite</strong> to validate the fix
<strong><u>@devs:</u></strong> proceed with the <strong>production release on June 28th</strong> given the green light by the QA team?

Sorry for the inconvenience,
Lazarus
</pre>
</div>

Thank you,

Lazarus

## Post Scriptum

Find attached a photo of my cats.

![Meow have your attention please?](/assets/images/posts/better-emails/irida-phoebe.png)

<div class="alert alert-light">
  <div class="alert-heading"><i class="fa fa-comments"></i> Comments and feedback</div>

  For feedback, comments, typos etc. please use this <a class="alert-link" href="https://github.com/iridakos/iridakos-posts/issues/4">issue</a>.

  <hr>

  <strong>Thanks for visiting!</strong>
</div>
