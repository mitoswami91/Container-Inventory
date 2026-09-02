import { IsString, IsNotEmpty, IsBoolean, MaxLength, MinLength, IsOptional } from 'class-validator'

export class newUserRequest {

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @MinLength(3)
    full_name: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    @MinLength(3)
    user_name: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @MinLength(8)
    password: string

    @IsNotEmpty()
    @IsBoolean()
    status: boolean

    @IsOptional()
    @IsString()
    role?: string

    @IsOptional()
    @IsBoolean()
    can_add?: boolean

    @IsOptional()
    @IsBoolean()
    can_delete?: boolean

    @IsOptional()
    @IsBoolean()
    can_clear?: boolean

    created_at:Date

    updated_at:Date
}

export class updateUserRequest {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    @MinLength(3)
    full_name?: string

    @IsOptional()
    @IsString()
    @MaxLength(20)
    @MinLength(3)
    user_name?: string

    @IsOptional()
    @IsString()
    @MaxLength(255)
    @MinLength(8)
    password?: string

    @IsOptional()
    @IsBoolean()
    status?: boolean

    @IsOptional()
    @IsString()
    role?: string

    @IsOptional()
    @IsBoolean()
    can_add?: boolean

    @IsOptional()
    @IsBoolean()
    can_delete?: boolean

    @IsOptional()
    @IsBoolean()
    can_clear?: boolean
}