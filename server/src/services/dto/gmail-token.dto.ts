import { IsNotEmpty, IsString } from 'class-validator';

class GmailTokenDTO {
  @IsString()
  @IsNotEmpty()
  readonly code: string;

  @IsString()
  @IsNotEmpty()
  readonly redirect_uri: string;
}

export default GmailTokenDTO;
