import { DesafioStatus } from "@prisma/client";
import { IsOptional } from "class-validator";

export class AtualizarDesafioDto {
  @IsOptional()
  status: DesafioStatus;
  @IsOptional()
  dataHoraDesafio?: string;
}
