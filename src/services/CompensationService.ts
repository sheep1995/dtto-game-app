import { AppDataSource } from '../config/data-source';
import { UserItemService } from './UserItemService';
import { Compensation } from '../entities/Compensation';

interface CompensateItemDTO {
    userId: string;
    itemId: string;
    quantity: number;
    staffId: string;
}

export class CompensationService {
    static async generateCompensationId(): Promise<string> {
        const compensationRepository = AppDataSource.getRepository(Compensation);

        // Get the last inserted compensationId
        const lastCompensation = await compensationRepository.find({
            order: {
                createdTime: 'DESC'
            },
            take: 1
        });

        let nextId = 'T100000001';
        if (lastCompensation.length > 0) {
            const lastId = lastCompensation[0].compensationId;
            const numberPart = parseInt(lastId.slice(1), 10) + 1;
            nextId = 'T' + numberPart.toString().padStart(9, '0');
        }

        return nextId;
    }

    static async compensateItem(data: CompensateItemDTO): Promise<void> {
        const { userId, itemId, quantity, staffId } = data;

        try {
            await AppDataSource.transaction(async transactionalEntityManager => {
                // Update the user items
                await UserItemService.addItemToUser(userId, itemId, quantity, transactionalEntityManager);

                const compensationId = await this.generateCompensationId();
                
                // Log the compensation
                const compensationRepository = transactionalEntityManager.getRepository(Compensation);
                const compensationRecord = compensationRepository.create({
                    compensationId,
                    userId,
                    itemId,
                    quantity,
                    staffId,
                });
                await compensationRepository.save(compensationRecord);
            });
        } catch (error) {
            console.error('Failed to compensate item:', error);
            throw new Error('Transaction failed, compensation could not be processed.');
        }
    }
}
