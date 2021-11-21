import { Controller, Get, Req, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { CreateUserDto } from './dto/createUser.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/profile')
  async createProfile(
    @Req() request: Request,
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    return await this.userService.create(request['user'], createUserDto);
  }

  @Get('/profile')
  async getProfile(@Req() request: Request): Promise<any> {
    const user = await this.userService.find(request['user']);
    if (user) {
      return user;
    } else {
      return 'No profile';
    }
  }
}
