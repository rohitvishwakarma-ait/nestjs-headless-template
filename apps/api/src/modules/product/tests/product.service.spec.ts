import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from '../product.service';
import { ProductRepository } from '../product.repository';
import { ProductStatus } from '../enums/product-status.enum';
import { IProduct } from '../interfaces/product.interface';

const mockProduct: IProduct = {
  id: '1',
  name: 'Test Product',
  description: 'A test product',
  price: 9.99,
  status: ProductStatus.ACTIVE,
  createdAt: new Date(),
};

describe('ProductService', () => {
  let service: ProductService;
  let repository: jest.Mocked<ProductRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockProduct]),
            findById: jest.fn().mockResolvedValue(mockProduct),
            create: jest.fn().mockResolvedValue(mockProduct),
            update: jest.fn().mockResolvedValue(mockProduct),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get(ProductRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns mapped response DTOs', async () => {
    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(mockProduct.id);
  });

  it('findOne throws NotFoundException when product missing', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(service.findOne('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
