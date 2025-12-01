import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..', '..');
const envPath = path.join(projectRoot, '.env');

const defaultEnv = `MONGODB_URI=mongodb://127.0.0.1:27017/alumni_network
JWT_SECRET=devsecret
PORT=4000
`;

function run() {
	try {
		if (fs.existsSync(envPath)) {
			console.log('.env already exists, skipping creation.');
			return;
		}
		fs.writeFileSync(envPath, defaultEnv, { encoding: 'utf8' });
		console.log('Created .env with default development values.');
	} catch (err) {
		console.error('Failed to create .env:', err);
		process.exit(1);
	}
}

run();


