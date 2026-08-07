import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUp {
  @ApiProperty({
    example: 'User Test',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
  @ApiProperty({
    example: 'user@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  @ApiProperty({
    description: 'Minimum of 6 characters',
    example: 'user1234',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Pass: minimum of 6 characters' })
  pass!: string;
}

export interface UserDto {
  name: string;
  email: string;
  pass: string;
  createdAt: Date;
}

export class SignIn {
  @ApiProperty({
    example: 'email@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'pass1234',
  })
  @IsString()
  @IsNotEmpty()
  pass!: string;
}

export interface Token {
  token: string;
}

export enum RolesUser {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface PayloadJwt {
  sub: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export class UserPatchDto {
  @ApiProperty({ example: 'User Test' })
  @IsString()
  @IsOptional()
  nome?: string;
  @ApiProperty({ example: 'user@email.com' })
  @IsEmail()
  @IsOptional()
  email?: string;
  @ApiProperty({ enum: RolesUser, example: RolesUser.USER })
  @IsEnum(RolesUser, { message: 'Role is USER or ADMIN' })
  role?: RolesUser;
  @ApiProperty({ example: 'pass1234', description: 'Minimum of 6 characters' })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Minimum of 6 characters' })
  pass?: string;
}

export class UserPatchDefaultDto {
  id!: number;
  user!: UserPatchDto;
}
