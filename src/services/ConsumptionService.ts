import { Between } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Transaction } from '../entities/Transaction';
import { Voucher } from '../entities/Voucher';
import { Compensation } from '../entities/Compensation';
import { User } from '../entities/User';
import { Item } from '../entities/Item';

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

        const userRepository = AppDataSource.getRepository(User);
        const transactionRepository = AppDataSource.getRepository(Transaction);
        const voucherRepository = AppDataSource.getRepository(Voucher);
        const compensationRepository = AppDataSource.getRepository(Compensation);
        const itemRepository = AppDataSource.getRepository(Item);

        // Fetch the user
        const user = await userRepository.findOne({ where: { userId } });

        if (!user) {
            throw new Error('User not found');
        }

        // Fetch transactions with item names
        const transactions = await transactionRepository.createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.item', 'item')
            .where('transaction.userId = :userId', { userId })
            .andWhere('transaction.createdTime BETWEEN :start AND :end', { start, end })
            .orderBy('transaction.createdTime', 'ASC')
            .select(['transaction.transactionId', 'item.itemName', 'transaction.createdTime', 'transaction.status'])
            .getMany();

        // Fetch vouchers with item names
        const vouchers = await voucherRepository.createQueryBuilder('voucher')
            .leftJoinAndSelect('voucher.item', 'item')
            .where('voucher.userId = :userId', { userId })
            .andWhere('voucher.createdTime BETWEEN :start AND :end', { start, end })
            .orderBy('voucher.createdTime', 'ASC')
            .select(['voucher.voucherId', 'item.itemName', 'voucher.createdTime'])
            .getMany();

        // Fetch compensations with item names
        const compensations = await compensationRepository.createQueryBuilder('compensation')
            .leftJoinAndSelect('compensation.item', 'item')
            .where('compensation.userId = :userId', { userId })
            .andWhere('compensation.createdTime BETWEEN :start AND :end', { start, end })
            .orderBy('compensation.createdTime', 'ASC')
            .select(['compensation.compensationId', 'item.itemName', 'compensation.createdTime'])
            .getMany();

        console.log('Transactions:', transactions);
        console.log('Vouchers:', vouchers);
        console.log('Compensations:', compensations);

        // Combine and map entities to desired output format
        let consumptions = [
            ...transactions.map(t => ({
                id: t.transactionId,
                type: 'iap',
                itemName: t.item.itemName,
                date: t.createdTime,
                status: t.status
            })),
            ...vouchers.map(v => ({
                id: v.voucherId,
                type: 'voucher',
                itemName: v.item.itemName,
                date: v.createdTime,
                status: 'success'
            })),
            ...compensations.map(c => ({
                id: c.compensationId,
                type: 'compensation',
                itemName: c.item.itemName,
                date: c.createdTime,
                status: 'success'
            }))
        ];

        if (sortBy === 'type') {
            const typePriority: { [key: string]: number } = {
                iap: 1,
                voucher: 2,
                compensation: 3
            };

            consumptions.sort((a, b) => typePriority[a.type] - typePriority[b.type]);
        }

        if (sortBy === 'date') {
            consumptions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }

        // Implement pagination after sorting
        const paginatedConsumptions = consumptions.slice(skip, skip + take);
        const allPages = Math.ceil(consumptions.length / pageSize);

        return { username: user.username, paginatedConsumptions, allPages };
    }
}
