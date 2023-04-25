import { PrismaService } from './../prisma/prisma.service';
import { Jogadores } from '@prisma/client';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criarJogador.dto';

@Injectable()
export class JogadoresService {
  constructor(private prisma: PrismaService) {}

  private readonly jogadorModel = this.prisma.jogadores;

  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;
    const jogadorEncontrado = await this.buscarJogador(email);
    if (jogadorEncontrado) {
      this.atualizar(criarJogadorDto);
      return;
    }
    this.criar(criarJogadorDto);
  }

  async consultarTodosJogadores(): Promise<Jogadores[]> {
    try {
      const jogadores: Jogadores[] = await this.jogadorModel.findMany({
        where: {
          isActive: true,
        },
      });
      return jogadores;
    } catch (error) {
      this.logger.log(JSON.stringify(error));
    }
  }

  async consultarJogadorPeloEmail(email: string): Promise<Jogadores> {
    const jogadorEncontrado = await this.buscarJogador(email);
    if (!jogadorEncontrado) return;
    return jogadorEncontrado;
  }

  async deletarJogadorPeloEmail(email: string): Promise<void> {
    const jogadorEncontrado = await this.buscarJogador(email);

    if (!jogadorEncontrado) return;
    await this.deletar(jogadorEncontrado);
  }

  private async criar(
    criarJogadorDto: CriarJogadorDto,
  ): Promise<Jogadores | any> {
    try {
      const jogadorCriado = await this.jogadorModel.create({
        data: criarJogadorDto,
      });
      this.logger.log(JSON.stringify(jogadorCriado));
      return await jogadorCriado;
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      return { error };
    }
  }

  private async atualizar(
    criarJogadorDto: CriarJogadorDto,
  ): Promise<Jogadores | any> {
    try {
      const jogadorAtualizado = await this.jogadorModel.update({
        where: {
          email: criarJogadorDto.email,
        },
        data: criarJogadorDto,
      });

      this.logger.log(JSON.stringify(jogadorAtualizado));

      return jogadorAtualizado;
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      return { error };
    }
  }

  private async deletar(jogadorEncontrado: Jogadores): Promise<void> {
    try {
      const jogadorInativado = await this.jogadorModel.update({
        where: {
          email: jogadorEncontrado.email,
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

  private async buscarJogador(email: string): Promise<Jogadores | any> {
    try {
      const jogadorEncontrado = await this.jogadorModel.findFirst({
        where: {
          email,
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
