import {
  Controller,
  Post,
  UseGuards,
  Headers,
  Param,
  Delete,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Subscription } from 'src/models/all.entity';

@Controller('users/:userId/subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subsService: SubscriptionsService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  subscribe(
    @Headers('authorization') auth: string,
    @Param('userId') userId: string,
  ): Promise<Subscription> {
    const { id } = Object(this.jwtService.decode(auth.split(' ')[1]));
    return this.subsService.subscribe(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  unsubscribe(
    @Headers('authorization') auth: string,
    @Param('userId') userId: string,
  ): Promise<Subscription> {
    const { id } = Object(this.jwtService.decode(auth.split(' ')[1]));
    return this.subsService.unsubscribe(userId, id);
  }
}
