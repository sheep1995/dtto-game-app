import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import { Purchase } from '../entities/Purchase';

export const purchaseProduct = async (req: Request, res: Response) => {
  const { userId, productId, quantity } = req.body;
  const userRepository = getRepository(User);
  const productRepository = getRepository(Product);
  const purchaseRepository = getRepository(Purchase);

  const user = await userRepository.findOne(userId);
  const product = await productRepository.findOne(productId);

  if (!product || product.stock < quantity) {
    return res.status(400).send('Product not available');
  }

  const purchase = new Purchase();
  purchase.user = user;
  purchase.product = product;
  purchase.quantity = quantity;
  purchase.total = product.price * quantity;

  await purchaseRepository.save(purchase);

  product.stock -= quantity;
  await productRepository.save(product);

  res.send('Purchase successful');
};
