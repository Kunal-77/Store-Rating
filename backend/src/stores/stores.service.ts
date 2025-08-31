import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { RatingsService } from '../ratings/ratings.service';
import { User } from '../users/user.entity';
import { Rating } from '../ratings/rating.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) private repo: Repository<Store>,
    @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
    private ratingsService: RatingsService,
  ) {}

  //  Get all stores with average rating + logged-in user's rating
  async findAll(userId?: number) {
    const stores = await this.repo.find({
      relations: ['ratings', 'ratings.user', 'owner'],
    });

    return stores.map((store) => {
      const avg =
        store.ratings.length > 0
          ? Number(
            (
              store.ratings.reduce((sum, r) => sum + r.rating, 0) /
              store.ratings.length
            ).toFixed(1),
          )
          : null;

      let myRating: number | null = null;
      if (userId) {
        const userRating = store.ratings.find((r) => r.user.id === userId);
        myRating = userRating ? userRating.rating : null;
      }

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: avg,
        myRating,
      };
    });
  }

  // Get one store with average rating + myRating
  async findOneWithAverage(id: number, userId?: number) {
    const store = await this.repo.findOne({
      where: { id },
      relations: ['ratings', 'ratings.user', 'owner'],
    });

    if (!store) throw new NotFoundException('Store not found');

    const avg =
      store.ratings.length > 0
        ? Number(
          (
            store.ratings.reduce((sum, r) => sum + r.rating, 0) /
            store.ratings.length
          ).toFixed(1),
        )
        : null;

    let myRating: number | null = null;
    if (userId) {
      const userRating = store.ratings.find((r) => r.user.id === userId);
      myRating = userRating ? userRating.rating : null;
    }

    return {
      id: store.id,
      name: store.name,
      address: store.address,
      averageRating: avg,
      myRating,
    };
  }

  // Create a store (with validation for owner)
  async create(data: Partial<Store>) {
    if (!data.name) throw new BadRequestException('Store name is required');
    if (!data.email) throw new BadRequestException('Store email is required');
    if (!data.address) throw new BadRequestException('Store address is required');

    const store = this.repo.create({
      name: data.name,
      email: data.email,
      address: data.address,
    });

    if (data.owner && (data.owner as any).id) {
      const ownerId = (data.owner as any).id;

      // Validate owner exists and has correct role
      const owner = await this.repo.manager.findOne(User, {
        where: { id: ownerId, role: 'OWNER' },
      });

      if (!owner) {
        throw new BadRequestException(
          `Owner with id ${ownerId} not found or not an OWNER`,
        );
      }

      store.owner = owner;
    }

    return this.repo.save(store);
  }

  // Get all ratings for a store
  async getRatingsForStore(id: number) {
    const store = await this.repo.findOne({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');

    return this.ratingsService.getStoreRatings(id);
  }

  // Get stores owned by a specific owner
  async findOwnedStores(ownerId: number, role: string) {
    if (role !== 'OWNER') {
      throw new ForbiddenException('Only store owners can access this resource');
    }

    const stores = await this.repo.find({
      where: { owner: { id: ownerId } },
      relations: ['ratings', 'ratings.user', 'owner'],
    });

    return stores.map((store) => {
      const avg =
        store.ratings.length > 0
          ? Number(
            (
              store.ratings.reduce((sum, r) => sum + r.rating, 0) /
              store.ratings.length
            ).toFixed(1),
          )
          : null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: avg,
      };
    });
  }
}
