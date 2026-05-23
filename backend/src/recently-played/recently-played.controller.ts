import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RecentlyPlayedService } from './recently-played.service';

@ApiTags('Recently Played')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('recently-played')
export class RecentlyPlayedController {
  constructor(private readonly recentlyPlayed: RecentlyPlayedService) {}

  @Post()
  @ApiOperation({ summary: 'Record a played song' })
  async record(
    @Req() req: any,
    @Body() song: { videoId: string; title: string; artist: string; thumbnail: string; duration: number },
  ) {
    const data = await this.recentlyPlayed.record(req.user.id, song);
    return { success: true, data };
  }

  @Get()
  @ApiOperation({ summary: 'Get recently played songs' })
  async findAll(@Req() req: any) {
    const data = await this.recentlyPlayed.findAll(req.user.id);
    return { success: true, data };
  }
}
