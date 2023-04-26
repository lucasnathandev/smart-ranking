import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}
  private categoriasModel = this.prisma.categorias;
}
