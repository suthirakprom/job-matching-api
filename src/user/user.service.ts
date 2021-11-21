import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User } from './schema/user.schema';
import { UserInterface } from './interface/user.interface';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}
  
  async create(email: any, user: UserInterface) {
    if (email !== user.email) {
      throw new ForbiddenException()
    }
    if (await this.userModel.findOne({ email: user.email })) {
      return "User already exist"
    } else {
      await this.userModel.create(user)
      return await this.userModel.findOne({ email: user.email })
    }
  }

  async find(email: any) {
    return await this.userModel.findOne({ email: email})
  }
}
