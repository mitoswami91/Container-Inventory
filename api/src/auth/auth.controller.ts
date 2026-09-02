import { Body, Controller, Post } from '@nestjs/common';
import { loginRequest } from './auth-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }



    @Post('/')
    login(@Body() reqBody: loginRequest) {
        return this.authService.login(reqBody);
    }



}


