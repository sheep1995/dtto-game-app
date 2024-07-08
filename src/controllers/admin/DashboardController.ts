import { Request, Response } from 'express';
import { DashboardService } from '../../services/DashboardService';

export class DashboardController {
    static async getDashboardMetrics(req: Request, res: Response): Promise<void> {
        const { startDate, endDate } = req.query;

        try {
            const metrics = await DashboardService.getDashboardMetrics(startDate as string, endDate as string);
            res.status(200).json(metrics);
        } catch (error) {
            console.error('Failed to get dashboard metrics:', error);
            res.status(500).send('Internal server error.');
        }
    }

    static async getRealTimeMetrics(req: Request, res: Response): Promise<void> {
        const now = new Date();

        try {
            const userLogins = await DashboardService.getHourlyUserLogins(now);
            const revenue = await DashboardService.getHourlyRevenue(now);

            // Initialize an array to hold hourly data
            const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
                hour,
                uniqueLogins: 0,
                cumulativeRevenue: 0
            }));

            // Populate unique logins into hourly data
            userLogins.forEach(login => {
                hourlyData[login.hour].uniqueLogins = parseInt(login.uniqueLogins);
            });

            // Populate cumulative revenue into hourly data
            revenue.forEach(rev => {
                hourlyData[rev.hour].cumulativeRevenue = parseFloat(rev.cumulativeRevenue);
            });

            // Adjust sorting to start from the next hour
            const currentHour = now.getHours();
            const sortedHourlyData = [
                ...hourlyData.slice(currentHour + 1),
                ...hourlyData.slice(0, currentHour + 1)
            ];

            res.json({ hourlyData: sortedHourlyData });
        } catch (error) {
            console.error('Failed to fetch real-time metrics:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getSalesStatistics(req: Request, res: Response): Promise<void> {
        const { startDate, endDate } = req.query;

        try {
            const stats = await DashboardService.getSalesStatistics(startDate as string, endDate as string);
            res.status(200).json(stats);
        } catch (error) {
            console.error('Failed to get sales statistics:', error);
            res.status(500).send('Internal server error.');
        }
    }
}
