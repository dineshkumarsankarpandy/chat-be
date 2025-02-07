import { PartialType } from '@nestjs/swagger';
import { CreateAgentModelDto } from './create-agent-model.dto';

export class UpdateAgentModelDto extends PartialType(CreateAgentModelDto) {}
