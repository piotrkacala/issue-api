import { Module } from '@nestjs/common';
import { TrackerService } from './tracker.service';
import { TrackerController } from './tracker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tracker } from './entities/tracker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tracker])],
  controllers: [TrackerController],
  providers: [TrackerService],
})
export class TrackerModule {}
