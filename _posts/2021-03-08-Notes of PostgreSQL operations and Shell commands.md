---
layout: post
title: Notes of PostgreSQL operations and Shell commands
---

Sometimes, commands will slip out the brain, and it is always good to have a place to look up these commands.
<!--more-->

### PostgreSql
<hr/>

Start postgresql server

```shell
$ pg_ctl start -l YOUR_INSTALL_DIRECTORY/log
```

Stop postgresql server

```shell
$ pg_ctl stop
```
Check current status of server (is there any server running?)

```shell
$ pg_ctl status
```

Create database
```shell
$ createdb DATABASE_NAME
```

Drop database
```shell
$ dropdb DATABASE_NAME
```

Show a list of your database
```shell
$ psql -l
```

Get inside *YOUR_DATABASE*
```shell
$ psql YOUR_DATABASE
```

Inside database *YOUR_DATABASE*

```
YOUR_DATABASE=# \d
# ...show a list of relations in YOUR_DATABASE

YOUR_DATABASE=# \d+
# ...show a list of relations in YOUR_DATABASE with more details

YOUR_DATABASE=# \df
# ...show a list of functions in YOUR_DATABASE ('+' syntax also applies)

YOUR_DATABASE=# \x
# ...show infomation with extended mode

YOUR_DATABASE=# \do
# ...show a list of operations in YOUR_DATABASE ('+' syntax also applies)

YOUR_DATABASE=# \q
# ...quit your YOUR_DATABASE
```


For more information about PostgreSql, check [PostgreSQL's Documentation](https://www.postgresql.org/docs/12/index.html).

### Shell commands
<hr/>

> definitions of commands come from **"BSD General Commands Manual"**

`echo` : write arguments to the standard output

```shell
$ echo "hello"
# hello
```

`cat` : concatenate and print files

```shell
$ echo "hello" > file
$ cat file
# hello
```

`touch` : change file access and modification times

```shell
$ touch file1
$ touch file2
$ touch file3
# or 
$ touch file1 file2 file3
```

`ls` : list directory contents
```shell
$ ls
# file1 file2 file3
```

If you want to learn more about shell commands, check out the following links.
- [Linux Shell Commands](https://docs.cs.cf.ac.uk/notes/linux-shell-commands/)
- [The Unix Shell: Summary of Basic Commands](https://swcarpentry.github.io/shell-novice/reference)
- [The Linux command line for beginners](https://ubuntu.com/tutorials/command-line-for-beginners#1-overview)