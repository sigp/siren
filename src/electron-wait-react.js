// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const net = require('net');
// eslint-disable-next-line no-undef
const port = process.env.PORT ? (process.env.PORT - 100) : 3000;

// eslint-disable-next-line no-undef
process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

let startedElectron = false;

const tryConnection = () => client.connect({port}, () => {
        client.end();
        if(!startedElectron) {
            startedElectron = true;
          // eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
            const exec = require('child_process').exec;
            exec('npm run electron');
        }
    }
);

tryConnection();

client.on('error', () => {
    setTimeout(tryConnection, 1000);
});