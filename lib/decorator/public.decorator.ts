import { SetMetadata } from '@nestjs/common';

export const ISPUBLIC = 'public';
export const IsPublic = () => SetMetadata(ISPUBLIC, true);
