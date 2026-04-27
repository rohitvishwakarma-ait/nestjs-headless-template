import { ProductStatus } from '../enums/product-status.enum';

export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  createdAt: Date;
}
