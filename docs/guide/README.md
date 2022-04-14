---
title: Go Redis client
---

<CoverImage title="Redis client for Go" />

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

- [Redis Server client](go-redis.html)
- [Redis Cluster client](go-redis-cluster.html)
- [Redis Sentinel client](go-redis-sentinel.html)
- [Redis Ring client](ring.html)
- [Redis Univeral client](universal.html)

## Ecosystem

- [Redis Mock](https://github.com/go-redis/redismock).
- [Distributed Locks](https://github.com/bsm/redislock).
- [Redis Cache](go-redis-cache.html).
- [Redis Rate limiting](go-redis-rate-limiting.html).

Please send a PR if you want to add your package to the list.
