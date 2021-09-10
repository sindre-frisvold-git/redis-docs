# Monitoring performance and errors

## Monitoring go-redis client

You can monitor Redis performance and errors using
[distributed tracing](https://docs.uptrace.dev/guide/tracing.html). Tracing allows you to see how a
request progresses through different services and systems, timings of every operation, any logs and
errors as they occur.

go-redis supports tracing using [OpenTelemetry](https://opentelemetry.io/) API. OpenTelemetry is a
vendor-neutral API for distributed traces and metrics. It specifies how to collect and send
telemetry data to backend platforms. It means that you can instrument your application once and then
add or change vendors (backends) as required.

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

As expected, redisotel creates [spans](https://docs.uptrace.dev/guide/tracing.html#spans) for
processed Redis commands and records any errors as they occur. Here is how the collected information
is displayed at
[Uptrace](https://uptrace.dev/explore/1/groups/?system=db%3Aredis&utm_source=redis&utm_campaign=redis-tracing):

![Redis trace](/img/redis-trace.png)

If you need an example, see [GitHub](https://github.com/go-redis/redis/tree/master/example/otel).

## Monitoring Redis Server

See
[Monitoring Redis Server with OpenTelemetry Collector](https://blog.uptrace.dev/posts/opentelemetry-collector-monitoring-redis/).
