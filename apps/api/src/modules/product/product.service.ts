import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { IProduct } from './interfaces/product.interface';
import { PRODUCT_NOT_FOUND } from './constants/product.constants';

// Business logic only — no direct DB calls, no controller concerns
@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findAll();
    return products.map((p) => this.toResponseDto(p));
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }
    return this.toResponseDto(product);
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.create(dto);
    return this.toResponseDto(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.update(id, dto);
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }
    return this.toResponseDto(product);
  }

  async remove(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  private toResponseDto(product: IProduct): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      status: product.status,
      createdAt: product.createdAt,
    };
  }
}
