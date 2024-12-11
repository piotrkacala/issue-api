import { Injectable } from '@nestjs/common';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { Tracker } from './entities/tracker.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Category, Status } from './enums';

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
    tracker.status = input.status
    tracker.category = category

    if (category === Category.STORY) {
      //Tickets of the type "Story" can have additional "points" field
      tracker.points = input.points
    }

    let parent = null
    if (input.parentId) {
      parent = await this.trackerRepository.findOneBy({ id: input.parentId })
    }
    if (category === Category.STORY && parent?.category !== Category.EPIC) {
      throw new Error('Stories must belong to an Epic')
    }
    if (category === Category.SUBTASK && parent?.category !== Category.STORY) {
      throw new Error('Tasks must belong to a Story')
    }
    tracker.parentId = input.parentId
    if (category === Category.EPIC) {
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

  async update(id: number, input: UpdateTrackerDto) {
    const ticket = await this.trackerRepository.findOneBy({ id })
    if (ticket === null) {
      throw new Error('Ticket not found')
    }

    const order: String[] = Object.values(Status)
    const prevStatusIndex = order.indexOf(ticket.status)
    const newStatusIndex = order.indexOf(input.status)
    const statusChange = newStatusIndex - prevStatusIndex

    if (ticket.status &&
      input.status &&
      ticket.status !== input.status &&
      statusChange !== 1) {
      throw new Error('Illegal status transition')
    }
    return await this.trackerRepository.save({
      ...ticket,
      ...input,
      created_date: ticket.created_date,
      updated_date: new Date()
    });
  }

  remove(id: number): Promise<DeleteResult> {
    return this.trackerRepository.delete({ id })
  }
}
