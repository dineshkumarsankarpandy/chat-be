import { Module } from '@nestjs/common';
import { AgentModelService } from './agent-model.service';
import { AgentModelController } from './agent-model.controller';

@Module({
  controllers: [AgentModelController],
  providers: [AgentModelService],
})
export class AgentModelModule {}
