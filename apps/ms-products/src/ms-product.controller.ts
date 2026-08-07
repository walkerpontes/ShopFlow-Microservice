import { Controller } from '@nestjs/common';
import { MsProductService } from './ms-product.service';
import { MessagePattern } from '@nestjs/microservices';
import type {
  ChangeStatus,
  ProductDto,
  ProductPatchDefaultDto,
} from '@/lib/dto/ProductDto';

@Controller()
export class MsProductController {
  constructor(private readonly msProductService: MsProductService) {}

  @MessagePattern('prod_all')
  async All() {
    return this.msProductService.All();
  }

  @MessagePattern('prod_id')
  async ProductId(id: number) {
    return this.msProductService.FindId(id);
  }

  @MessagePattern('prod_create')
  async Create(product: ProductDto) {
    return this.msProductService.Create(product);
  }

  @MessagePattern('prod_del')
  async Delete(id: number) {
    return this.msProductService.Delete(id);
  }

  @MessagePattern('prod_status')
  async Change(change: ChangeStatus) {
    return this.msProductService.Change(change);
  }

  @MessagePattern('prod_patch')
  async Patch(prod: ProductPatchDefaultDto) {
    return this.msProductService.Patch(prod);
  }
}
