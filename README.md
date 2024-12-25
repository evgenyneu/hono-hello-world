# Hono Hello World Benchmark

This is a simple Hono (JavaScript) web app that returns "Hello, World!" response, made for benchmarking performance and resource usage and comparing it with [Axum (Rust)](https://github.com/evgenyneu/axum-hello-world) benchmark.

## Build

```sh
npm install
npm run build
```

Run:

```sh
npm start
```


## Deploy

```sh
npm run build
ssh lorange "mkdir -p ~/hono-hello-world"
scp package.json lorange:~/hono-hello-world/
scp package-lock.json lorange:~/hono-hello-world/
scp build/index.js lorange:~/hono-hello-world/
```

Open deployment directory:

```sh
ssh lorange
cd ~/hono-hello-world
npm install --production
```

Run with one node process:

```sh
node index.js
```

Run with clustering (utilize all CPU cores):

```sh
node cluster.js
```

## Benchmarking


### Before (after reboot)

* RAM usage: 237M
* CPU Load average (over 1 minute): 0.06

### Server running idle

* Single node process: `node server.js`:

* RAM usage: 271M
* CPU Load average (over 1 minute): 0.02

Clustering (utilize all CPU cores): `node cluster.js`:

* RAM usage: 535M
* CPU Load average (over 1 minute): 0.07

### Stress test #1

With one node process: `node server.js`

```sh
wrk -t10 -c1000 -d600s http://192.168.20.25:3000/
```

* RAM usage: 464M
* CPU Load average (over 5 minutes): 0.99

Results:

```
  10 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   637.91ms  199.62ms   1.93s    75.44%
    Req/Sec   158.71    102.28   580.00     66.03%
  726619 requests in 10.00m, 185.02MB read
  Socket errors: connect 0, read 256, write 0, timeout 889
Requests/sec:   1210.83
Transfer/sec:    315.71KB
```

### Stress test #2 (two processes)

Two Node.js processes: `node cluster.js`

```sh
wrk -t10 -c1000 -d600s http://192.168.20.25:3000/
```

* RAM usage: 689MB
* CPU Load average (over 1 minute): 5.03

Results:

```
  10 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   418.90ms   71.75ms   1.95s    88.40%
    Req/Sec   244.33    155.53   840.00     65.74%
  1332659 requests in 10.00m, 339.34MB read
  Socket errors: connect 0, read 0, write 0, timeout 917
Requests/sec:   2220.73
Transfer/sec:    579.04KB
```

### Stress test #3 (four processes)

Four Node.js processes: `node cluster.js`

```sh
wrk -t10 -c1000 -d600s http://192.168.20.25:3000/
```

* RAM usage: 1.05G
* CPU Load average (over 1 minute): 5.03

Results:

```
  10 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   289.49ms   28.98ms   1.96s    83.68%
    Req/Sec   338.89    122.67     0.95k    70.65%
  2017560 requests in 10.00m, 513.73MB read
  Socket errors: connect 0, read 0, write 0, timeout 806
Requests/sec:   3362.04
Transfer/sec:      0.86MB
```

### Stress test #4 (eight processes)

Eight Node.js processes: `node cluster.js`

```sh
wrk -t10 -c1000 -d600s http://192.168.20.25:3000/
```

* RAM usage: 1.68G
* CPU Load average (over 1 minute): 10.30

Results:

```
  10 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   314.74ms  230.52ms   2.00s    83.49%
    Req/Sec   345.04     93.39   810.00     69.73%
  2053154 requests in 10.00m, 522.80MB read
  Socket errors: connect 0, read 0, write 0, timeout 805
Requests/sec:   3421.41
Transfer/sec:      0.87MB
```



## Hardware

The web server was run on Orange Pi 5 Max with 16 GB RAM and 1 TB NVMe SSD running Ubuntu 24.04 LTS, Node.js v22.12.0. The `wrk` benchmark command was run on a Desktop PC (12600K, 32 GB RAM), running Ubuntu 24.04 LTS. Both machines were connected to NetComm NF18ACV router via 1 Gbps Ethernet cables.

## Server response

```sh
curl -v http://192.168.20.25:3000/
*   Trying 192.168.20.25:3000...
* Connected to 192.168.20.25 (192.168.20.25) port 3000
> GET / HTTP/1.1
> Host: 192.168.20.25:3000
> User-Agent: curl/8.5.0
> Accept: */*
>
< HTTP/1.1 200 OK
< vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch
< content-type: text/plain
< Date: Wed, 25 Dec 2024 04:17:56 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Transfer-Encoding: chunked
<
* Connection #0 to host 192.168.20.25 left intact
Hello, World!
```

Response size:

```sh
curl -s -o /dev/null -w "%{size_download}\n%{size_header}\n" http://192.168.20.25:3000/
13
244
```
