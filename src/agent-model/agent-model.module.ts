import { Module } from '@nestjs/common';
import { AgentModelService } from './agent-model.service';
import { AgentModelController } from './agent-model.controller';
import { HelperService } from 'src/core/helper/helper.service';

@Module({
  controllers: [AgentModelController],
  providers: [AgentModelService,HelperService],
})
export class AgentModelModule {}
  