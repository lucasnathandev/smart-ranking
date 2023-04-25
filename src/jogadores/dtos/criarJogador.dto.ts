// Data Transfer Object - esse objeto vai trafegar por toda a nossa aplicação, por isso o nome.

export class CriarJogadorDto {
  readonly telefoneCelular: string;
  readonly email: string;
  readonly nome: string;
}
