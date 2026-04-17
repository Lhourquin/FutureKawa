import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

class LoginDto {
  email!: string;
  password!: string;
}

class TokenDto {
  accessToken!: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Authentification → JWT', description: 'Retourne un token Bearer à inclure dans le header Authorization.' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: TokenDto, description: 'Token JWT valide 24 h.' })
  @ApiUnauthorizedResponse({ description: 'Identifiants invalides.' })
  login(@Body() body: LoginDto): { accessToken: string } {
    return this.authService.login(body.email, body.password);
  }
}
