import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, HttpStatus } from '@nestjs/common';
import { AgentModelService } from './agent-model.service';
import { CreateAgentModelDto } from './dto/create-agent-model.dto';
import { UpdateAgentModelDto } from './dto/update-agent-model.dto';
import { Request, Response } from 'express';

@Controller('agent-model')
export class AgentModelController {
  constructor(private readonly agentModelService: AgentModelService) {}


    @Post('generate')
    async generateContent(
      @Body() data: CreateAgentModelDto,
      @Res() res: Response,
      @Req() req: Request 
  
  
  ) {
        try{       
        const generatedCode = await this.agentModelService.generateCodeResponse(data.prompt);
        return res.status(HttpStatus.OK).json({
          data: generatedCode,
          success:true
        })
    }

    catch(err){
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:`something went wrong ${err}`
          })

    }
}
}
