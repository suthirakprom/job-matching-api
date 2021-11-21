import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import * as mongoose from "mongoose";
import { Company, CompanyDocument }  from './schema/company.schema'
import { MatchListUpdateDto } from './dto/matchList-update.dto';
import { JobSeeker, JobSeekerDocument } from 'src/job-seeker/schema/jobSeeker.schema';
import { UserService } from '../user/user.service';
import { match } from 'assert/strict';
import { JobSeekerService } from 'src/job-seeker/job-seeker.service';

@Injectable()
export class CompanyService {
    constructor(@InjectModel(Company.name) private companyModel: Model<CompanyDocument>, 
    @InjectModel(JobSeeker.name) private jobseekerModel: Model<JobSeekerDocument>,
    private readonly userService: UserService){}

    async findAll(): Promise<CompanyDocument[]> {
        return await this.companyModel.find().exec();
    }

    async find(email: any): Promise<Company | undefined> {
        const user = await this.userService.find(email);
        return await this.companyModel.findOne({ user: user }).exec();
    }

    async findById(id: string): Promise<Company | undefined> {
        return await this.companyModel.findById(id).exec()
    }


    async create(email: any, company: any) {
        const user = await this.userService.find(email);
        if (!user) {
            throw new NotFoundException();
        }
        if (await this.companyModel.findOne({ name: company.name })) {
            throw new NotFoundException();
        } else {
          const companyObject = { user: user, ...company };
          await this.companyModel.create(companyObject);
          return await this.companyModel.findOne({ name: company.name });
        }
      }
    
    async update(email: any, updateCompany: any) {
        const user = await this.userService.find(email);
        if (!user) {
            throw new NotFoundException();
        }
    
        const company = await this.companyModel.findOne({ user });
        if (!company) {
            throw new NotFoundException();
        }
    
        await company.updateOne(updateCompany);
        return await this.companyModel.findOne({ user });
    }
    

    async addFavorite(email:any,jobSeekerId:any): Promise<Company|undefined>{
        const company= await this.find(email)
        const matchId=  new mongoose.Types.ObjectId(jobSeekerId)
        const jobSeeker_= await this.jobseekerModel.findById(jobSeekerId).exec();        
        
        if(company && jobSeeker_){

            // add jobSeekerId to company's waiting list
           await this.companyModel.updateOne(
               {user: company.user},
               {$addToSet: {waitingList: matchId}}
           );

           //add companyId to jobSeeker's linkedList
           await this.jobseekerModel.updateOne(
            {_id: matchId},
            {$addToSet: {linkedList:company["_id"]}}
            )

        //    check if a company and job seeker are matched
           if(jobSeeker_.waitingList.indexOf(company["_id"])>-1){
              

            // add to match list   
           await  this.companyModel.updateOne(
                {user: company.user},
                {$addToSet: {matchedList: matchId}}
            )

           await  this.jobseekerModel.updateOne(
                {_id: matchId},
                {$addToSet: {matchedList:company["_id"]}}
            ) 
           }
           else{
               console.log("There is no user");
               
           }


        }
        return await company;

    }


    //ADD ITEM TO MATCH LIST
    async addMatchList(matchListFilterQuery: FilterQuery<CompanyDocument>, 
        matchListUpdateDto: MatchListUpdateDto): Promise<void> {

        const matchId = new mongoose.Types.ObjectId(matchListUpdateDto.matchId);
        //CHECK IF COMPANY AND JOB SEEKER ACTUALLY EXISTS
        if (await this.companyModel.exists(matchListFilterQuery) && await this.jobseekerModel.exists({_id: matchId})){
            await this.companyModel.updateOne(matchListFilterQuery, {
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
    async removeMatchList(matchListFilterQuery: FilterQuery<CompanyDocument>, 
        matchListUpdateDto: MatchListUpdateDto): Promise<void> {
            
        const matchId = new mongoose.Types.ObjectId(matchListUpdateDto.matchId);
        //CHECK IF COMPANY AND JOB SEEKER ACTUALLY EXISTS
        if (await this.companyModel.exists(matchListFilterQuery) && await this.jobseekerModel.exists({_id: matchId})){
            await this.companyModel.updateOne(matchListFilterQuery, {
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
