import { Controller } from '@nestjs/common';
import { MsAuthService } from './ms-auth.service';
import { MessagePattern } from '@nestjs/microservices';
import type { SignIn, UserPatchDefaultDto } from '@/lib/dto/AuthDto';
import type { SignUp } from '@/lib/dto/AuthDto';

@Controller()
export class MsAuthController {
  constructor(private readonly msAuthService: MsAuthService) {}

  @MessagePattern('login')
  login(user: SignIn) {
    return this.msAuthService.Login(user);
  }
  @MessagePattern('register')
  register(user: SignUp) {
    return this.msAuthService.Register(user);
  }
  @MessagePattern('user_all')
  findUserAll() {
    return this.msAuthService.FindAllUsers();
  }
  @MessagePattern('user_id')
  findUserId(id: number) {
    return this.msAuthService.FindUserId(id);
  }
  @MessagePattern('user_patch')
  Patch(user: UserPatchDefaultDto) {
    return this.msAuthService.Patch(user);
  }
}
