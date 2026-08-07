import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { MsGatewayService } from './ms-gateway.service';
import { SignIn, SignUp, UserPatchDto } from '@/lib/dto/AuthDto';
import { CreateOrderDto } from '@/lib/dto/OrderDto';
import { ResultPay } from '@/lib/dto/PaymentDto';
import {
  ChangeStatus,
  ProductDto,
  ProductPatchDto,
} from '@/lib/dto/ProductDto';
import { Roles } from '@/lib/decorator/roles.decorator';
import { type PayloadJwt, RolesUser } from '@/lib/dto/AuthDto';
import { IsPublic } from '@/lib/decorator/public.decorator';
import { CurrentUser } from '@/lib/decorator/user.decorator';
import { ChangeStock } from '@/lib/dto/StockDto';
import { Message } from '@/lib/dto/MessageDto';
import type { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth('acess-token')
export class MsGatewayController {
  constructor(private readonly msGatewayService: MsGatewayService) {}

  @Get('/tst')
  @Roles(RolesUser.ADMIN)
  test(
    @CurrentUser() user: PayloadJwt,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = new Message(user);
    res.status(result.statusCode);
    return result;
  }

  //***************** Auth ***********************

  @Post('/login')
  @IsPublic()
  async Login(
    @Body() login: SignIn,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.msGatewayService.Login(login);
    res.status(result.statusCode);
    return result;
  }

  @Post('/register')
  @IsPublic()
  async Register(
    @Body() register: SignUp,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.msGatewayService.Register(register);
    res.status(result.statusCode);
    return result;
  }
  @Get('/user')
  async FindUserAll(@Res({ passthrough: true }) res: Response) {
    const result = await this.msGatewayService.FindUserAll();
    res.status(result.statusCode);
    return result;
  }

  @Get('/user/:id')
  async FindUserId(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.msGatewayService.FindUserId(id);
    res.status(result.statusCode);
    return result;
  }

  @Patch('/user/:id')
  async UserPatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UserPatchDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.msGatewayService.UserPatch({ id, user });
    res.status(result.statusCode);
    return result;
  }

  //***************** Product ***********************

  @Get('/product')
  async ProductAll(@Res({ passthrough: true }) res: Response) {
    const result = await this.msGatewayService.ProductAll();
    res.status(result.statusCode);
    return result;
  }

  @Get('/product/:id')
  async ProductId(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.msGatewayService.ProductId(id);
    res.status(result.statusCode);
    return result;
  }

  @Post('/product')
  async CreateProduct(
    @Body() product: ProductDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.msGatewayService.CreateProduct(product);
    res.status(result.statusCode);
    return result;
  }

  @Patch('/product/:id')
  async ProductPatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() product: ProductPatchDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.msGatewayService.ProductPatch({ id, product });
    res.status(result.statusCode);
    return result;
  }

  @Delete('/product/:id')
  async DeleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.msGatewayService.DeleteProduct(id);
    res.status(result.statusCode);
    return result;
  }

  @Post('/product/status')
  async ChangeStatusProduct(
    @Body() change: ChangeStatus,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.msGatewayService.ChangeStatusProduct(change);
    res.status(result.statusCode);
    return result;
  }
  @Post('/product/quantity')
  async ChangeQuantityProduct(
    @Body() change: ChangeStock,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.msGatewayService.ChangeQuantityProduct(change);
    res.status(result.statusCode);
    return result;
  }

  //***************** Order ***********************

  @Get('/order')
  async OrderAll(@Res({ passthrough: true }) res: Response) {
    const result = await this.msGatewayService.OrderAll();
    res.status(result.statusCode);
    return result;
  }

  @Get('/order/:id')
  async OrderId(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.msGatewayService.OrderId(id);
    res.status(result.statusCode);
    return result;
  }

  @Post('/order/create')
  async CreateOrder(
    @Body() order: CreateOrderDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.msGatewayService.CreateOrder(order);
    res.status(result.statusCode);
    return result;
  }

  //***************** Payment ***********************

  // Simulation of bank webhooks for payments
  @Post('/payment/sucess')
  async PaymentSucess(
    @Body() result: ResultPay,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.msGatewayService.PaymentSucess(result);
    res.status(response.statusCode);
    return response;
  }
  @Post('/payment/failed')
  async PaymentFail(
    @Body() result: ResultPay,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.msGatewayService.PaymentFail(result);
    res.status(response.statusCode);
    return response;
  }
}
