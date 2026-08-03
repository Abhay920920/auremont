import { Controller, Get, Patch, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('me')
  findByUserId(@Request() req: any) {
    return this.notificationsService.findByUserId(req.user.id);
  }

  @Patch('me/read')
  markAsRead(@Request() req: any) {
    return this.notificationsService.markAsRead(req.user.id);
  }
}
