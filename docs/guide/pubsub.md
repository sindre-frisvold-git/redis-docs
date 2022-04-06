---
title: PubSub
---

# Golang Redis PubSub

go-redis allows to publish messages and subscribe to channels. It also automatically re-connects to
Redis Server when there is a network error.

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

But the simplest way is using a Go channel which is closed together with the subscription:

```go
ch := pubsub.Channel()

for msg := range ch {
	fmt.Println(msg.Channel, msg.Payload)
}
```
