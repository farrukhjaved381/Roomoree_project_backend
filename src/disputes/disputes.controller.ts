// src/disputes/disputes.controller.ts

import { Controller, Post, Body, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetCurrentUser } from '../auth/get-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Disputes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  @Roles(UserRole.GUEST)
  async createDispute(
    @GetCurrentUser('_id') userId: string,
    @Body() dto: CreateDisputeDto,
  ) {
    return this.disputesService.createDispute(userId, dto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllDisputes() {
    return this.disputesService.getAllDisputes();
  }

  @Patch(':id/resolve')
  @Roles(UserRole.ADMIN)
  async resolveDispute(
    @Param('id') id: string,
    @Body() dto: ResolveDisputeDto,
  ) {
    return this.disputesService.resolveDispute(id, dto);
  }
}
