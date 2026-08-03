import { IsEnum } from 'class-validator';

export enum ReviewStatusEnum {
  approved = 'approved',
  rejected = 'rejected',
}

export class ModerateReviewDto {
  @IsEnum(ReviewStatusEnum)
  status: ReviewStatusEnum;
}
