import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // <-- VERY IMPORTANT
})
export class EmailModule {}
