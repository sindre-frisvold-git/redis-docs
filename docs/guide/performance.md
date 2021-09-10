# Investigating and improving Redis performance

## Connection pool size

To improve performance, go-redis automatically manages a pool of network connections (sockets). By
default, the pool size is 10 connections per every available CPU as reported by
`runtime.GOMAXPROCS`. In most cases that is more than enough and tweaking it rarely helps.

```go
rdb := redis.NewClient(&redis.Options{
    PoolSize: 1000,
})
```

## Pipelines

Because go-redis spends most of the time writing/reading/waiting data from connections, you can
improve performance by sending multiple commands at once using [pipelines](server.md#pipelines).

If your app logic does not allow using pipelines, consider adding a local in-process
[cache](caching.md) (such as TinyLFU) for the most popular operations.

## Hardware

Make sure that your servers have good network latency and fast CPUs with large caches. If you have
multiple CPU cores, consuder running multiple Redis instances on a single server.

See
[Factors impacting Redis performance](https://redis.io/topics/benchmarks#factors-impacting-redis-performance)
for more details.

## Sharding

If nothing helps, you can split data across multiple Redis instances so that each instance contains
a subset of the keys. This way the load is spread across multiple servers and you can increase
performance by adding more servers.

[Ring](ring.md) is a good option if you are using Redis for caching. Otherwise, you can try
[Redis Cluster](cluster.md).

## Monitoring

See [Monitoring performance and errors](tracing.md).
