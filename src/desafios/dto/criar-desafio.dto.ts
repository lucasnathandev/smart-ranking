import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from "class-validator";

export class CriarDesafioDto {
  @IsNotEmpty()
  @IsDateString()
  readonly dataHoraDesafio: Date | string;

  @IsNotEmpty()
  readonly solicitante: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  readonly jogadores: [string, string];
}
