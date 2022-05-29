import {LeaderboardUserType} from '../../components/pages/leaderboard/leaderboard.types';

export const TEAM_NAME = '12_SOLITAIRE_TEAM';

export interface LeaderboardNewLeaderRequest {
  data: LeaderboardUserType;
  ratingFieldName: string;
  teamName: typeof TEAM_NAME;
}

export interface LeaderboardRequest {
  ratingFieldName: string;
  cursor: number;
  limit: number;
}
