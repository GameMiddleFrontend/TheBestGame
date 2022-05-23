import React, {useEffect, useState} from 'react';
import {compose} from 'redux';

import {LeaderboardUserType} from './leaderboard.types';
import AvatarComponent from '@common/avatar';
import LeaderboardAPI from '@services/leaderboardAPI';
import withAuth from '@hooks/chechAuthHookHOC';

import './liderboard.scss';

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
    <div className="page-container">
      <table className="table">
        <thead className="table-header">
          <tr>
            <th>Место</th>
            <th className="user-avatar-column">{''}</th>
            <th className="user-column">Игрок</th>
            <th>Счет</th>
          </tr>
        </thead>
        <tbody>
          {leaderList.map((item, index) => {
            const position = index + 1;

            return (
              <tr key={position} className="table-row">
                <td>{position}</td>
                <td className="user-avatar-column">
                  <AvatarComponent className={'avatar-sm'} imgSrc={item.avatar} />
                </td>
                <td className="user-column">{item.userName}</td>
                <td>{item.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const LeaderboardPageHOC = compose(withAuth(LeaderboardPage));

export default LeaderboardPageHOC;
