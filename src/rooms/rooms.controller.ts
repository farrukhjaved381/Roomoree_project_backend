import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { Multer } from 'multer';

@ApiTags('Rooms')
@ApiBearerAuth()
@Controller('rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // 🔍 Search/filter endpoint
  @Get('/search')
  findByFilter(
    @Query('location') location?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('keyword') keyword?: string,
  ) {
    return this.roomsService.searchRooms({ location, minPrice, maxPrice, keyword });
  }

  // 🏠 Create Room with image upload
  @Post()
  @Roles(UserRole.HOST)
  @UseInterceptors(FilesInterceptor('images', 5, {
    storage: diskStorage({
      destination: './uploads/rooms',
      filename: (req, file, cb) => {
        const unique = uuid() + extname(file.originalname);
        cb(null, unique);
      },
    }),
  }))
  @ApiOperation({ summary: 'Create a new room (host only)' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string', example: 'Luxury Apartment' },
      location: { type: 'string', example: 'Islamabad' },
      price: { type: 'number', example: 2500 },
      description: { type: 'string', example: 'Spacious and well-lit' },
      images: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
    },
    required: ['title', 'location', 'price', 'images'],
  },
})
@ApiResponse({ status: 201, description: 'Room created successfully' })
@ApiBearerAuth()
  async createRoom(
    @Body() dto: CreateRoomDto,
    
    @UploadedFiles() files: Multer.File[],
    @Req() req,
  ) {
    dto.price = Number(dto.price);
    const imagePaths = files.map(file => `/uploads/rooms/${file.filename}`);
    return this.roomsService.create(dto, imagePaths, req.user._id);
  }

  // 📋 Get all rooms
  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  // 🔄 Update room
  @Patch(':id')
  @Roles(UserRole.HOST)
  update(@Param('id') id: string, @Body() updateDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateDto);
  }

  // ❌ Delete room
  @Delete(':id')
  @Roles(UserRole.HOST)
  delete(@Param('id') id: string) {
    return this.roomsService.delete(id);
  }

  // 🔍 Get single room by ID with host and reviews
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findByIdWithDetails(id);
  }
}
