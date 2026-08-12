import { Inject, Injectable } from '@nestjs/common';
// import SignUp from 'apps/lib/dto/AuthDto';
// import OrderDto from 'apps/lib/dto/OrderDto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Message } from '@/lib/dto/MessageDto';
import DefaultErro from '@/lib/error/Error';
import {
  CreateOrderDto,
  OrderDto,
  OrderFailedDto,
  OrderProcessDto,
} from '@/lib/dto/OrderDto';
import { ResultPay } from '@/lib/dto/PaymentDto';
import {
  ChangeStatus,
  ProductDto,
  ProductPatchDefaultDto,
  ResultProduct,
} from '@/lib/dto/ProductDto';
import { ChangeStock, StockDto } from '@/lib/dto/StockDto';
import {
  SignIn,
  SignUp,
  Token,
  UserDto,
  UserPatchDefaultDto,
} from '@/lib/dto/AuthDto';

@Injectable()
export class MsGatewayService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy,
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy,
    @Inject('STOCK_SERVICE') private readonly stockClient: ClientProxy,
    @Inject('STOCK_SERVICE_RMQ') private readonly stockRmqClient: ClientProxy,
  ) {}

  // *********** Auth Services ************

  async Login(dto: SignIn): Promise<Message<Token>> {
    const result = await firstValueFrom(
      this.authClient.send<Token>('login', dto).pipe(DefaultErro()),
    );
    return new Message(result, undefined, 201);
  }

  async Register(register: SignUp): Promise<Message<UserDto>> {
    const result = await firstValueFrom(
      this.authClient.send<UserDto>('register', register).pipe(DefaultErro()),
    );
    return new Message(result, 'User created', 201);
  }

  async FindUserAll(): Promise<Message<UserDto[]>> {
    const result = await firstValueFrom(
      this.authClient.send<UserDto[]>('user_all', []).pipe(DefaultErro()),
    );
    return new Message(result);
  }

  async FindUserId(id: number): Promise<Message<UserDto>> {
    const result = await firstValueFrom(
      this.authClient.send<UserDto>('user_id', id).pipe(DefaultErro()),
    );
    return new Message(result);
  }

  async UserPatch(user: UserPatchDefaultDto) {
    const result = await firstValueFrom(
      this.authClient.send<UserDto>('user_patch', user),
    );

    return new Message(result);
  }

  // *********** Product Services ************

  async ChangeStatusProduct(
    change: ChangeStatus,
  ): Promise<Message<ResultProduct>> {
    const result = await firstValueFrom(
      this.productClient
        .send<ResultProduct>('prod_status', change)
        .pipe(DefaultErro()),
    );
    return new Message(result, undefined, 201);
  }
  async DeleteProduct(id: number): Promise<Message<ResultProduct>> {
    const result = await firstValueFrom(
      this.productClient
        .send<ResultProduct>('prod_del', id)
        .pipe(DefaultErro()),
    );
    return new Message(result);
  }
  async CreateProduct(product: ProductDto): Promise<Message<ResultProduct>> {
    const result = await firstValueFrom(
      this.productClient
        .send<ResultProduct>('prod_create', product)
        .pipe(DefaultErro()),
    );
    this.stockRmqClient.emit('stock_create', {
      productId: result.id,
      quantidade: product.quantidade,
    });
    return new Message(result, undefined, 201);
  }
  async ProductId(id: number): Promise<Message<ResultProduct>> {
    const result = await firstValueFrom(
      this.productClient.send<ResultProduct>('prod_id', id).pipe(DefaultErro()),
    );
    return new Message(result);
  }
  async ProductAll(): Promise<Message<ResultProduct[]>> {
    const result = await firstValueFrom(
      this.productClient
        .send<ResultProduct[]>('prod_all', [])
        .pipe(DefaultErro()),
    );
    return new Message(result);
  }

  async ProductPatch(product: ProductPatchDefaultDto) {
    const result = await firstValueFrom(
      this.productClient
        .send<ResultProduct>('prod_patch', product)
        .pipe(DefaultErro()),
    );
    return new Message(result);
  }

  // *********** Order Services ************

  async OrderAll(): Promise<Message<OrderDto[]>> {
    const result = await firstValueFrom(
      this.orderClient
        .send<OrderDto[]>('order_all', 'find')
        .pipe(DefaultErro()),
    );
    return new Message(result);
  }

  async OrderId(id: number): Promise<Message<OrderDto>> {
    const result = await firstValueFrom(
      this.orderClient.send<OrderDto>('order_id', id).pipe(DefaultErro()),
    );
    return new Message(result);
  }

  async CreateOrder(
    order: CreateOrderDto,
  ): Promise<Message<OrderProcessDto | OrderFailedDto>> {
    const result = await firstValueFrom(
      this.orderClient
        .send<OrderProcessDto | OrderFailedDto>('create_order', order)
        .pipe(DefaultErro()),
    );

    return result.status == 'PEDING'
      ? new Message(result, undefined, 201)
      : new Message(result, 'Order canceled', 201);
  }

  // *********** Payment Services ************

  async PaymentSucess(result: ResultPay): Promise<Message<undefined>> {
    await firstValueFrom(
      this.paymentClient.emit('pay_sucess', result).pipe(DefaultErro()),
    );
    return new Message(undefined, 'Payment made with success', 200);
  }
  async PaymentFail(result: ResultPay): Promise<Message<undefined>> {
    await firstValueFrom(
      this.paymentClient.emit('pay_fail', result).pipe(DefaultErro()),
    );
    return new Message(undefined, 'Payment fail', 200);
  }

  // *********** Stock Services ************

  async ChangeQuantityProduct(change: ChangeStock): Promise<Message<StockDto>> {
    const result = await firstValueFrom(
      this.stockClient
        .send<StockDto>('stock_quant', change)
        .pipe(DefaultErro()),
    );
    return new Message(
      result,
      `The quantity of product ${change.productId} has been updated.`,
      200,
    );
  }
}
