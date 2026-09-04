import { IsEnum } from 'class-validator';

export enum ReviewStatusEnum {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

export class ModerateReviewDto {
  @IsEnum(ReviewStatusEnum)
  status: ReviewStatusEnum;
}
