import { IsString, IsNotEmpty, MinLength, MaxLength} from 'class-validator'

export class loginRequest {

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    user_name: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(255)
    password: string
}
