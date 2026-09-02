import { Controller, Post, Body, Get, Delete, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { newUserRequest, updateUserRequest } from './user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '../../auth/auth.guard';
import {
  StandardParam,
  StandardParams,
  StandardResponse,
} from 'nest-standard-response';

@Controller('user') // Base URL: http://localhost:3000/user
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  private checkAdminPermission(req: any) {
    const user = req.user;
    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Only administrators can access user management.');
    }
  }

  @Post('/save')
  @StandardResponse()
  async create(
    @Body() reqBody: newUserRequest,
    @StandardParam() param: StandardParams,
    @Request() req
  ) {
    this.checkAdminPermission(req);
    param.setMessage('User Saved');
    return await this.userService.create(reqBody);
  }

  @Get('/all')
  @StandardResponse({ isPaginated: true })
  async findAll(@StandardParam() param: StandardParams, @Request() req) {
    this.checkAdminPermission(req);
    const data = await this.userService.findAll();
    const count = data.length;
    param.setMessage('Users Fetched');
    param.setPaginationInfo({ count: count });
    return data;
  }

  @Post('/update/:id')
  @StandardResponse()
  async update(
    @Param('id') id: string,
    @Body() reqBody: updateUserRequest,
    @StandardParam() param: StandardParams,
    @Request() req
  ) {
    this.checkAdminPermission(req);
    param.setMessage('User Updated');
    return await this.userService.update(Number(id), reqBody);
  }

  @Delete('/deactivate/:id')
  @StandardResponse()
  async deactivateUser(
    @Param('id') id: string,
    @StandardParam() param: StandardParams,
    @Request() req
  ) {
    this.checkAdminPermission(req);
    param.setMessage('User Status Toggled');
    return await this.userService.deactivate(Number(id));
  }
}
