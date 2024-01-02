class ExplicitContentDto {
  filter_enabled: boolean;
  filter_locked: boolean;
}

class ExternalUrlsDto {
  spotify: string;
}

class FollowersDto {
  href: string;
  total: number;
}

class ImageDto {
  height: number;
  url: string;
  width: number;
}

export class SpotifyUserDto {
  country: string;
  display_name: string;
  email: string;
  explicit_content: ExplicitContentDto;
  external_urls: ExternalUrlsDto;
  followers: FollowersDto;
  href: string;
  id: string;
  images: ImageDto[];
  product: string;
  type: string;
  uri: string;
}
