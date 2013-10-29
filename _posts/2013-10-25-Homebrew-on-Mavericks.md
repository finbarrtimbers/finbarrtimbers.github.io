---
layout: post
Title: Homebrew on Mavericks
Date: 2013-29-10
---

If you just installed Mavericks, and you’re having problems getting Homebrew and all your brewed packages to work (for me, this included git!), you have to enter
<code>
    sudo xcode-select -R
</code>
This allows everything that depends on the Xcode command line tools to find them, as Apple changed the directory structure from Mountain Lion to Mavericks.

