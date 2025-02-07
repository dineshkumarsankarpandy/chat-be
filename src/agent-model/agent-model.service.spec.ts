import { Test, TestingModule } from '@nestjs/testing';
import { AgentModelService } from './agent-model.service';

describe('AgentModelService', () => {
  let service: AgentModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentModelService],
    }).compile();

    service = module.get<AgentModelService>(AgentModelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
