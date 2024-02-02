---
layout: page
title: Installing Docker on a new VM
articles: True
math: False
---

I consistently run into the same issue when install Docker on a new Ubuntu VM. 

I copy the command from the [Docker docs](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository),
and it fails with the error:

```
E: The repository 'https://download.docker.com/linux/ubuntu bookworm Release' does not have a Release file.
N: Updating from such a repository can't be done securely, and is therefore disabled by default.
N: See apt-secure(8) manpage for repository creation and user configuration details.
```

There is a simple fix, but it is annoying to find it via Google, and it takes me ~20 minutes every time:

https://forums.docker.com/t/solved-cannot-install-docker-ce-on-debian-stretch/50407/5

I have now created this page to write it down. Google, please index this.
