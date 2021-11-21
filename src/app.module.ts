import { MiddlewareConsumer, Module, NestMiddleware, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from './user/user.module';
import { PreauthMiddleware } from './auth/preauth.middlewate';
import { JobSeekerModule } from './job-seeker/job-seeker.module';
import { CompanyModule } from './company/company.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot('mongodb+srv://Senrith:senrith.ney19@job-matching.czumf.mongodb.net/Job-Matching?retryWrites=true&w=majority'),
    UserModule,
    JobSeekerModule,
    CompanyModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware).forRoutes({
      path:'*', method: RequestMethod.ALL
    })
  }
}
