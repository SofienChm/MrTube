import { IsString, IsOptional, IsIn, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiProperty({ description: 'Search query' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  q: string;

  @ApiPropertyOptional({ enum: ['music_songs', 'music_videos', 'music_albums', 'music_playlists'], default: 'music_songs' })
  @IsOptional()
  @IsIn(['music_songs', 'music_videos', 'music_albums', 'music_playlists'])
  filter: string = 'music_songs';
}
