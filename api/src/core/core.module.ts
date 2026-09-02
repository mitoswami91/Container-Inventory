import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ContainerModule } from './container/container.module';




@Module({
  imports: [
    PrismaModule, 
    UserModule, ContainerModule, 
   ],
})
export class CoreModule { }
