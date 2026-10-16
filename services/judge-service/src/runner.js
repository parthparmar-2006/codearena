import { spawn } from 'node:child_process';

// Child processes get a bare environment so secrets such as INTERNAL_TOKEN never reach user code.
const SAFE_ENV = { PATH: '/usr/local/bin:/usr/bin:/bin' };
const MAX_STDERR_BYTES = 64 * 1024;

export function runProcess(command, args, { cwd, input = '', timeoutMs, maxOutputBytes }) {
  return new Promise((resolve, reject) => {
    const start = process.hrtime.bigint();
    const child = spawn(command, args, { cwd, env: SAFE_ENV, detached: true });
    const stdout = [];
    let stdoutBytes = 0;
    let stderr = '';
    let timedOut = false;
    let truncated = false;

    const killGroup = () => {
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch {
        // The process group has already exited.
      }
      child.stdout.destroy();
      child.stderr.destroy();
    };

    const timer = setTimeout(() => {
      timedOut = true;
      killGroup();
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      if (truncated) return;
      stdoutBytes += chunk.length;
      if (stdoutBytes > maxOutputBytes) {
        truncated = true;
        killGroup();
        return;
      }
      stdout.push(chunk);
    });
    child.stderr.on('data', (chunk) => {
      if (stderr.length < MAX_STDERR_BYTES) stderr += chunk;
    });

    // The program may exit without reading all of its input.
    child.stdin.on('error', () => {});
    child.stdin.end(input);

    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on('close', (exitCode, signal) => {
      clearTimeout(timer);
      // Also stops any background processes the program left running.
      killGroup();
      resolve({
        exitCode,
        signal,
        stdout: Buffer.concat(stdout).toString('utf8'),
        stderr,
        timedOut,
        truncated,
        timeMs: Math.round(Number(process.hrtime.bigint() - start) / 1e6),
      });
    });
  });
}
