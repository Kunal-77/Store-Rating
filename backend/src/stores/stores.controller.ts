import { Controller, Get, Param, Post, Body, UseGuards, Req, Query } from '@nestjs/common';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) { }

  // Get all stores (with average + myRating)
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Req() req, @Query('owned') owned?: string) {
    const userId = req.user.id;
    const role = req.user.role;

    if (owned === 'true') {
      return this.storesService.findOwnedStores(userId, role);
    }

    return this.storesService.findAll(userId);
  }

  // Get one store (with average + myRating)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return this.storesService.findOneWithAverage(Number(id), userId);
  }

  // Create a new store
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) {
    return this.storesService.create(body);
  }

  // Get ratings for a specific store
  @UseGuards(JwtAuthGuard)
  @Get(':id/ratings')
  getRatings(@Param('id') id: number) {
    return this.storesService.getRatingsForStore(Number(id));
  }
}
