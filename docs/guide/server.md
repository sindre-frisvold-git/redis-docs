# Getting started

## Connecting to Redis Server

To connect to a Redis Server:

```go
import "github.com/go-redis/redis/v8"

rdb := redis.NewClient(&redis.Options{
	Addr:	  "localhost:6379",
	Password: "", // no password set
	DB:		  0,  // use default DB
})
```

Another popular way is using a connection string:

```go
opt, err := redis.ParseURL("redis://<user>:<pass>@localhost:6379/<db>")
if err != nil {
	panic(err)
}

rdb := redis.NewClient(opt)
```

### Using TLS

To enable TLS/SSL, you need to provide a `tls.Config`. If you're using private certs, you need to
[specify](https://pkg.go.dev/crypto/tls#example-LoadX509KeyPair) them in the `tls.Config`.

```go
rdb := redis.NewClient(&redis.Options{
	TLSConfig: &tls.Config{
		MinVersion: tls.VersionTLS12,
		//Certificates: []tls.Certificate{cert}
	},
})
```

If you are getting
`x509: cannot validate certificate for xxx.xxx.xxx.xxx because it doesn't contain any IP SANs`, try
to set `ServerName` option:

```go
rdb := redis.NewClient(&redis.Options{
	TLSConfig: &tls.Config{
		MinVersion: tls.VersionTLS12,
		ServerName: "your.domain.com",
	},
})
```

## redis.Nil

go-redis exports the `redis.Nil` error and returns it whenever Redis Server responds with `(nil)`.
You can use redis-cli to check what response Redis returns.

In the following example we use `redis.Nil` to distinguish an empty string reply and a nil reply
(key does not exist):

```go
val, err := rdb.Get(ctx, "key").Result()
switch {
case err == redis.Nil:
	fmt.Println("key does not exist")
case err != nil:
	fmt.Println("Get failed", err)
case val == "":
	fmt.Println("value is empty")
}
```

`GET` is not the only command that returns nil reply, for example, `BLPOP` and `ZSCORE` can also
return `redis.Nil`.

## Executing commands

To execute a command:

```go
val, err := rdb.Get(ctx, "key").Result()
fmt.Println(val)
```

Alternatively you can save the command and later access the value and the error separately:

```go
get := rdb.Get(ctx, "key")
fmt.Println(get.Val(), get.Err())
```

## Executing unsupported commands

To execute arbitrary/custom command:

```go
val, err := rdb.Do(ctx, "get", "key").Result()
if err != nil {
	if err == redis.Nil {
		fmt.Println("key does not exists")
		return
	}
	panic(err)
}
fmt.Println(val.(string))
```

`Do` returns a [Cmd](https://pkg.go.dev/github.com/go-redis/redis/v8#Cmd) that has a bunch of
helpers to work with `interface{}` value:

```go
// Text is a shortcut for get.Val().(string) with proper error handling.
val, err := rdb.Do(ctx, "get", "key").Text()
fmt.Println(val, err)
```

The full list of helpers:

```go
s, err := cmd.Text()
flag, err := cmd.Bool()

num, err := cmd.Int()
num, err := cmd.Int64()
num, err := cmd.Uint64()
num, err := cmd.Float32()
num, err := cmd.Float64()

ss, err := cmd.StringSlice()
ns, err := cmd.Int64Slice()
ns, err := cmd.Uint64Slice()
fs, err := cmd.Float32Slice()
fs, err := cmd.Float64Slice()
bs, err := cmd.BoolSlice()
```

## PubSub

go-redis allows to publish messages and subscribe to channels. It also automatically handles
reconnects.

To publish a message:

```go
err := rdb.Publish(ctx, "mychannel1", "payload").Err()
if err != nil {
	panic(err)
}
```

To subscribe to a channel:

```go
// There is no error because go-redis automatically reconnects on error.
pubsub := rdb.Subscribe(ctx, "mychannel1")

// Close the subscription when we are done.
defer pubsub.Close()
```

To receive a message:

```go
for {
	msg, err := pubsub.ReceiveMessage(ctx)
	if err != nil {
		panic(err)
	}

	fmt.Println(msg.Channel, msg.Payload)
}
```

But the simplest way is using a Go channel which is closed together with subscription:

```go
ch := pubsub.Channel()

for msg := range ch {
	fmt.Println(msg.Channel, msg.Payload)
}
```

## Conn

Conn represents a single Redis connection rather than a pool of connections. Prefer running commands
from Client unless there is a specific need for a continuous single Redis connection.

```go
cn := rdb.Conn(ctx)
defer cn.Close()

if err := cn.ClientSetName(ctx, "myclient").Err(); err != nil {
	panic(err)
}

name, err := cn.ClientGetName(ctx).Result()
if err != nil {
	panic(err)
}
fmt.Println("client name", name)
```

## See also

- [Pipelines, WATCH and transactions](pipelines.html)
- [Redis Lua scripting](lua-scripting.html)
