import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Modern Apartment in Lahore' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Spacious room with AC and WiFi' })
  description: string;

  @IsNumber()
  @ApiProperty({ example: 5000 })
  price: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Lahore, Pakistan' })
  location: string;

  @IsOptional()
  @ApiProperty({ example: ['https://example.com/image1.jpg'] })
  images: string[];
}
