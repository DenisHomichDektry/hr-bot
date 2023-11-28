import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Public } from './decorators';
import { GoogleOauthGuard } from './guards';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(GoogleOauthGuard)
  @Get('google')
  async googleAuth() {}

  @Public()
  @UseGuards(GoogleOauthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Req() req, @Res() res) {
    const jwt = await this.authService.signIn(req.user);

    if (!jwt) {
      return res.redirect(process.env.WEB_APP_URL + '/no-access');
    }

    return res.redirect(process.env.WEB_APP_URL + '/?jwt=' + jwt);
  }

  // TODO: remove this before production
  testObj = {
    id: 1,
    message: 'test3',
  };

  @Get('test/:id')
  async test(@Param('id') id: number) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return this.testObj;
  }

  @Post('test')
  async testPost(@Body() body) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    this.testObj = body;
    return body;
  }
}
