// src/disputes/disputes.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Dispute } from './schemas/dispute.schema';
import { Model } from 'mongoose';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';

@Injectable()
export class DisputesService {
  constructor(
    @InjectModel(Dispute.name) private disputeModel: Model<Dispute>,
  ) {}

  async createDispute(userId: string, dto: CreateDisputeDto) {
    const dispute = new this.disputeModel({
      user: userId,
      booking: dto.booking,
      reason: dto.reason,
    });
    return dispute.save();
  }

  async getAllDisputes() {
    return this.disputeModel.find().populate('user booking').sort({ createdAt: -1 });
  }

  async getDisputeById(id: string) {
    const dispute = await this.disputeModel.findById(id).populate('user booking');
    if (!dispute) throw new NotFoundException('Dispute not found');
    return dispute;
  }

  async resolveDispute(id: string, dto: ResolveDisputeDto) {
    const dispute = await this.disputeModel.findById(id);
    if (!dispute) throw new NotFoundException('Dispute not found');

    dispute.status = dto.status;
    if (dto.resolutionNote) dispute.resolutionNote = dto.resolutionNote;

    return dispute.save();
  }
}
