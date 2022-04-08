import React from 'react';

function LeaderboardPage() {
  const leaderList = [{userName: 'userName', points: 123123123}];

  const LeaderboardRow = (props: {position: number; avatar: string; userName: string; points: number}) => {
    return (
      <div>
        <div>{props.position}</div>
        <div>{props.avatar}</div>
        <div>{props.userName}</div>
        <div>{props.points}</div>
      </div>
    );
  };

  return <div className="page">LeaderboardPage</div>;
}

export default LeaderboardPage;
