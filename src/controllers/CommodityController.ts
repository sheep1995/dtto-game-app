import { Request, Response } from 'express';
import { AppDataSource } from "../config/data-source";
import { Item } from "../entities/Item";

export class CommodityController {

	static getAllCommodities = async (req: Request, res: Response) => {
        const itemRepository = AppDataSource.getRepository(Item);
        const currencyItems = await itemRepository.find({
            where: {
                itemType: "commodity"
            },
			select: ["itemId", "itemName", "itemAttributes", "itemDescription"] // 指定要返回的字段
        });

		// 格式化每个项以自定义返回的数据结构
        const formattedItems = currencyItems.map(item => ({
            itemId: item.itemId,
            itemName: item.itemName,
            price: item.itemAttributes.priceInCoins,
            contents: item.itemAttributes.contents,
            description: item.itemDescription
        }));

        res.send(formattedItems);
    };

	static getAllCurrencyCommodities = async (req: Request, res: Response) => {
        const itemRepository = AppDataSource.getRepository(Item);
        const currencyItems = await itemRepository.find({
            where: {
                itemType: "commodity_currency"
            },
			select: ["itemId", "itemName", "itemAttributes", "itemDescription"] // 指定要返回的字段
        });

		// 格式化每个项以自定义返回的数据结构
        const formattedItems = currencyItems.map(item => ({
            itemId: item.itemId,
            itemName: item.itemName,
            price: item.itemAttributes.price,
            coinAmount: item.itemAttributes.coinAmount,
            description: item.itemDescription
        }));

        res.send(formattedItems);
    };
}
