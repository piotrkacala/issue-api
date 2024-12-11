import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateTrackerDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    @IsEnum(['t', 'p', 'i', 'd'])
    status: string;

    @IsEnum(['e', 's', 't'])
    category: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    points: number;

    @IsInt()
    @IsOptional()
    parentId: number;
}
