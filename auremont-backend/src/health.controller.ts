import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  getRoot() {
    return {
      name: 'Auremont Luxury API',
      status: 'online',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
    };
  }
}
