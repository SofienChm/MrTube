import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '../shared/prisma.js';
import AdmZip from 'adm-zip';
import ytdl from '@distube/ytdl-core';

@Injectable()
export class PlaylistService {

  /**
   * Create a new playlist for a user.
   */
  async create(userId: string, name: string, cover?: string) {
    return prisma.playlist.create({ data: { userId, name, cover } });
  }

  /**
   * Get all playlists for a user.
   */
  async findAll(userId: string) {
    return prisma.playlist.findMany({ where: { userId }, include: { songs: true } });
  }

  /**
   * Get a single playlist by ID.
   */
  async findOne(id: string, userId: string) {
    const playlist = await prisma.playlist.findFirst({ where: { id, userId }, include: { songs: true } });
    if (!playlist) throw new NotFoundException('Playlist not found');
    return playlist;
  }

  /**
   * Delete a playlist (only if owned by the user).
   */
  async remove(id: string, userId: string) {
    const playlist = await prisma.playlist.findFirst({ where: { id, userId } });
    if (!playlist) throw new NotFoundException('Playlist not found');
    await prisma.playlistSong.deleteMany({ where: { playlistId: id } });
    await prisma.playlist.delete({ where: { id } });
    return { deleted: true };
  }

  /**
   * Add a song to a playlist.
   */
  async addSong(playlistId: string, userId: string, song: {
    videoId: string; title: string; artist: string; thumbnail: string; duration: number;
  }) {
    const playlist = await prisma.playlist.findFirst({ where: { id: playlistId, userId } });
    if (!playlist) throw new NotFoundException('Playlist not found');
    return prisma.playlistSong.create({ data: { playlistId, ...song } });
  }

  /**
   * Remove a song from a playlist.
   */
  async removeSong(playlistId: string, songId: string, userId: string) {
    const playlist = await prisma.playlist.findFirst({ where: { id: playlistId, userId } });
    if (!playlist) throw new NotFoundException('Playlist not found');
    await prisma.playlistSong.delete({ where: { id: songId } });
    return { deleted: true };
  }

  async downloadAll(id: string, userId: string): Promise<{ zip: Buffer; name: string }> {
    const playlist = await prisma.playlist.findFirst({ where: { id, userId }, include: { songs: true } });
    if (!playlist) throw new NotFoundException('Playlist not found');

    const zip = new AdmZip();
    for (const song of playlist.songs) {
      try {
        const info = await ytdl.getInfo(song.videoId);
        const title = info.videoDetails.title.replace(/[^\w\s()-]/g, '');
        const author = info.videoDetails.author?.name?.replace(/[^\w\s()-]/g, '') ?? 'Unknown';
        const stream = ytdl(song.videoId, { quality: 'lowestaudio', filter: 'audioonly' });
        const chunks: Buffer[] = [];
        for await (const chunk of stream) {
          chunks.push(chunk as Buffer);
        }
        zip.addFile(`${author} - ${title}.mp3`, Buffer.concat(chunks));
      } catch {
        zip.addFile(`${song.artist} - ${song.title}.mp3`, Buffer.from(''));
      }
    }

    return { zip: zip.toBuffer(), name: playlist.name.replace(/[^\w\s]/g, '') };
  }
}
