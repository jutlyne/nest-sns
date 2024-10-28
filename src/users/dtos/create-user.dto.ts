import { Transform } from 'class-transformer';

import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength, Validate } from 'class-validator';

import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { UserStatus } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'ramez@gmail.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string | null;

  @ApiProperty({ example: 'Matkhau@123' })
  @MinLength(6)
  @IsStrongPassword()
  password?: string;

  @ApiProperty({ example: 'Ramez' })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: 'Ben Taher' })
  @IsNotEmpty()
  lastName: string | null;

  status?: UserStatus;
  socialId?: string | null;

  hash?: string | null;
}
