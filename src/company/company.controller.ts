import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { NotFoundError } from 'rxjs';
import { Roles } from 'src/auth/roles.decorator';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { UpdateCompanyDto } from './dto/updateCompany.dto';
import { UserType } from 'src/auth/userType.enum';
import { CompanyService } from './company.service';
import { request, Request } from 'express';
import { MatchListUpdateDto } from './dto/matchList-update.dto';
import { Company } from './schema/company.schema';

@ApiBearerAuth()
@Controller('company')
@ApiBearerAuth()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('/profile')
  @Roles(UserType.Company)
  async createProfile(
    @Req() request: Request,
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<any> {
    return await this.companyService.create(request['user'], createCompanyDto);
  }

  @Patch('/profile')
  @Roles(UserType.Company)
  async updateProfile(
    @Req() request: Request,
    @Body() companyDto: UpdateCompanyDto,
  ): Promise<any> {
    return await this.companyService.update(request['user'], companyDto);
  }

  @Get("/profile")
  @Roles(UserType.Company)
  async getProfile(
    @Req() request:Request
  ):Promise <Company | undefined>{

    return await this.companyService.find(request["user"])
  }

  @Get('/all')
  @Roles(UserType.JobSeeker)
  async getCompanies(@Req() request: Request): Promise<any> {
    return await this.companyService.findAll();
  }

  @Get('/:companyId')
  @Roles(UserType.JobSeeker)
  async getCompanyById(@Param('companyId') id: string): Promise<Company | undefined> {
    return await this.companyService.findById(id);
  }

  @Patch("/keep")
  @Roles(UserType.Company)
  async keep(
    @Req() request:Request,
    @Body() IdDto:MatchListUpdateDto
  ){
    return await this.companyService.addFavorite(request["user"],IdDto.matchId)

  }


  //PATH FOR ADDING ITEM TO MATCH LIST
  @Patch('/match-list/:userId')
  @Roles(UserType.Company)
  async addMatchList(
    @Param('userId') _id: string,
    @Body() matchListUpdateDto: MatchListUpdateDto,
  ): Promise<void> {
    //CHECK WHETHER PROVIDED IDs ARE VALID
    if (
      mongoose.isValidObjectId(_id) &&
      mongoose.isValidObjectId(matchListUpdateDto.matchId)
    ) {
      this.companyService.addMatchList(
        { _id: new mongoose.Types.ObjectId(_id) },
        matchListUpdateDto,
      );
    } else {
      throw new BadRequestException();
    }
  }


  //PATH FOR REMOVING ITEM FROM MATCH LIST
  @Delete('/match-list/:userId')
  @Roles(UserType.Company)
  async removeMatchList(
    @Param('userId') _id: string,
    @Body() matchListUpdateDto: MatchListUpdateDto,
  ): Promise<void> {
    //CHECK WHETHER PROVIDED IDs ARE VALID
    if (
      mongoose.isValidObjectId(_id) &&
      mongoose.isValidObjectId(matchListUpdateDto.matchId)
    ) {
      this.companyService.removeMatchList(
        { _id: new mongoose.Types.ObjectId(_id) },
        matchListUpdateDto,
      );
    } else {
      throw new BadRequestException();
    }
  }
}
