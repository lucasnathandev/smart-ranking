import { IsNotEmpty } from "class-validator";
import { Resultado } from "../interfaces/desafio.interface";

export class AtribuirDesafioPartidaDto {
  @IsNotEmpty()
  def: string;

  @IsNotEmpty()
  resultado: Resultado[];
}
