import React from 'react';
import {LeaderboardUserType} from './leaderboard.types';

const LeaderboardPage = () => {
  const leaderList: LeaderboardUserType[] = [
    {userName: 'userName', points: 123123123},
    {userName: 'userName2', points: 123123123},
    {userName: 'userName3', points: 123123123},
  ];

  return (
    <div className="page">
      <h2>Таблица лидеров</h2>
      <table>
        <tr>
          <th>Место</th>
          <th colSpan={2}>Игрок</th>
          <th>Счет</th>
        </tr>
        {leaderList.map((item, index) => {
          const position = index + 1;

          return (
            <tr key={position}>
              <td>{position}</td>
              <td>{item.avatar}</td> {/*TODO добавится компонент аватара, из другой ветки*/}
              <td>{item.userName}</td>
              <td>{item.points}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default LeaderboardPage;
