import { forwardRef, Module } from '@nestjs/common';
import { JobSeekerService } from './job-seeker.service';
import { JobSeekerController } from './job-seeker.controller';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSeekerSchema, JobSeeker } from './schema/jobSeeker.schema';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [UserModule, forwardRef(() => CompanyModule), MongooseModule.forFeature([{ name: JobSeeker.name, schema: JobSeekerSchema }])],
  controllers: [JobSeekerController],
  providers: [JobSeekerService],
  exports: [MongooseModule]
})
export class JobSeekerModule { }
