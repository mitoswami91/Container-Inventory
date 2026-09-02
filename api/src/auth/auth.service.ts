import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { loginRequest } from './auth-dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async login(reqBody: loginRequest) {
        const validate = await this.prisma.user.findFirst({
            where: {
                user_name: reqBody.user_name
            }
        });

        if (validate) {

            if (validate.status) {

                const passwordCheck = await bcrypt.compare(reqBody.password, validate.password);

                if (passwordCheck) {
                    // Log the successful login event
                    await this.prisma.loginLog.create({
                        data: {
                            user_id: validate.id
                        }
                    });

                    console.log(
                        `>>> [USER LOGIN] ${validate.user_name} (${validate.full_name}) logged in at ${new Date().toLocaleTimeString()}`,
                    );

                    const payload = {
                        sub: String(validate.id),
                        aud: validate.user_name,
                        role: validate.role,
                        can_add: validate.can_add,
                        can_delete: validate.can_delete,
                        can_clear: validate.can_clear
                    };
                    return { access_token: await this.jwtService.signAsync(payload) };
                } else {
                    throw new UnauthorizedException('Invalid Password');
                }
            }
            else {
                throw new UnauthorizedException('User not active');
            }
        }
        else {
            throw new NotFoundException('User Not Found');
        }
    }
}
