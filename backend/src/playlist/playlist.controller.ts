import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PlaylistService } from './playlist.service.js';
import type { Response } from 'express';

@ApiTags('Playlist')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlist: PlaylistService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new playlist' })
  async create(@Req() req: any, @Body('name') name: string, @Body('cover') cover?: string) {
    const data = await this.playlist.create(req.user.id, name, cover);
    return { success: true, data };
  }

  @Get()
  @ApiOperation({ summary: 'Get all playlists for the current user' })
  async findAll(@Req() req: any) {
    const data = await this.playlist.findAll(req.user.id);
    return { success: true, data };
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download all songs in a playlist as ZIP' })
  async downloadAll(@Req() req: any, @Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      const { zip, name } = await this.playlist.downloadAll(id, req.user.id);
      const filename = `${encodeURIComponent(name)}-playlist.zip`;
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(zip);
    } catch {
      res.status(502).json({ success: false, message: 'Failed to download playlist' });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single playlist by ID' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    const data = await this.playlist.findOne(id, req.user.id);
    return { success: true, data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a playlist' })
  async remove(@Req() req: any, @Param('id') id: string) {
    const data = await this.playlist.remove(id, req.user.id);
    return { success: true, data };
  }

  @Post(':id/songs')
  @ApiOperation({ summary: 'Add a song to a playlist' })
  async addSong(
    @Req() req: any,
    @Param('id') id: string,
    @Body() song: { videoId: string; title: string; artist: string; thumbnail: string; duration: number },
  ) {
    const data = await this.playlist.addSong(id, req.user.id, song);
    return { success: true, data };
  }

  @Delete(':id/songs/:songId')
  @ApiOperation({ summary: 'Remove a song from a playlist' })
  async removeSong(@Req() req: any, @Param('id') id: string, @Param('songId') songId: string) {
    const data = await this.playlist.removeSong(id, songId, req.user.id);
    return { success: true, data };
  }
}
