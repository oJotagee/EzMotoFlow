import { IsEmail, IsEmpty, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })
  readonly password: string


  @IsEmail()
  @IsNotEmpty()
  readonly email: string
}
