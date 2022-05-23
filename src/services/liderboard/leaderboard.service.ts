import ServiceUtils from '../service.utils';
import {LeaderboardNewLeaderRequest, LeaderboardRequest, TEAM_NAME} from './leaderboard.helper';
import {LeaderboardUserDataType, LeaderboardUserType} from '../../components/pages/leaderboard/leaderboard.types';

const _leaderboardBaseUrl = '/leaderboard';

class LeaderboardService {
  static async getLeaders(): Promise<LeaderboardUserDataType[]> {
    /*TODO пейджинг*/
    const leaderboard: LeaderboardRequest = {
      ratingFieldName: 'points',
      cursor: 0,
      limit: 10,
    };
    return await ServiceUtils.post(`${_leaderboardBaseUrl}/${TEAM_NAME}`, leaderboard);
  }

  static async addLeaderboardItem(data: LeaderboardUserType) {
    const leaderboard: LeaderboardNewLeaderRequest = {
      teamName: TEAM_NAME,
      ratingFieldName: 'points',
      data,
    };
    return await ServiceUtils.post(`${_leaderboardBaseUrl}`, leaderboard);
  }
}

export default LeaderboardService;
