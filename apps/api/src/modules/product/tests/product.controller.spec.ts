import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { ProductStatus } from '../enums/product-status.enum';
import { ProductResponseDto } from '../dto/product-response.dto';

const mockResponse: ProductResponseDto = {
  id: '1',
  name: 'Test Product',
  description: 'A test product',
  price: 9.99,
  status: ProductStatus.ACTIVE,
  createdAt: new Date(),
};

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockResponse]),
            findOne: jest.fn().mockResolvedValue(mockResponse),
            create: jest.fn().mockResolvedValue(mockResponse),
            update: jest.fn().mockResolvedValue(mockResponse),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll returns array of products', async () => {
    const result = await controller.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test Product');
  });
});
