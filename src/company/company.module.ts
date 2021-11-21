import { forwardRef, Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySchema, Company } from './schema/company.schema';
import { JobSeekerModule } from 'src/job-seeker/job-seeker.module';

@Module({
  imports: [
    UserModule,
    forwardRef(() => JobSeekerModule),
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [MongooseModule],
})
export class CompanyModule {}
