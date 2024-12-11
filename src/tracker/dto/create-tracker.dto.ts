import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateTrackerDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(['t', 'p', 'i', 'd'])
    status: string;

    @IsDate()
    created_date: Date

    @IsDate()
    updated_date: Date
}
