import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import mongoose from 'mongoose';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			imgSrc: ["'self'", "data:", "https://randomuser.me"],
			scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
			styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
			fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
		},
	},
}));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: false }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Serve static HTML files
app.use(express.static(path.join(__dirname, '..')));

// Swagger docs temporarily disabled
// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

// Health endpoint returning server + DB status
app.get('/api/health', async (req, res) => {
	try {
		const state = mongoose.connection.readyState; // 0 = disconnected, 1 = connected
		let dbInfo = { readyState: state };
		try {
			const admin = mongoose.connection.db.admin();
			const ping = await admin.ping();
			dbInfo.ping = ping;
		} catch (e) {
			dbInfo.pingError = String(e.message || e);
		}
		return res.json({ ok: true, server: 'ok', db: dbInfo });
	} catch (err) {
		return res.status(500).json({ ok: false, error: err.message || String(err) });
	}
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
