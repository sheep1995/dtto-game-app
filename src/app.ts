import express, { Application, Request, Response, NextFunction } from 'express';
import { router as appRoutes } from './routes/app/index';
import { router as adminRoutes } from './routes/admin/index';
import logger from './logger';
import authMiddleware from './middlewares/auth';
import adminAuthMiddleware from './middlewares/adminAuth';
import { swaggerUi, swaggerSpec } from './swagger';
import { logMiddleware } from './middlewares/logMiddleware';

class App {
	public app: Application;

	constructor() {
		this.app = express();
		this.config();
		this.routes();
		this.errorHandling();
	}
	
	private config(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));

		this.app.use((req: Request, res: Response, next: NextFunction) => {
			const logData = {
				method: req.method,
				url: req.url,
				query: req.query,
				body: req.body,
				headers: req.headers,
				ip: req.ip,
				userAgent: req.get('User-Agent') || '',
				userInfo: req.user
			};
			logger.info(`Request: ${req.method} ${req.url}`, logData);
			next();
		});

		this.app.use(logMiddleware);  // Use the logging middleware

		// Swagger UI route without auth middleware
		this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	}

	private routes(): void {
		// Apply admin routes with adminAuthMiddleware
        this.app.use('/api/admin', adminAuthMiddleware, adminRoutes);

        // Apply general authMiddleware to all /api routes excluding /api/admin
        this.app.use('/api/app', authMiddleware, appRoutes);
	}

	private errorHandling(): void {
        // Catch 404 and forward to error handler
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const error = new Error('Not Found');
            res.status(404).json({
                message: error.message,
                status: 404
            });
        });

        // Error handler
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            const status = err.status || 500;
            res.status(status).json({
                message: err.message,
                status: status
            });
        });
    }
}

export default new App().app;
