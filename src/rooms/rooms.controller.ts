import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/jwt.guard'; // you'll define this
import { RolesGuard } from '../auth/roles.guard'; // you'll define this
import { Roles } from '../auth/roles.decorator';  // you'll define this
import { UserRole } from '../users/schemas/user.schema';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Rooms')
@ApiBearerAuth()
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST)
  @Post()
  create(@Body() createRoomDto: CreateRoomDto, @Req() req) {
    return this.roomsService.create(createRoomDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.roomsService.delete(id);
  }
}
