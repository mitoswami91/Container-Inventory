import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoreModule } from './core/core.module';
import {StandardResponseModule} from 'nest-standard-response'

@Module({
  imports: [AuthModule, PrismaModule, CoreModule,StandardResponseModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
