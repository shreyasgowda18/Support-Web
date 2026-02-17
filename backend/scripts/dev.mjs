import { spawn } from 'node:child_process';

const children = [];

function run(name, cmd) {
  const child = spawn(cmd, {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`[backend:${name}] exited with code ${code}`);
      shutdown(code);
    }
  });

  children.push(child);
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

// Initial build so dist/index.js exists before node --watch starts.
const initialBuild = spawn('npm run build', { stdio: 'inherit', shell: true, env: process.env });
initialBuild.on('exit', (code) => {
  if (code && code !== 0) {
    console.error(`[backend:build] initial build failed with code ${code}`);
    process.exit(code);
  }

  run('tsc-watch', 'npm run dev:build');
  run('node-watch', 'npm run dev:serve');
});
