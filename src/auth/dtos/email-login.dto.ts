import { IsNotEmpty, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsExist } from '@/utils/validators/is-exists.validator';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';

export class EmailLoginDto {
  @ApiProperty({ example: 'ramez@gmail.com' })
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  @Validate(IsExist, ['User'], {
    message: 'emailNotExists',
  })
  email: string;

  @ApiProperty({ example: 'Matkhau@123' })
  @IsNotEmpty()
  password: string;
}
