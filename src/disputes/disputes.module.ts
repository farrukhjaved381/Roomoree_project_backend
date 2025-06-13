// src/disputes/disputes.module.ts

import { Module } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { DisputesController } from './disputes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dispute, DisputeSchema } from './schemas/dispute.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dispute.name, schema: DisputeSchema }]),
  ],
  controllers: [DisputesController],
  providers: [DisputesService],
})
export class DisputesModule {}
