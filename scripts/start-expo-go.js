const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const qrcode = require('qrcode-terminal');

const PORT = process.env.EXPO_PORT || '8081';

function getLanAddress() {
  const interfaces = os.networkInterfaces();
  const preferredNames = ['en0', 'en1', 'Wi-Fi', 'Ethernet'];

  for (const name of preferredNames) {
    const address = interfaces[name]?.find((entry) => entry.family === 'IPv4' && !entry.internal);
    if (address) return address.address;
  }

  for (const entries of Object.values(interfaces)) {
    const address = entries?.find((entry) => entry.family === 'IPv4' && !entry.internal);
    if (address) return address.address;
  }

  return 'localhost';
}

const expoUrl = `exp://${getLanAddress()}:${PORT}`;
const expoCli = path.join(__dirname, '..', 'node_modules', 'expo', 'bin', 'cli');

console.log(`\nDirect Expo Go URL: ${expoUrl}`);
qrcode.generate(expoUrl, { small: true });
console.log('Scan this QR from Expo Go.\n');

const child = spawn(process.execPath, [expoCli, 'start', '--go', '--clear', '--port', PORT], {
  cwd: path.join(__dirname, '..'),
  env: {
    ...process.env,
    EXPO_NO_QR_CODE: '1',
  },
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
