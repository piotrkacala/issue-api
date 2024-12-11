import { Injectable } from '@nestjs/common';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { Tracker } from './entities/tracker.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Tracker) private readonly trackerRepository: Repository<Tracker>,
  ) { }

  async create(input: CreateTrackerDto): Promise<Tracker> {
    const category = input.category
    const tracker: Tracker = new Tracker()
    tracker.title = input.title
    tracker.description = input.description
    tracker.status = input.status || 't'
    tracker.category = category

    if (category === 's') {
      //Tickets of the type "Story" can have additional "points" field
      tracker.points = input.points
    }

    let parent = null
    if (input.parentId) {
      parent = await this.trackerRepository.findOneBy({ id: input.parentId })
    }
    if (category === 's' && parent?.category !== 'e') {
      throw new Error('Stories must belong to an Epic')
    }
    if (category === 't' && parent?.category !== 's') {
      throw new Error('Tasks must belong to a Story')
    }
    tracker.parentId = input.parentId
    if (category === 'e') {
      // Epics cannot be nested under any other items
      tracker.parentId = null
    }

    return this.trackerRepository.save(tracker)
  }

  findAll(): Promise<Tracker[]> {
    return this.trackerRepository.find();
  }

  findOne(id: number) {
    return this.trackerRepository.findOneBy({ id })
  }

  update(id: number, updateTrackerDto: UpdateTrackerDto) {
    return `This action updates a #${id} tracker`;
  }

  remove(id: number): Promise<DeleteResult> {
    return this.trackerRepository.delete({ id })
  }
}
