import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SignUp {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  @IsString()
  @IsNotEmpty()
  pass!: string;
}

export interface UserDto {
  name: string;
  email: string;
  pass: string;
  createdAt: Date;
}

export class SignIn {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

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
  @IsString()
  @IsOptional()
  nome?: string;
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsEnum(RolesUser, { message: 'Role is USER or ADMIN' })
  role?: RolesUser;

  @IsString()
  @IsOptional()
  pass?: string;
}

export class UserPatchDefaultDto {
  id!: number;
  user!: UserPatchDto;
}
