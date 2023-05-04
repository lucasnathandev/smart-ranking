import { IsNotEmpty, IsOptional } from 'class-validator';

// Data Transfer Object - esse objeto vai trafegar por toda a nossa aplicação, por isso o nome.

export class AtualizarJogadorDto {
  @IsNotEmpty()
  readonly nome: string;
  @IsNotEmpty()
  readonly telefoneCelular: string;
}
