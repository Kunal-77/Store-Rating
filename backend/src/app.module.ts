import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { Store } from './stores/store.entity';
import { Rating } from './ratings/rating.entity';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { RatingsModule } from './ratings/ratings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), //  load .env globally

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST') || 'localhost',
        port: parseInt(config.get<string>('DB_PORT') || '3306', 10), //  fallback
        username: config.get<string>('DB_USER') || 'root',
        password: config.get<string>('DB_PASS') || '',
        database: config.get<string>('DB_NAME') || 'store_ratings',
        entities: [User, Store, Rating],
        synchronize: false, //  disable in production
      }),
    }),

    UsersModule,
    StoresModule,
    RatingsModule,
    AuthModule,
  ],
})
export class AppModule {}
