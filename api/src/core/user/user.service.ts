import 'dotenv/config';
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { newUserRequest } from './user.dto';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import * as tz from 'moment-timezone';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(reqBody: newUserRequest) {
    const validate = await this.prisma.user.findFirst({
      where: {
        OR: [{ user_name: reqBody.user_name }],
      },
    });

    if (validate) {
      throw new ConflictException('Duplicate username or email id');
    } else {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hash = await bcrypt.hash(reqBody.password, salt);
      const createUser = await this.prisma.user.create({
        data: {
          full_name: reqBody.full_name,
          user_name: reqBody.user_name,
          password: hash,
          status: reqBody.status,
          role: reqBody.role || 'USER',
          can_add: reqBody.can_add !== undefined ? reqBody.can_add : true,
          can_delete: reqBody.can_delete !== undefined ? reqBody.can_delete : false,
          can_clear: reqBody.can_clear !== undefined ? reqBody.can_clear : false,
        },
      });

      const { password, ...rest } = createUser;
      return rest;
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        full_name: true,
        user_name: true,
        status: true,
        role: true,
        can_add: true,
        can_delete: true,
        can_clear: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: {
            login_logs: true,
          },
        },
      },
    });
  }

  async update(id: number, reqBody: any) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new ConflictException('User not found');
    }

    if (reqBody.user_name && reqBody.user_name !== user.user_name) {
      const duplicate = await this.prisma.user.findUnique({
        where: { user_name: reqBody.user_name },
      });
      if (duplicate) {
        throw new ConflictException('Username already taken');
      }
    }

    const data: any = { ...reqBody };
    if (reqBody.password) {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      data.password = await bcrypt.hash(reqBody.password, salt);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });

    const { password, ...rest } = updatedUser;
    return rest;
  }

  async deactivate(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      throw new ConflictException('User not found');
    }
    return this.prisma.user.update({
      where: { id: Number(id) },
      data: { status: !user.status }, // Toggle status to support both activation & deactivation
    });
  }
}
