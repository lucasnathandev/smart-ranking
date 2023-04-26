import {
  Controller,
  Post,
  Patch,
  Body,
  Get,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criarJogador.dto';
import { JogadoresService } from './jogadores.service';
import { Jogadores as Jogador } from '@prisma/client';
import { JogadoresValidacaoParametrosPipe } from './pipes/jogadores-validacao-parametros.pipe';
import { AtualizarJogadorDto } from './dtos/atualizarJogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(
    @Body() criaJogadorDto: CriarJogadorDto,
  ): Promise<Jogador> {
    return this.jogadoresService.criarJogador(criaJogadorDto);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Param('id', JogadoresValidacaoParametrosPipe) id: string,
    @Body() atualizarJogadorDto: AtualizarJogadorDto,
  ): Promise<void> {
    this.jogadoresService.atualizarJogador(id, atualizarJogadorDto);
  }

  @Get()
  async consultarJogadores(): Promise<Jogador[]> {
    return this.jogadoresService.consultarTodosJogadores();
  }

  @Get('/:id')
  async consultarJogadorPeloId(
    @Param('id', JogadoresValidacaoParametrosPipe) id: string,
  ): Promise<Jogador> {
    return await this.jogadoresService.consultarJogadorPeloId(id);
  }

  @Delete('/:id')
  async deletarJogador(
    @Param('id', JogadoresValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    this.jogadoresService.deletarJogadorPeloId(id);
  }
}
