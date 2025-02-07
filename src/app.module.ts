import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AgentModelModule } from './agent-model/agent-model.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true
    }),


    AuthModule,
    AgentModelModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
