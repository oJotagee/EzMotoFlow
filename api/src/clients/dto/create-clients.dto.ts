import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum TipoCliente {
  PESSOA_FISICA = 'PESSOA_FISICA',
  PESSOA_JURIDICA = 'PESSOA_JURIDICA',
}

export class CreateClientDto {
  @IsEnum(TipoCliente)
  @IsNotEmpty()
  readonly tipo: TipoCliente;

  @IsString()
  @IsNotEmpty()
  readonly fullName: string;

  @IsString()
  @IsNotEmpty()
  readonly documento: string;

  @IsString()
  @IsOptional()
  readonly telefone?: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsDateString()
  @IsOptional()
  readonly dataNascimento?: string;

  @IsString()
  @IsOptional()
  readonly companyName?: string;

  @IsString()
  @IsNotEmpty()
  readonly cep: string;

  @IsString()
  @IsNotEmpty()
  readonly rua: string;

  @IsString()
  @IsNotEmpty()
  readonly numero: string;

  @IsString()
  @IsNotEmpty()
  readonly bairro: string;

  @IsString()
  @IsNotEmpty()
  readonly cidade: string;

  @IsString()
  @IsNotEmpty()
  readonly estado: string;

  @IsString()
  @IsOptional()
  readonly complementos?: string;
}
