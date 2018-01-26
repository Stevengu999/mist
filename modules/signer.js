const spawn = require('child_process').spawn;
const path = require('path')
const logger = require('./utils/logger');
const signerLog = logger.create('Signer');

class Signer {
	get chainId() {
		switch (store.getState().nodes.network) {
			case 'main':
				return 1;
			case 'test':
				// fall-through
			case 'ropsten':
				return 3;
			case 'rinkeby':
				return 4;
			case 'kovan':
				return 42;
		}
	}

	get keystorePath() {
		const network = store.getState().nodes.network;
		let basePath;
		switch (process.platform) {
			case 'darwin':
				basePath = path.join(os.homedir(), 'Library', 'Ethereum');
				break;
			case 'sunos':
				// fall-through
			case 'linux':
				basePath = path.join(os.homedir(), '.ethereum');
				break;
			case 'win32':
				basePath = path.join(process.env.APPDATA, 'Ethereum');
        }

		if (network === 'main') {
			return path.join(basePath, 'keystore');
		} else {
			return path.join(basePath, 'testnet', 'keystore');
		}
	}

    sign(request) {
        this.signer = spawn('../signerBin/signer', ['-keystore', this.keystorePath, '-chainid', this.chainId]);

        signer.stdout.on('data', (data) => {
            response = JSON.parse(`${data}`);
            signerLog.log(`signer response: ${response}`);
        })

        signer.stderr.on('data', (data) => {
            signerLog.error(`stderr: ${data}`);
        });

        // Example request:
		// request.method = 'account_signTransaction';
		// request.params = [createdAccountAddress, passwd, {
			// nonce: "0x0",
			// gasPrice: "0x1234",
			// gas: "0x55555",
			// value: "0x1234",
			// input: "0xabcd",
			// to: "0x07a565b7ed7d7a678680a4c162885bedbb695fe0"
		// }];

        this.signer.stdin.write(request);	
    }
}

export default new Signer();
