import { Test, TestingModule } from '@nestjs/testing';
import { TrackerService } from './tracker.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tracker } from './entities/tracker.entity';

const issueTicket = {
  id: 29,
  title: 'aaa',
  description: '',
  status: 't',
  created_date: '2024-12-11T13:50:48.093Z',
  updated_date: '2024-12-11T13:50:48.093Z',
  category: 't',
  points: null,
  parentId: null,
};

const issuesArray = [
  {
    '0': {
      id: 12,
      title: 'titletest',
      description: '',
      status: 't',
      created_date: '2024-12-11T07:56:23.109Z',
      updated_date: '2024-12-11T07:56:23.109Z',
      category: 'e',
      points: null,
      parentId: null,
    },
  },
  {
    '1': {
      id: 13,
      title: 'titletest',
      description: '',
      status: 't',
      created_date: '2024-12-11T07:59:07.812Z',
      updated_date: '2024-12-11T07:59:07.812Z',
      category: 'e',
      points: null,
      parentId: null,
    },
  },
];

const deleteIssue = { raw: [], affected: 1 };

describe('TrackerService', () => {
  let service: TrackerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackerService,
        {
          provide: getRepositoryToken(Tracker),
          useValue: {
            save: jest.fn().mockResolvedValue(issueTicket),
            find: jest.fn().mockResolvedValue(issuesArray),
            findOneBy: jest.fn().mockResolvedValue(issueTicket),
            delete: jest.fn().mockResolvedValue(deleteIssue),
          },
        },
      ],
    }).compile();

    service = module.get<TrackerService>(TrackerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should add a ticket', async () => {
      const result = await service.create({ title: 'test', category: 'e' });
      expect(result).toEqual(issueTicket);
    });
    it('should throw an error', async () => {
      await expect(async () => {
        await service.create({ title: 'test', category: 's' });
      }).rejects.toThrow('Stories must belong to an Epic');
    });
    it('should throw an error', async () => {
      await expect(async () => {
        await service.create({ title: 'test', category: 't' });
      }).rejects.toThrow('Tasks must belong to a Story');
    });
  });

  describe('findAll', () => {
    it('should return an array of issue tickets', async () => {
      const tickets = await service.findAll();
      expect(tickets).toEqual(issuesArray);
    });
  });

  describe('findOne', () => {
    it('should return an issue ticket', async () => {
      const ticket = await service.findOne(1);
      expect(ticket).toEqual(issueTicket);
    });
  });

  describe('update', () => {
    it('should resolve', async () => {
      const result = await service.update(1, { title: 'test', category: 'e' });
      expect(result).toEqual(issueTicket);
    });
    it('should fail on status transition', async () => {
      await expect(async () => {
        await service.update(1, { title: 'test', status: 'i' });
      }).rejects.toThrow('Illegal status transition');
    });
  });

  describe('remove', () => {
    it('should return delete result', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(deleteIssue);
    });
  });
});
