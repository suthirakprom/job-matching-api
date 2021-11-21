import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { JobSeeker } from 'src/job-seeker/schema/jobSeeker.schema';
import * as mongoose from 'mongoose';

export type CompanyDocument = Company & Document;

@Schema()
export class Company {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  location: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  jobCategory: string;

  @Prop()
  establishmentDate: string;

  @Prop()
  websiteUrl: string;

  @Prop()
  logo: string;

  @Prop()
  introVideo: string;


  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobSeeker' }],
  })
  linkedList: JobSeeker[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobSeeker' }],
  })
  matchedList: JobSeeker[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobSeeker' }],
  })
  waitingList: JobSeeker[];
}

export const CompanySchema = SchemaFactory.createForClass(Company);
