import { ProductStatus } from '../enums/product-status.enum';

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  createdAt: Date;
}
