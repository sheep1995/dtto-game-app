import { AppDataSource } from '../config/data-source';
import { Transaction } from '../entities/Transaction';

interface CreateTransactionDTO {
    userId: string;
    itemId: string;
    price: number;
    status: string;
    purchaseToken: string;
}

export class TransactionService {
    static async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
        const transactionRepository = AppDataSource.getRepository(Transaction);
        const transaction = transactionRepository.create(data);
        await transactionRepository.save(transaction);
        return transaction;
    }
}
