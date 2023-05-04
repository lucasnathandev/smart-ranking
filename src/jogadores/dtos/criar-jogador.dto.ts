import { IsEmail, IsNotEmpty } from 'class-validator';

// Data Transfer Object - esse objeto vai trafegar por toda a nossa aplicação, por isso o nome.

export class CriarJogadorDto {
  @IsNotEmpty()
  readonly nome: string;
  @IsEmail()
  readonly email: string;
  readonly telefoneCelular: string;
}
