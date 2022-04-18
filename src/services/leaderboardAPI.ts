import {LeaderboardUserType} from '../components/pages/leaderboard/leaderboard.types';

const leaderList: LeaderboardUserType[] = [
  {userName: 'userName', points: 123123123},
  {userName: 'userName2', points: 123123123},
  {userName: 'userName3', points: 123123123},
];

class LeaderBoardAPI {
  static async getLeaders(): Promise<LeaderboardUserType[]> {
    const response = await Promise.resolve(leaderList);
    return response;
  }
}

export default LeaderBoardAPI;
