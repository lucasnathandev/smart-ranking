import { Evento } from '@prisma/client';
import { IsString, IsOptional, ArrayMinSize } from 'class-validator';

export class AtualizarCategoriaDto {
  @IsString()
  @IsOptional()
  descricao: string;

  @ArrayMinSize(1)
  eventos: Array<Evento>;
}
