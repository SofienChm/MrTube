import { Controller, Get, Query, Param, Res, Req, Header } from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MusicService } from './music.service.js';
import { SearchQueryDto } from '../shared/dto/search-query.dto.js';
import { ApiResponse, Song, SearchResult } from '../shared/interfaces/song.interface.js';
import type { Response } from 'express';

@ApiTags('Music')
@Controller('music')
export class MusicController {
  constructor(private readonly music: MusicService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search music tracks' })
  async search(@Query() query: SearchQueryDto): Promise<ApiResponse<SearchResult>> {
    const data = await this.music.searchMusic(query.q, query.filter);
    return { success: true, data };
  }

  @Get('details/:videoId')
  @ApiOperation({ summary: 'Get song details by video ID' })
  async details(@Param('videoId') videoId: string): Promise<ApiResponse<Song>> {
    const data = await this.music.getSongDetails(videoId);
    return { success: true, data };
  }

  @Get('related/:videoId')
  @ApiOperation({ summary: 'Get related songs for a video' })
  async related(@Param('videoId') videoId: string): Promise<ApiResponse<Song[]>> {
    const data = await this.music.getRelatedSongs(videoId);
    return { success: true, data };
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending music' })
  @ApiQuery({ name: 'region', required: false })
  async trending(@Query('region') region?: string): Promise<ApiResponse<Song[]>> {
    const data = await this.music.getTrending(region);
    return { success: true, data };
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get music recommendations based on recently played' })
  @ApiQuery({ name: 'videoIds', required: false })
  async recommendations(@Query('videoIds') videoIds?: string): Promise<ApiResponse<Song[]>> {
    const ids = videoIds?.split(',').filter(Boolean) ?? [];
    const data = await this.music.getRecommendations(ids);
    return { success: true, data };
  }

  @Get('personalized-picks')
  @ApiOperation({ summary: 'Get personalized song picks based on listening history' })
  @ApiQuery({ name: 'videoIds', required: false })
  async personalizedPicks(@Query('videoIds') videoIds?: string): Promise<ApiResponse<Song[]>> {
    const ids = videoIds?.split(',').filter(Boolean) ?? [];
    const data = await this.music.getPersonalizedPicks(ids);
    return { success: true, data };
  }

  @Get('quick-picks')
  @ApiOperation({ summary: 'Get a diverse set of quick pick songs' })
  async quickPicks(): Promise<ApiResponse<Song[]>> {
    const data = await this.music.getQuickPicks();
    return { success: true, data };
  }

  @Get('stream-url/:videoId')
  @ApiOperation({ summary: 'Get audio stream URL from Piped API' })
  async getStreamUrl(@Param('videoId') videoId: string): Promise<ApiResponse<{ url: string | null }>> {
    const url = await this.music.getStreamUrl(videoId);
    return { success: true, data: { url } };
  }

  @Get('stream/:videoId')
  @ApiOperation({ summary: 'Proxy audio stream from YouTube with Range support' })
  async streamAudio(@Param('videoId') videoId: string, @Req() req: Request, @Res() res: Response): Promise<void> {
    try {
      const range = req.headers['range'] as string | undefined;
      await this.music.streamAudio(videoId, res, range);
    } catch {
      if (!res.headersSent) {
        res.status(502).json({ success: false, message: 'Failed to stream audio' });
      }
    }
  }

  @Get('download/:videoId')
  @ApiOperation({ summary: 'Download a song as MP3 audio' })
  @Header('Accept-Ranges', 'bytes')
  async download(@Param('videoId') videoId: string, @Res() res: Response): Promise<void> {
    try {
      const { stream, title, artist } = await this.music.getDownloadStream(videoId);
      const filename = `${encodeURIComponent(title)} - ${encodeURIComponent(artist)}.mp3`;
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      stream.pipe(res);
    } catch {
      res.status(502).json({ success: false, message: 'Failed to download song' });
    }
  }
}
