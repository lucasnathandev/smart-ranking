import { PrismaService } from './../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { DesafiosController } from './desafios.controller';

@Module({
  controllers: [DesafiosController],
  providers: [DesafiosService, PrismaService],
})
export class DesafiosModule {}
