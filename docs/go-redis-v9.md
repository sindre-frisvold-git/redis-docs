# go-redis joins Redis org on GitHub

Today the go-redis team is thrilled to release go-redis v9, which adds support for the [RESP3 protocol](https://github.com/antirez/RESP3/blob/master/spec.md),
introduces the new hooks API, improves pipelines retries, and allows performance monitoring via OpenTelemetry.

With this release, we also took the opportunity to move the [go-redis](https://github.com/redis/go-redis)
repository under the [Redis GitHub organization](https://github.com/redis/), joining other popular Redis
clients.

The new repository location means that you a new import path for go-redis v9:

```go
// old, v8
import "github.com/go-redis/redis/v8"

// new, v9
import "github.com/redis/go-redis/v9"
```

Beyond that, the API remains the same, and previous releases will continue to work, with their current paths:

```go
package main

import (
	"context"

	"github.com/redis/go-redis/v9"
)

func main() {
	ctx := context.Background()

	rdb := redis.NewClient(&redis.Options{
		Addr:	  "localhost:6379",
		Password: "", // no password set
		DB:		  0,  // use default DB
	})

	if err := rdb.Set(ctx, "key", "value", 0).Err(); err != nil {
		panic(err)
	}

	val, err := rdb.Get(ctx, "key").Result()
	if err != nil {
		panic(err)
	}
	fmt.Println("key", val)
}
```

## RESP3

[@monkey92t](https://github.com/monkey92t) did the hard work to seamlessly support the
[RESP3](https://github.com/antirez/RESP3/blob/master/spec.md) protocol in go-redis v9!

RESP3 is an updated version of RESP v2, the protocol used in Redis. It supports more
[data types](https://github.com/antirez/RESP3/blob/master/spec.md#resp3-types) and lays the groundwork that
will allow us to implement [client side caching](https://redis.io/docs/manual/client-side-caching/) in future releases.

## Improved hooks

v9 comes with the simplified design of execution hooks, used to instrument the following
Redis client operations:

- `DialHook` establishes a new connection.
- `ProcessHook` processes a Redis command.
- `ProcessPipelineHook` processes Redis commands in a pipeline.

The hooks API now looks like the following:

```go
import "github.com/redis/go-redis/v9"

type redisHook struct{}

var _ redis.Hook = redisHook{}

func (redisHook) DialHook(hook redis.DialHook) redis.DialHook {
	return func(ctx context.Context, network, addr string) (net.Conn, error) {
		fmt.Printf("dialing %s %s\n", network, addr)
		conn, err := hook(ctx, network, addr)
		fmt.Printf("finished dialing %s %s\n", network, addr)
		return conn, err
	}
}

func (redisHook) ProcessHook(hook redis.ProcessHook) redis.ProcessHook {
	return func(ctx context.Context, cmd redis.Cmder) error {
		fmt.Printf("starting processing: <%s>\n", cmd)
		err := hook(ctx, cmd)
		fmt.Printf("finished processing: <%s>\n", cmd)
		return err
	}
}

func (redisHook) ProcessPipelineHook(hook redis.ProcessPipelineHook) redis.ProcessPipelineHook {
	return func(ctx context.Context, cmds []redis.Cmder) error {
		fmt.Printf("pipeline starting processing: %v\n", cmds)
		err := hook(ctx, cmds)
		fmt.Printf("pipeline finished processing: %v\n", cmds)
		return err
	}
}
```

## OpenTelemetry

[OpenTelemetry](https://uptrace.dev/opentelemetry/) is an open source and vendor-neutral API for
distributed tracing, logs, and metrics. go-redis integrates with OpenTelemetry, instrumentation is based on
[redisotel](https://github.com/go-redis/redis/tree/master/extra/redisotel). The hooks API supports instrumentation in the go-redis client.

In v9, the redisotel package was fully reworked to support both
[OpenTelemetry tracing](https://uptrace.dev/opentelemetry/distributed-tracing.html) and
[OpenTelemetry metrics](https://uptrace.dev/opentelemetry/metrics.html) as follows:

```go
import (
	"github.com/go-redis/redis/extra/redisotel/v9"
	"github.com/redis/go-redis/v9"
)

rdb := redis.NewClient(...)
// rdb := redis.NewClusterClient(...)

// Enable tracing instrumentation.
if err := redisotel.InstrumentTracing(rdb); err != nil {
	panic(err)
}

// Enable metrics instrumentation.
if err := redisotel.InstrumentMetrics(rdb); err != nil {
	panic(err)
}
```

See [this example](https://github.com/go-redis/redis/tree/master/example/otel) on GitHub and
[OpenTelemetry Redis Monitoring](https://uptrace.dev/opentelemetry/redis-monitoring.html) for
further details.

## Redis Metrics

Starting with v9, redisotel reports the following metrics:

- `db.client.connections.usage` - the number of connections that are currently in state described by
  the `state` attribute.
- `db.client.connections.timeouts` - the number of connection timeouts that have occurred trying to
  obtain a connection from the pool.
- `db.client.connections.create_time` - the time it took to create a new connection.
- `db.client.connections.use_time` - the time between borrowing a connection and returning it to the
  pool.

You can visualize and monitor those metrics using Uprace, an
[open source APM](https://uptrace.dev/get/open-source-apm.html) tool, developed by by the go-redis authors :)

Uptrace is an
[open-source DataDog competitor](https://uptrace.dev/get/compare/datadog-competitors.html) with an
intuitive query builder, rich dashboards, automatic alerts, and integrations for many languages and
frameworks.

OpenTelemetry metrics can also be sent to Prometheus via
[OpenTelemetry Prometheus exporter](https://uptrace.dev/opentelemetry/prometheus-metrics.html).

## ParseClusterURL

In v8, you could a url based connection was supportd by `ParseURL` as below:

```go
options, err := redis.ParseURL("redis://<user>:<pass>@localhost:6379/<db>")
if err != nil {
	panic(err)
}
rdb := redis.NewClient(options)
```

In v9, Redis cluster support was added via `ParseClusterURL`:

```go
options, err := redis.("redis://user:password@localhost:6789?dial_timeout=3&read_timeout=6s&addr=localhost:6790&addr=localhost:6791")
if err != nil {
	panic(err)
}
rdb := redis.NewClusterClient(options)
```
