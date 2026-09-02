import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { findByUserId, newAddContainerRequest } from './container.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContainerService {
  constructor(private prisma: PrismaService) {}

  async create(reqBody: newAddContainerRequest) {
    // 1. Convert container number to uppercase and trim whitespaces to prevent case-sensitivity bypass
    const containerNoUpper = reqBody.cont_no.toUpperCase().trim();

    // 2. Try-Catch block to handle database-level unique constraints (prevents application crash during race conditions)
    try {
      const saved = await this.prisma.container.create({
        data: {
          cont_no: containerNoUpper,
          size: reqBody.size,
          location: reqBody.location,
          user_id: reqBody.user_id,
          location_remarks: reqBody.location_remarks,
        },
      });

      console.log(
        `>>> [NEW ENTRY] Cont: ${containerNoUpper} | Size: ${reqBody.size}FT | Loc: ${reqBody.location} | UserID: ${reqBody.user_id} | ${new Date().toLocaleTimeString()}`,
      );

      return saved;
    } catch (error) {
      // Handle Prisma Unique Constraint Violation error (Error Code: P2002)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Duplicate Container: This container number already exists.',
        );
      }
      // Handle any other unexpected database exceptions
      throw new InternalServerErrorException(
        'Database temporary error, please try again.',
      );
    }
  }

  async findByUserId(reqBody: findByUserId) {
    return await this.prisma.container.findMany({
      where: {
        user_id: reqBody.user_id,
      },
      select: {
        id: true,
        cont_no: true,
        size: true,
        location: true,
        location_remarks: true,
        created_at: true,
      },
    });
  }
  async delete(id: number) {
    const deleted = await this.prisma.container.delete({
      where: { id: id },
    });
    return {
      success: true,
      message: 'Container deleted successfully',
      data: deleted,
    };
  }
  async findAll() {
    return await this.prisma.container.findMany({
      select: {
        id: true,
        cont_no: true,
        size: true,
        location: true,
        location_remarks: true,
        created_at: true,
        User: {
          select: {
            full_name: true,
          },
        },
      },
    });
  }

  async clearAll() {
    const containers = await this.prisma.container.findMany();
    
    if (containers.length > 0) {
      await this.prisma.$transaction([
        this.prisma.containerArchive.createMany({
          data: containers.map(c => ({
            cont_no: c.cont_no,
            size: c.size,
            location: c.location,
            location_remarks: c.location_remarks,
            user_id: c.user_id,
            created_at: c.created_at,
          })),
        }),
        this.prisma.container.deleteMany({}),
      ]);
    } else {
      await this.prisma.container.deleteMany({});
    }

    return {
      success: true,
      message: 'All containers archived and cleared successfully',
      count: containers.length,
    };
  }

  async getSuggestions(query: string) {
    const cleanedQuery = (query || '').toUpperCase().trim();
    if (!cleanedQuery) return [];
    
    return await this.prisma.containerMaster.findMany({
      where: {
        cont_no: {
          startsWith: cleanedQuery,
        },
      },
      take: 10,
      select: {
        cont_no: true,
        size: true,
        source: true,
      },
    });
  }
}
