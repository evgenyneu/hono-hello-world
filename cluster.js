import cluster from 'node:cluster';
import { cpus } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Launching ${numCPUs} workers`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const appPath = new URL('./build/index.js', import.meta.url);
  import(appPath);
}
