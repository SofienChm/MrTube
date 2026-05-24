import { Controller, Get, Query, Param, Res, Header } from '@nestjs/common';
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

  @Get('details')
  @ApiOperation({ summary: 'Get song details by video ID' })
  @ApiQuery({ name: 'videoId', required: true })
  async details(@Query('videoId') videoId: string): Promise<ApiResponse<Song>> {
    const data = await this.music.getSongDetails(videoId);
    return { success: true, data };
  }

  @Get('related')
  @ApiOperation({ summary: 'Get related songs for a video' })
  @ApiQuery({ name: 'videoId', required: true })
  async related(@Query('videoId') videoId: string): Promise<ApiResponse<Song[]>> {
    const data = await this.music.getRelatedSongs(videoId);
    return { success: true, data };
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending music' })
  async trending(): Promise<ApiResponse<Song[]>> {
    const data = await this.music.getTrending();
    return { success: true, data };
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
