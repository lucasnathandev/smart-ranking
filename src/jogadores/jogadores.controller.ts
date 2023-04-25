import { Controller, Post, Body, Get, Query, Delete } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criarJogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogadores } from '@prisma/client';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  async criarAtualizarJogador(
    @Body() criaJogadorDto: CriarJogadorDto,
  ): Promise<void> {
    this.jogadoresService.criarAtualizarJogador(criaJogadorDto);
  }

  @Get()
  async consultarJogadores(
    @Query('email') email: string,
  ): Promise<Jogadores[] | Jogadores> {
    if (email) {
      return await this.jogadoresService.consultarJogadorPeloEmail(email);
    }
    return this.jogadoresService.consultarTodosJogadores();
  }

  @Delete()
  async deletarJogador(@Query('email') email: string): Promise<void> {
    this.jogadoresService.deletarJogadorPeloEmail(email);
  }
}
