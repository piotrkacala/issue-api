import { IsDate, IsEnum, IsInt, IsNotEmpty, IsString, Min } from "class-validator";

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
    created_date: Date;

    @IsDate()
    updated_date: Date;

    @IsString()
    @IsNotEmpty()
    @IsEnum(['e', 's', 't'])
    category: string;

    @IsInt()
    @Min(0)
    points: number;

    @IsInt()
    parentId: number;
}
