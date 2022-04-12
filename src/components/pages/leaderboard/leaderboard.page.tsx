import React, {useEffect, useState} from 'react';
import {LeaderboardUserType} from './leaderboard.types';
import AvatarComponent from '../../common/avatar';
import LeaderboardAPI from '../../../services/leaderboardAPI';
import TopBarComponent from '../../common/top-bar/top-bar.component';

const LeaderboardPage = () => {
  const [leaderList, setLeaderList] = useState<LeaderboardUserType[]>([]);

  useEffect(() => {
    LeaderboardAPI.getLeaders()
      .then((result) => {
        setLeaderList(result);
      })
      .catch((err: Error) => {
        console.log(err.message);
      });
  }, [leaderList]);

  return (
    <div className="page">
      <TopBarComponent />
      <table>
        <thead>
          <tr>
            <th>Место</th>
            <th colSpan={2}>Игрок</th>
            <th>Счет</th>
          </tr>
        </thead>
        <tbody>
          {leaderList.map((item, index) => {
            const position = index + 1;

            return (
              <tr key={position}>
                <td>{position}</td>
                <td>
                  <AvatarComponent className={'avatar-sm'} imgSrc={item.avatar} />
                </td>
                <td>{item.userName}</td>
                <td>{item.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage;
