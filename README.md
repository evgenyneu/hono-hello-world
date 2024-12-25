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
ssh lorange "mkdir -p ~/hono-hello-world/build"
scp package.json lorange:~/hono-hello-world/
scp package-lock.json lorange:~/hono-hello-world/
scp cluster.js lorange:~/hono-hello-world/
scp build/index.js lorange:~/hono-hello-world/build/
```

Open deployment directory:

```sh
ssh lorange
cd ~/hono-hello-world
npm install --production
```

Run with one node process:

```sh
node build/index.js
```

Run with clustering (utilize all CPU cores):

```sh
node cluster.js
```

## Benchmarking


### After reboot

* RAM usage: 233M
* CPU Load average (over 1 minute): 0.06

### Server running idle

* Single node process: `node build/index.js`:

* RAM usage: 250M
* CPU Load average (over 1 minute): 0.03

Clustering (utilize all CPU cores): `node cluster.js`:

* RAM usage: 350M
* CPU Load average (over 1 minute): 0.05

### Stress test #1

With one node process: `node build/index.js`

```sh
wrk -t10 -c1000 -d600s http://192.168.20.25:3000/
```

* RAM usage: 310M
* CPU Load average (over 1 minutes): 1.14

Results:

```
  10 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   113.73ms   18.28ms   2.00s    93.51%
    Req/Sec     0.86k   183.78     2.56k    85.13%
  5108140 requests in 10.00m, 1.22GB read
  Socket errors: connect 0, read 0, write 0, timeout 837
Requests/sec:   8512.51
Transfer/sec:      2.09MB
```

### Stress test #2 (six processes)

Six Node.js processes: `node cluster.js`

```sh
wrk -t10 -c1000 -d600s http://192.168.20.25:3000/
```

* RAM usage: 581M
* CPU Load average (over 1 minute): 7.37

Results:

```
  10 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    40.50ms   30.44ms   1.98s    88.73%
    Req/Sec     2.66k   381.37     5.16k    77.68%
  15848237 requests in 10.00m, 3.79GB read
  Socket errors: connect 0, read 0, write 0, timeout 521
Requests/sec:  26409.34
Transfer/sec:      6.47MB
```


### Stress test #3 (eight processes)

Eight Node.js processes: `node cluster.js`

```sh
wrk -t10 -c1000 -d600s http://192.168.20.25:3000/
```

* RAM usage: 682M
* CPU Load average (over 1 minute): 9.19

Results:

```
wrk -t10 -c1000 -d600s http://192.168.20.25:3000/
Running 10m test @ http://192.168.20.25:3000/
  10 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    53.70ms  152.84ms   2.00s    97.62%
    Req/Sec     2.85k   536.14     4.82k    70.44%
  17003588 requests in 10.00m, 4.07GB read
  Socket errors: connect 0, read 0, write 0, timeout 26650
Requests/sec:  28334.61
Transfer/sec:      6.94MB
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
> User-Agent: curl/8.7.1
> Accept: */*
>
* Request completely sent off
< HTTP/1.1 200 OK
< content-type: text/plain;charset=UTF-8
< x-filler: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
< content-length: 13
< Date: Wed, 25 Dec 2024 09:32:34 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
* Connection #0 to host 192.168.20.25 left intact
Hello, World
```

Response size:

```sh
curl -s -o /dev/null -w "%{size_download}\n%{size_header}\n" http://192.168.20.25:3000/
13
244
```
