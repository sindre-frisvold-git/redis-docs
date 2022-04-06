# Monitoring performance and errors

## Monitoring go-redis client

go-redis relies on OpenTelemetry to monitor database performance and errors using
[distributed tracing](https://opentelemetry.uptrace.dev/guide/distributed-tracing.html) and
[metrics](https://opentelemetry.uptrace.dev/guide/metrics.html).

[OpenTelemetry](https://opentelemetry.uptrace.dev/) is a vendor-neutral API for distributed traces
and metrics. It specifies how to collect and send telemetry data to backend platforms. It means that
you can instrument your application once and then add or change vendors (backends) as required.

go-redis comes with an OpenTelemetry instrumentation called
[redisotel](https://github.com/go-redis/redis/tree/master/extra/redisotel) that is distributed as a
separate module:

```shell
go get github.com/go-redis/redis/extra/redisotel/v8
```

To instrument Redis client, you need to add the hook provided by redisotel:

```go
import (
    "github.com/go-redis/redis/v8"
    "github.com/go-redis/redis/extra/redisotel/v8"
)

rdb := redis.NewClient(&redis.Options{...})

rdb.AddHook(redisotel.NewTracingHook())
```

For Redis Cluster and Ring you need to instrument each node separately:

```go
rdb := redis.NewClusterClient(&redis.ClusterOptions{
    // ...

    NewClient: func(opt *redis.Options) *redis.Client {
        node := redis.NewClient(opt)
        node.AddHook(redisotel.NewTracingHook())
        return node
    },
})

rdb.AddHook(redisotel.NewTracingHook())
```

To make tracing work, you must pass the active
[trace context](https://opentelemetry.uptrace.dev/guide/go-tracing.html#context) to go-redis
commands, for example:

```go
ctx := req.Context()
val, err := rdb.Get(ctx, "key").Result()
```

As expected, redisotel creates
[spans](https://opentelemetry.uptrace.dev/guide/distributed-tracing.html#spans) for processed Redis
commands and records any errors as they occur. Here is how the collected information is displayed at
[Uptrace](https://uptrace.dev/explore/1/groups/?system=db%3Aredis&utm_source=redis&utm_campaign=redis-tracing):

![Redis trace](/img/redis-trace.png)

You can find a runnable example at
[GitHub](https://github.com/go-redis/redis/tree/master/example/otel).

## See also

- [Monitoring Redis Server with OpenTelemetry Collector](https://blog.uptrace.dev/posts/opentelemetry-collector-monitoring-redis.html)
- [Open Source distributed tracing tools](https://get.uptrace.dev/compare/distributed-tracing-tools.html)
- [OpenTelemetry guide for Gin, GORM, and Zap](https://get.uptrace.dev/opentelemetry/gin-gorm.html)
