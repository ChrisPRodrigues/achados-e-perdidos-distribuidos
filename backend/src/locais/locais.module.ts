import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocaisController } from './locais.controller.js';
import { LocaisService } from './locais.service.js';
import { LocalEntity } from './entities/local.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocalEntity]),
  ],
  controllers: [LocaisController],
  providers: [LocaisService],
  exports: [LocaisService],
})
export class LocaisModule {}