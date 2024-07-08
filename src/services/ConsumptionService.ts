import { Between } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Transaction } from '../entities/Transaction';
import { Voucher } from '../entities/Voucher';
import { Compensation } from '../entities/Compensation';

interface GetConsumptionsParams {
    userId: string;
    startDate: string;
    endDate: string;
    sortBy: string;
    page: number;
    pageSize: number;
}

export class ConsumptionService {
    static async getConsumptions(params: GetConsumptionsParams): Promise<any> {
        const { userId, startDate, endDate, sortBy, page, pageSize } = params;
        const take = pageSize;
        const skip = (page - 1) * pageSize;

        const start = new Date(startDate);
        const end = new Date(endDate);

        console.log(`Querying consumptions for userId: ${userId}, between ${start} and ${end}, sortBy: ${sortBy}, page: ${page}, pageSize: ${pageSize}`);

        const transactionRepository = AppDataSource.getRepository(Transaction);
        const voucherRepository = AppDataSource.getRepository(Voucher);
        const compensationRepository = AppDataSource.getRepository(Compensation);

        const transactions = await transactionRepository.find({
            where: { userId, createdTime: Between(start, end) },
            order: { createdTime: 'ASC' }
        });

        const vouchers = await voucherRepository.find({
            where: { userId, createdTime: Between(start, end) },
            order: { createdTime: 'ASC' }
        });

        const compensations = await compensationRepository.find({
            where: { userId, createdTime: Between(start, end) },
            order: { createdTime: 'ASC' }
        });

        console.log('Transactions:', transactions);
        console.log('Vouchers:', vouchers);
        console.log('Compensations:', compensations);

        let consumptions = [...transactions, ...vouchers, ...compensations];

        if (sortBy === 'type') {
            const typePriority: { [key: string]: number } = {
                Transaction: 1,
                Voucher: 2,
                Compensation: 3
            };

            consumptions.sort((a, b) => {
                const typeA = a.constructor.name;
                const typeB = b.constructor.name;

                return typePriority[typeA] - typePriority[typeB];
            });
        }

        if (sortBy === 'date') {
            consumptions.sort((a, b) => new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime());
        }

        // Implement pagination after sorting
        const paginatedConsumptions = consumptions.slice(skip, skip + take);

        return paginatedConsumptions;
    }
}
