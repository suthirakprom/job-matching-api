import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JobSeekerService } from './job-seeker.service';
import * as mongoose from "mongoose";
import { MatchListUpdateDto } from 'src/company/dto/matchList-update.dto';
import { Request } from 'express';
import { Roles } from 'src/auth/roles.decorator';
import { UserType } from 'src/auth/userType.enum';
import { JobSeeker } from './schema/jobSeeker.schema';

@Controller('job-seeker')
@ApiBearerAuth()

export class JobSeekerController {
  constructor(private readonly jobSeekerService: JobSeekerService) {}

  @Get('/all')
  @Roles(UserType.Company)
  async getJobseekers(): Promise<any> {
    return await this.jobSeekerService.findAll();
  }

  @Get('/profile')
  @Roles(UserType.JobSeeker)
  async getJobseeker(@Req() request: Request): Promise<JobSeeker | undefined> {
    return await this.jobSeekerService.find(request['user']);
  }

  @Get('/:jobSeekerId')
  @Roles(UserType.Company)
  async getJobseekerById(@Param('jobSeekerId') id: string): Promise<JobSeeker | undefined> {
    console.log(id);
    
    return await this.jobSeekerService.findById(id);
  }

  @Patch("/keep")
  @Roles(UserType.JobSeeker)
  async keep(
    @Req() request :Request,
    @Body() idDto: MatchListUpdateDto
  ){
    return await this.jobSeekerService.addFavorite(request["user"],idDto.matchId)

  }

  //PATH FOR ADDING ITEM TO MATCH LIST
  @Patch("/match-list/:userId")
  @Roles(UserType.JobSeeker)
  async addMatchList(@Param("userId") _id: string, 
  @Body() matchListUpdateDto: MatchListUpdateDto): Promise<void> {
    

    //CHECK WHETHER PROVIDED IDs ARE VALID
    if (mongoose.isValidObjectId(_id) && mongoose.isValidObjectId(matchListUpdateDto.matchId)) {
      this.jobSeekerService.addMatchList({_id: new mongoose.Types.ObjectId(_id)}, matchListUpdateDto);
    }
    else {
      throw new BadRequestException();
    }
  }

  //PATH FOR REMOVING ITEM FROM MATCH LIST
  @Delete("/match-list/:userId")
  @Roles(UserType.JobSeeker)
  async removeMatchList(@Param("userId") _id: string, 
  @Body() matchListUpdateDto: MatchListUpdateDto): Promise<void> {
    
    //CHECK WHETHER PROVIDED IDs ARE VALID
    if (mongoose.isValidObjectId(_id) && mongoose.isValidObjectId(matchListUpdateDto.matchId)) {
      this.jobSeekerService.removeMatchList({_id: new mongoose.Types.ObjectId(_id)}, matchListUpdateDto);
    }
    else {
      throw new BadRequestException();
    }
    
  }
}
