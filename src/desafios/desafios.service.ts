import { PrismaService } from './../prisma/prisma.service';

import { Injectable } from '@nestjs/common';
import { CriarDesafioDto } from './dto/criar-desafio.dto';
import { AtualizarDesafioDto } from './dto/atualizar-desafio.dto';

@Injectable()
export class DesafiosService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly desafioModel = this.prisma.desafios;

  create(criarDesafioDto: CriarDesafioDto) {
    return 'This action adds a new desafio';
  }

  findAll() {
    return `This action returns all desafios`;
  }

  findOne(id: string) {
    return `This action returns a #${id} desafio`;
  }

  update(id: string, atualizarDesafioDto: AtualizarDesafioDto) {
    return `This action updates a #${id} desafio`;
  }

  remove(id: string) {
    return `This action removes a #${id} desafio`;
  }
}
