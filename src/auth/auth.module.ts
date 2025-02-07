import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { GithubStrategy } from './git.startegy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'github' }),
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [GithubStrategy],
})
export class AuthModule {}