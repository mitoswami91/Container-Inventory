import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator"


export class newAddContainerRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(11)
  @MinLength(11)
  cont_no: string

  @IsNotEmpty()
  @IsNumber()
  size: number

  @IsNotEmpty()
  @IsString()
  location: string

  @IsNotEmpty()
  @IsNumber()
  user_id: number

  @IsString()
  location_remarks:string
}

export class findByUserId {

  @IsNotEmpty()
  @IsNumber()
  user_id: number
}