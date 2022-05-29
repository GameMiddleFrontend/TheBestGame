import {CurrentUserItem} from '../../../models/user.model';

export type LeaderboardUserDataType = {
  data: LeaderboardUserType;
};

export type LeaderboardUserType = {
  user: CurrentUserItem;
  points: number;
};
