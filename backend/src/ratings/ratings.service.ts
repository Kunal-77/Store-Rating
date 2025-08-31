import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Store) private storeRepo: Repository<Store>,
  ) {}

  // Create or update rating
  async createOrUpdate(userId: number, storeId: number, ratingValue: number) {
    // Ensure user exists
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    // Ensure store exists
    const store = await this.storeRepo.findOne({ where: { id: storeId } });
    if (!store) throw new NotFoundException(`Store with id ${storeId} not found`);

    // Check if rating already exists
    let rating = await this.ratingRepo.findOne({
      where: { user: { id: userId }, store: { id: storeId } },
      relations: ['user', 'store'],
    });

    if (rating) {
      rating.rating = ratingValue;
    } else {
      rating = this.ratingRepo.create({
        rating: ratingValue,
        user,
        store,
      });
    }

    return this.ratingRepo.save(rating);
  }

  // Get all ratings + average for a store
  async getStoreRatings(storeId: number) {
    const ratings = await this.ratingRepo.find({
      where: { store: { id: storeId } },
      relations: ['user'],
    });

    const avg =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    return { average: avg, ratings };
  }

  async getAverageRating(storeId: number): Promise<number> {
    const { average } = await this.getStoreRatings(storeId);
    return average;
  }

  // For admin dashboard: total count
  async countAll(): Promise<number> {
    return this.ratingRepo.count();
  }
}
