import { Module } from '@nestjs/common';
import { ContainerController } from './container.controller';
import { ContainerService } from './container.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContainerController],
  providers: [ContainerService]
})
export class ContainerModule { }
