import { IsNotEmpty } from 'class-validator';

export class AtribuirCategoriaDto {
  @IsNotEmpty()
  readonly categoriaId: string;
}
