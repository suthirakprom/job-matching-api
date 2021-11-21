import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import * as mongoose from 'mongoose';
import { Company } from 'src/company/schema/company.schema';

export type JobSeekerDocument = JobSeeker & Document;

@Schema()
export class JobSeeker {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  dateOfBirth: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  jobTitle: string;

  @Prop()
  profilePicture: string;

  @Prop()
  profileVideo: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
  })
  matchedList: Company[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
  })
  linkedList: Company[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
  })
  waitingList: Company[];
}

export const JobSeekerSchema = SchemaFactory.createForClass(JobSeeker);
