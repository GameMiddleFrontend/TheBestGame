import React, {useEffect} from 'react';
import {compose} from 'redux';
import {useDispatch, useSelector} from 'react-redux';

import AvatarComponent from '@common/avatar';
import withAuth from '@hooks/chechAuthHookHOC';
import {
  Actions as LeaderboardActions,
  IStore as ILeaderboardStore,
} from '@store/reducers/leaderboard/leaderboard.ducks';
import IConfiguredStore from '@store/reducers/configured-store';

import './liderboard.scss';

const LeaderboardPage = () => {
  const dispatch = useDispatch();
  const {items: leaderList} = useSelector<IConfiguredStore, ILeaderboardStore>((state) => state.leaderboard);

  useEffect(() => {
    dispatch(LeaderboardActions.getLeaders());
  }, []);

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
          {leaderList.map(({data}, index) => {
            const {user, points} = data;
            const position = index + 1;

            return (
              <tr key={position} className="table-row">
                <td>{position}</td>
                <td className="user-avatar-column">
                  <AvatarComponent className={'avatar-sm'} imgSrc={user.avatar} />
                </td>
                <td className="user-column">{user.display_name ?? user.login}</td>
                <td>{points}</td>
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
