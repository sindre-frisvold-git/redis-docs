---
title: Redis Monitoring Performance [OpenTelemetry 2022]
---

<CoverImage title="Monitoring Redis Performance using OpenTelemetry" />

Monitoring Redis performance is an essential part in making sure your users get fast and consistent
experience.

In this guide, you will learn about 2 methods how to monitor Redis performance:

- Monitoring Redis Server performance Using OpenTelemetry Collector and Metrics. This method works
  for all Redis clients and programming languages.
- Monitoring go-redis performance using OpenTelemetry instrumentation for go-redis. This method only
  works for go-redis client.

For best results, you should use both methods, but only using OpenTelemetry Collector is often
enough too.

[[toc]]

## Monitoring Redis Server performance

### What is OpenTelemetry Collector?

[OpenTelemetry Collector](https://opentelemetry.uptrace.dev/guide/collector.html) is a proxy service
between your application and a
[tracing tool](https://get.uptrace.dev/compare/distributed-tracing-tools.html). It receives
telemetry data, transforms the data, and then exports it to backends that can store the data
permanently.

Collector can also work as an agent that pulls telemetry data from monitored programs and then
exports it to the configured backends. In this article, we will use OpenTelemetry Collector as an
agent to collect Redis Server metrics.

### Installing OpenTelemetry Collector

OpenTelemetry Collector distributes pre-compiled
[binaries](https://github.com/open-telemetry/opentelemetry-collector-releases/releases) for Linux,
MacOS, and Windows. You can install and configure it within minutes.

To install `otel-contrib-collector` binary with the associated systemd service:

<CodeGroup>
  <CodeGroupItem title="Debian">

```shell
wget https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v0.43.0/otelcol-contrib_0.43.0_linux_amd64.deb
sudo dpkg -i otelcol-contrib_0.43.0_linux_amd64.deb
```

  </CodeGroupItem>

  <CodeGroupItem title="RPM">

```shell
wget https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v0.43.0/otelcol_0.43.0_linux_amd64.rpm
sudo rpm -ivh otelcol_0.43.0_linux_amd64.rpm
```

  </CodeGroupItem>
</CodeGroup>

You can check the status of the installed service with:

```shell
sudo systemctl status otelcol-contrib
```

### Configuring OpenTelemetry Collector

By default, you can find the config file at `/etc/otel-contrib-collector/config.yaml`. It has the
following sections:

- `receivers` configures how data gets into the Collector.
- `processors` specifies what happens with the received data.
- `exporters` configures how you send processed data to one or more backends.
- `service` pulls the configured receivers, processors, and exporters together into a processing
  pipeline. Don't repeat a common mistake by configuring a receiver or an exporter without adding it
  to a processing pipeline.

See
[OpenTelemetry Collector configuration](https://opentelemetry.uptrace.dev/guide/collector.html#configuration)
to learn more.

### Redis receiver

To start monitoring Redis, you need to replace `/etc/otel-contrib-collector/config.yaml` with the
following config using [Uptrace DSN](https://docs.uptrace.dev/guide/#getting-started):

```yaml
receivers:
  otlp:
    protocols:
      grpc:
      http:
  hostmetrics:
    collection_interval: 10s
    scrapers:
      cpu:
      disk:
      load:
      filesystem:
      memory:
      network:
      paging:
  redis:
    endpoint: localhost:6379
    collection_interval: 10s

exporters:
  otlp:
    endpoint: otlp.uptrace.dev:4317
    headers: { 'uptrace-dsn': '<FIXME>' }

processors:
  resourcedetection:
    detectors: [system]
  batch:
    timeout: 10s

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp]
    metrics:
      receivers: [otlp, redis, hostmetrics]
      processors: [batch, resourcedetection]
      exporters: [otlp]
```

Don't forget to restart the service:

```shell
sudo systemctl restart otelcol-contrib
```

You can also check OpenTelemetry Collector logs for any errors:

```shell
sudo journalctl -u otelcol-contrib -f
```

### Prometheus

You can also send OpenTelemetry metrics to Prometheus using
[OpenTelemetry Prometheus exporter](https://opentelemetry.uptrace.dev/guide/opentelemetry-prometheus.html).

### Available metrics

When telemetry data reaches [Uptrace](https://uptrace.dev), it automatically generates a Redis
dashboard from the pre-defined template.

![Redis metrics](/redis-monitoring-performance/metrics.png)

## Monitoring go-redis client performance

### OpenTelemetry Tracing

go-redis relies on OpenTelemetry to monitor database performance and errors using
[distributed tracing](https://opentelemetry.uptrace.dev/guide/distributed-tracing.html) and
[metrics](https://opentelemetry.uptrace.dev/guide/metrics.html).

[OpenTelemetry](https://opentelemetry.uptrace.dev/) is a vendor-neutral API for distributed traces
and metrics. It specifies how to collect and send telemetry data to backend platforms. It means that
you can instrument your application once and then add or change vendors (backends) as required.

### OpenTelemetry instrumentation

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

### Trace example

As expected, redisotel creates
[spans](https://opentelemetry.uptrace.dev/guide/distributed-tracing.html#spans) for processed Redis
commands and records any errors as they occur. Here is how the collected information is displayed at
[Uptrace tracing tool](https://get.uptrace.dev/):

![Redis trace](/redis-monitoring-performance/trace.png)

You can find a runnable example at
[GitHub](https://github.com/go-redis/redis/tree/master/example/otel).

## See also

- [Debugging Go Redis: pool size, timeouts](go-redis-debugging.html)
- [Open Source distributed tracing tools](https://get.uptrace.dev/compare/distributed-tracing-tools.html)
- [DataDog competitors and alternatives](https://get.uptrace.dev/compare/datadog-competitors.html)
