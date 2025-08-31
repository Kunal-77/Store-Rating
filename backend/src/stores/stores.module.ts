import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { Store } from './store.entity';
import { Rating } from '../ratings/rating.entity';
import { RatingsModule } from '../ratings/ratings.module'; // import RatingsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, Rating]),
    RatingsModule, // use exported RatingsService from RatingsModule
  ],
  providers: [StoresService],
  controllers: [StoresController],
  exports: [StoresService],
})
export class StoresModule {}
