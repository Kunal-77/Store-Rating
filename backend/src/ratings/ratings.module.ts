import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { Rating } from './rating.entity';
import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, User, Store])], //  include User + Store
  providers: [RatingsService],
  controllers: [RatingsController],
  exports: [RatingsService], //  so StoresModule can use it
})
export class RatingsModule {}
