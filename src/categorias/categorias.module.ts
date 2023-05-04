import { JogadoresModule } from './../jogadores/jogadores.module';
import { PrismaService } from './../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';

@Module({
  imports: [JogadoresModule],
  controllers: [CategoriasController],
  providers: [CategoriasService, PrismaService],
})
export class CategoriasModule {}
