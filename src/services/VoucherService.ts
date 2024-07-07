import { AppDataSource } from '../config/data-source';
import { Voucher } from '../entities/Voucher';
import { UserItemService } from './UserItemService';

interface RedeemVoucherDTO {
    userId: string;
    itemId: string;
}

interface PurchaseContent {
    itemId: string;
    quantity: number;
}

export class VoucherService {
    static async generateVoucherId(): Promise<string> {
        const compensationRepository = AppDataSource.getRepository(Voucher);

        // Get the last inserted compensationId
        const lastCompensation = await compensationRepository.find({
            order: {
                createdTime: 'DESC'
            },
            take: 1
        });

        let nextId = 'C100000001';
        if (lastCompensation.length > 0) {
            const lastId = lastCompensation[0].voucherId;
            const numberPart = parseInt(lastId.slice(1), 10) + 1;
            nextId = 'C' + numberPart.toString().padStart(9, '0');
        }

        return nextId;
    }

    static async redeemVoucher(userId: string, itemId: string, contents: PurchaseContent[]) {

        try {
            await AppDataSource.transaction(async transactionalEntityManager => {

                for (const content of contents) {
                    await UserItemService.addItemToUser(userId, content.itemId, content.quantity, transactionalEntityManager);
                }

                const voucherId = await this.generateVoucherId();

                const voucherRepository = transactionalEntityManager.getRepository(Voucher);
                const voucherRecord = voucherRepository.create({
                    voucherId,
                    userId,
                    itemId,
                });
                await voucherRepository.save(voucherRecord);

            });
        } catch (error) {
            console.error('Failed to redeem voucher:', error);
            throw new Error('Transaction failed, voucher redemption could not be processed.');
        }
    }
}
