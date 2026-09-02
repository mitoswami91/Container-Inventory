import { Controller, Get, Query, Post, Body, ParseIntPipe, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { StandardResponse } from 'nest-standard-response';
import { findByUserId, newAddContainerRequest } from './container.dto';
import { ContainerService } from './container.service';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('container')
@UseGuards(AuthGuard)
export class ContainerController {
  constructor(private containerService: ContainerService) {}

  @Post('/save')
  @StandardResponse()
  async create(@Body() reqBody: newAddContainerRequest, @Request() req) {
    const user = req.user;
    if (!user || (user.role !== 'ADMIN' && !user.can_add)) {
      throw new ForbiddenException('You do not have permission to add containers.');
    }
    return this.containerService.create(reqBody);
  }

  @Post('/findbyuserid')
  @StandardResponse()
  async findByUserId(@Body() reqBody: findByUserId, @Request() req) {
    const user = req.user;
    if (!user) {
      throw new ForbiddenException('Invalid session.');
    }
    // Prevent IDOR: Standard users can only query their own container data
    if (user.role !== 'ADMIN' && String(reqBody.user_id) !== String(user.sub)) {
      throw new ForbiddenException('You do not have permission to view other users\' container entries.');
    }
    return this.containerService.findByUserId(reqBody);
  }

  @Post('/all')
  @StandardResponse()
  async findAll() {
    return this.containerService.findAll();
  }

  @Delete('/clear-all')
  @StandardResponse()
  async clearAll(@Request() req) {
    const user = req.user;
    if (!user || (user.role !== 'ADMIN' && !user.can_clear)) {
      throw new ForbiddenException('You do not have permission to clear all container data.');
    }
    return this.containerService.clearAll();
  }

  @Delete('/:id')
  @StandardResponse()
  async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const user = req.user;
    if (!user || (user.role !== 'ADMIN' && !user.can_delete)) {
      throw new ForbiddenException('You do not have permission to delete containers.');
    }
    return this.containerService.delete(id);
  }

  @Get('/suggest')
  @StandardResponse()
  async getSuggestions(@Query('query') query: string) {
    return this.containerService.getSuggestions(query);
  }
}
