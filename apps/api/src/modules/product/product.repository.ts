import { Injectable } from '@nestjs/common';
import { IProduct } from './interfaces/product.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus } from './enums/product-status.enum';

// Data access layer — replace with actual ORM (TypeORM / Prisma / Drizzle)
@Injectable()
export class ProductRepository {
  private products: IProduct[] = [];

  async findAll(): Promise<IProduct[]> {
    return this.products;
  }

  async findById(id: string): Promise<IProduct | null> {
    return this.products.find((p) => p.id === id) ?? null;
  }

  async create(dto: CreateProductDto): Promise<IProduct> {
    const product: IProduct = {
      id: crypto.randomUUID(),
      name: dto.name,
      description: dto.description,
      price: dto.price,
      status: dto.status ?? ProductStatus.DRAFT,
      createdAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<IProduct | null> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...dto };
    return this.products[index];
  }

  async delete(id: string): Promise<void> {
    this.products = this.products.filter((p) => p.id !== id);
  }
}
