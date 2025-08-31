import { Controller, Post, Body, Req, UseGuards, BadRequestException, Get } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async rate(
    @Req() req,
    @Body('storeId') storeId: number,
    @Body('rating') rating: number,
  ) {
    const userId = req.user.id; // from JWT
    if (!userId || !storeId || rating === undefined) {
      throw new BadRequestException('userId, storeId, and rating are required');
    }

    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    return await this.ratingsService.createOrUpdate(
      Number(userId),
      Number(storeId),
      Number(rating),
    );
  }

  //  NEW: Admin Dashboard – get total ratings count
  @Get('count')
  async getRatingsCount() {
    const count = await this.ratingsService.countAll();
    return { count }; //  respond with { count: number }
  }
}
