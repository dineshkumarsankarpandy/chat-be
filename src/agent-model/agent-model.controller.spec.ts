import { Test, TestingModule } from '@nestjs/testing';
import { AgentModelController } from './agent-model.controller';
import { AgentModelService } from './agent-model.service';

describe('AgentModelController', () => {
  let controller: AgentModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentModelController],
      providers: [AgentModelService],
    }).compile();

    controller = module.get<AgentModelController>(AgentModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
