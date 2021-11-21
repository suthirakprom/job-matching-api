import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { MatchListUpdateDto } from 'src/company/dto/matchList-update.dto';
import { Company, CompanyDocument } from 'src/company/schema/company.schema';
import { JobSeeker, JobSeekerDocument } from './schema/jobSeeker.schema';
import * as mongoose from "mongoose"
import { UserService } from 'src/user/user.service';

@Injectable()
export class JobSeekerService {
    constructor(@InjectModel(Company.name) private companyModel: Model<CompanyDocument>, 
    @InjectModel(JobSeeker.name) private jobseekerModel: Model<JobSeekerDocument>,
    private userService: UserService){}

    async findAll(): Promise<JobSeekerDocument[]> {
        return this.jobseekerModel.find().exec();
      }

    async find(email: any): Promise<JobSeeker | undefined> {
        const user = await this.userService.find(email);
        return await this.jobseekerModel.findOne({ user: user }).exec();
    }

    async findById(id: string): Promise<JobSeeker | undefined> {
        return await this.jobseekerModel.findById(id).exec()
    }


    async addFavorite(email:any,companyId:any): Promise<any|undefined>{
      const jobseeker= await this.find(email)
      const matchId=  new mongoose.Types.ObjectId(companyId)
      const company_= await this.companyModel.findById(companyId).exec();        
      
      if(jobseeker && company_){

        //add companyId to jobSeeker's linkedList
          
         await this.jobseekerModel.updateOne(
             {user: jobseeker.user},
             {$addToSet: {waitingList: matchId}}
         ) 

         // add jobSeekerId to company's waiting list
         await this.companyModel.updateOne(
          {_id: matchId},
          {$addToSet: {linkedList:jobseeker["_id"]}}
          ) 

      //    check if a company and job seeker are matched
         if(company_.waitingList.indexOf(jobseeker["_id"])>-1){
             
          await this.jobseekerModel.updateOne(
              {user: jobseeker.user},
              {$addToSet: {matchedList: matchId}}
               )

          await this.companyModel.updateOne(
              {_id: matchId},
              {$addToSet: {matchedList:jobseeker["_id"]}}
              )
         }
         else{
             console.log("There is no user");
             
         }

         return await jobseeker;
      }else{
        return "There is no User or Job Seeker"
      }
      

  }

    

    //ADD ITEM TO MATCH LIST
    async addMatchList(matchListFilterQuery: FilterQuery<JobSeekerDocument>, 
        matchListUpdateDto: MatchListUpdateDto): Promise<void> {
        
        const matchId = new mongoose.Types.ObjectId(matchListUpdateDto.matchId);
        //CHECK IF COMPANY AND JOB SEEKER ACTUALLY EXISTS
        if (await this.jobseekerModel.exists(matchListFilterQuery) && await this.companyModel.exists({_id: matchId})){
            await this.jobseekerModel.updateOne(matchListFilterQuery, {
                $addToSet:{
                    matchedList: matchId
                }
            });
        }
        else {
            throw new NotFoundException();
        }
    }

    //REMOVE ITEM FROM MATCH LIST
    async removeMatchList(matchListFilterQuery: FilterQuery<JobSeekerDocument>, 
        matchListUpdateDto: MatchListUpdateDto): Promise<void> {

        const matchId = new mongoose.Types.ObjectId(matchListUpdateDto.matchId);
        //CHECK IF COMPANY AND JOB SEEKER ACTUALLY EXISTS
        if (await this.jobseekerModel.exists(matchListFilterQuery) && await this.companyModel.exists({_id: matchId})){
            await this.jobseekerModel.updateOne(matchListFilterQuery, {
                $pull:{
                    matchedList: matchId
                }
            });
        }
        else {
            throw new NotFoundException();
        }
    }

}
