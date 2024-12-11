import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackerModule } from './tracker/tracker.module';
import { Tracker } from './tracker/entities/tracker.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          password: configService.get<string>('DB_PASSWORD'),
          username: configService.get<string>('DB_USER'),
          database: configService.get<string>('DB_NAME'),
          entities: [Tracker],
          synchronize: true,
          logging: true,
        }
      }

    }),
    TrackerModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
