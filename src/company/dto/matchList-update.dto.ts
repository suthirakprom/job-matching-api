import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class MatchListUpdateDto {
    @IsNotEmpty()
    @ApiProperty()
    matchId: string
}