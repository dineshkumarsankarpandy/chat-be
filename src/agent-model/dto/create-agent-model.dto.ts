import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAgentModelDto {
    @ApiProperty({
        description: 'The input prompt for the AI model',
        example: 'Explain how AI works',
    })
    @IsString() 
    @IsNotEmpty() 
    prompt: string;
}