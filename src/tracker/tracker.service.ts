import { Injectable } from '@nestjs/common';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { Tracker } from './entities/tracker.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Tracker) private readonly trackerRepository: Repository<Tracker>,
  ) {}

  create(input: CreateTrackerDto): Promise<Tracker> {
    const  tracker : Tracker = new Tracker()
    tracker.title = input.title
    tracker.description = input.description
    tracker.status = input.status || 't'
    
    return this.trackerRepository.save(tracker)
  }

  findAll(): Promise<Tracker[]> {
    return this.trackerRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} tracker`;
  }

  update(id: number, updateTrackerDto: UpdateTrackerDto) {
    return `This action updates a #${id} tracker`;
  }

  remove(id: number) {
    return `This action removes a #${id} tracker`;
  }
}
