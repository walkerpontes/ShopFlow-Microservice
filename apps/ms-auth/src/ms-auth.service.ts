import { Injectable } from '@nestjs/common';
import { SignIn, SignUp, UserPatchDefaultDto } from '@/lib/dto/AuthDto';
import { PrismaService } from './prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RpcException } from '@nestjs/microservices';
import { ErroPrisma } from '@/lib/error/ErrorPrisma';

@Injectable()
export class MsAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async Login(user: SignIn) {
    try {
      const userVerify = await this.prisma.user.findUniqueOrThrow({
        where: {
          email: user.email,
        },
      });

      const passVerify = await argon2.verify(userVerify.pass, user.pass);

      if (!passVerify)
        throw new RpcException({ message: 'Password incorrect', status: 404 });

      const payload = {
        sub: userVerify.id,
        name: userVerify.nome,
        email: userVerify.email,
        role: userVerify.role,
      };
      const token = await this.jwt.signAsync(payload);

      return { token: token };
    } catch (error) {
      new ErroPrisma(error);
    }
  }

  async Register(user: SignUp) {
    try {
      const createUser = await this.prisma.user.create({
        data: {
          nome: user.name,
          email: user.email,
          pass: await argon2.hash(user.pass),
        },
        omit: { id: true, pass: true },
      });

      if (!createUser)
        throw new RpcException({ message: 'Created User failed', status: 404 });

      return createUser;
    } catch (error) {
      new ErroPrisma(error);
    }
  }

  async FindAllUsers() {
    try {
      const users = await this.prisma.user.findMany({
        omit: { id: true, pass: true },
      });
      if (users.length === 0)
        throw new RpcException({ message: 'Not found users', status: 404 });

      return users;
    } catch (error) {
      new ErroPrisma(error);
    }
  }

  async FindUserId(id: number) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: id },
        omit: { id: true, pass: true },
      });

      return user;
    } catch (error) {
      new ErroPrisma(error);
    }
  }

  async Patch(user: UserPatchDefaultDto) {
    try {
      if (user.user.pass) {
        user.user.pass = await argon2.hash(user.user.pass);
      }
      const result = this.prisma.user.update({
        where: { id: user.id },
        data: user.user,
        omit: { id: true, pass: true },
      });
      return result;
    } catch (error) {
      new ErroPrisma(error);
    }
  }
}
