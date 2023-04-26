import { PrismaService } from './../prisma/prisma.service';
import { Jogadores as Jogador } from '@prisma/client';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criarJogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizarJogador.dto';

@Injectable()
export class JogadoresService {
  constructor(private prisma: PrismaService) {}

  private readonly jogadorModel = this.prisma.jogadores;

  private readonly logger = new Logger(JogadoresService.name);

  async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = await this.criar(criarJogadorDto);
    this.logger.log(jogadorCriado);
    return jogadorCriado;
  }

  async atualizarJogador(
    id: string,
    atualizarJogadorDto: AtualizarJogadorDto,
  ): Promise<void> {
    try {
      const jogadorEncontrado = await this.buscarJogador(id);
      if (!jogadorEncontrado)
        return (
          new NotFoundException(`Jogador com id: ${id} não encontrado.`), null
        );
      await this.atualizar(id, atualizarJogadorDto);
      this.logger.log(atualizarJogadorDto);
    } catch (error) {
      this.logger.log(JSON.stringify(error));
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    try {
      const jogadores: Jogador[] = await this.jogadorModel.findMany({
        where: {
          isActive: true,
        },
      });
      return jogadores;
    } catch (error) {
      this.logger.log(JSON.stringify(error));
    }
  }

  async consultarJogadorPeloId(id: string): Promise<Jogador> {
    try {
      const jogadorEncontrado = await this.buscarJogador(id);
      if (!jogadorEncontrado) return;
      return jogadorEncontrado;
    } catch (error) {
      this.logger.log(JSON.stringify(error));
    }
  }

  async deletarJogadorPeloId(id: string): Promise<void> {
    try {
      const jogadorEncontrado = await this.buscarJogador(id);

      if (!jogadorEncontrado)
        return (
          new NotFoundException(`Jogador com id: ${id} não encontrado.`), null
        );
      await this.deletar(jogadorEncontrado);
    } catch (error) {
      this.logger.log(JSON.stringify(error));
    }
  }

  private async criar(
    criarJogadorDto: CriarJogadorDto,
  ): Promise<Jogador | any> {
    try {
      const jogadorCriado = await this.jogadorModel.create({
        data: criarJogadorDto,
      });
      this.logger.log(JSON.stringify(jogadorCriado));
      return jogadorCriado;
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      return { error };
    }
  }

  private async atualizar(
    id: string,
    atualizarJogadorDto: AtualizarJogadorDto,
  ): Promise<Jogador | any> {
    try {
      const jogadorAtualizado = await this.jogadorModel.update({
        where: {
          id,
        },
        data: atualizarJogadorDto,
      });

      this.logger.log(JSON.stringify(jogadorAtualizado));

      return jogadorAtualizado;
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      return { error };
    }
  }

  private async deletar(jogadorEncontrado: Jogador): Promise<void> {
    try {
      const { id } = jogadorEncontrado;
      const jogadorInativado = await this.jogadorModel.update({
        where: {
          id,
        },
        data: { isActive: false },
      });

      if (!jogadorInativado) {
        throw new NotFoundException(
          'Jogador com email: ' +
            jogadorEncontrado.email +
            'não foi encontrado',
        );
      }

      this.logger.log(JSON.stringify(jogadorInativado));
    } catch (error) {
      this.logger.log(JSON.stringify(error));
    }
  }

  private async buscarJogador(id: string): Promise<Jogador | any> {
    try {
      const jogadorEncontrado = await this.jogadorModel.findFirst({
        where: {
          id,
          isActive: true,
        },
      });

      if (!jogadorEncontrado) return null;
      return jogadorEncontrado;
    } catch (error) {
      this.logger.log(error);
      return { error };
    }
  }
}
