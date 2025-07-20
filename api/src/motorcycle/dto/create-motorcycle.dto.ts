import { IsDate, IsEmpty, IsInt, IsNotEmpty, IsString, Max } from "class-validator";

export class CreateMotorCycleDto {
  @IsString()
  @IsNotEmpty()
  readonly cor: string;

  @Max(7)
  @IsString()
  @IsNotEmpty()
  readonly placa: string;

  @IsDate()
  @IsNotEmpty()
  readonly ano: Date;

  @Max(17)
  @IsString()
  @IsNotEmpty()
  readonly chassi: string;

  @Max(11)
  @IsString()
  @IsNotEmpty()
  readonly renavam: string;

  @IsString()
  @IsNotEmpty()
  readonly km: string;

  @IsInt()
  @IsNotEmpty()
  readonly valor_compra: number;

  @IsInt()
  @IsNotEmpty()
  readonly valor_venda: number;

  @IsInt()
  @IsNotEmpty()
  readonly valor_fipe: number;

  @IsString()
  @IsEmpty()
  readonly observacao: string;
}
