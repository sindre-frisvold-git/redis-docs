---
title: Introduction
---

# Go Redis client

## Installation

go-redis supports 2 last Go versions and only works with
[Go modules](https://github.com/golang/go/wiki/Modules). So first you need to initialize a Go
module:

```shell
go mod init github.com/my/repo
```

And then install redis/v8 (note **v8** in the import path):

```shell
go get github.com/go-redis/redis/v8
```

## Clients

[go-redis](https://github.com/go-redis/redis) provides Go clients for various flavors of
[Redis](https://redis.io/):

- [Redis Server client](server.md)
- [Redis Cluster client](cluster.md)
- [Redis Sentinel client](sentinel.md)
- [Redis Ring client](ring.md)
- [Univeral client](universal.md)

## Ecosystem

- [Redis Mock](https://github.com/go-redis/redismock).
- [Distributed Locks](https://github.com/bsm/redislock).
- [Redis Cache](https://github.com/go-redis/cache).
- [Rate limiting](https://github.com/go-redis/redis_rate).

Please send a PR if you want to add your package to the list.
