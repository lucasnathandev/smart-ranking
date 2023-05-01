import { IsString, IsNotEmpty } from 'class-validator';

export class AtualizarCategoriaDto {
  @IsNotEmpty()
  @IsString()
  readonly categoria: string;
}
