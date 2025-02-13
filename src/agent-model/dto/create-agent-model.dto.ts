import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAgentModelDto {
    @ApiProperty({
        description: 'The input prompt for the AI model',
        example: 'Explain how AI works',
    })
    @IsString() 
    @IsNotEmpty() 
    prompt: string;


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    imageURl?:string;
}


export class GenerateCodeFromImageDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    imageURL : string
}