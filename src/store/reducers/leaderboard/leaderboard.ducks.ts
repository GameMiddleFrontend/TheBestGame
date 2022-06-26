import {createAction, createReducer, PayloadAction, Reducer} from '@reduxjs/toolkit';
import {call, put, takeEvery, select} from 'typed-redux-saga';
import {Actions as notificationActions} from '../notification/notification.duck';
import {getExceptionByError} from '@utils/notification';
import {getUserItem} from '../user/user.ducks';
import {BaseActionType} from '../../redux.base.types';
import LeaderboardService from '../../../services/liderboard';
import {LeaderboardUserDataType, LeaderboardUserType} from '@components/pages/leaderboard/leaderboard.types';
import {AddLeaderType} from '@models/leaderboard.model';

enum ActionTypes {
  GET_LEADERS = `@leaderboard/getLeaders`,
  SET_LEADERS = `@leaderboard/setLeaders`,

  ADD_LEADER = `@leaderboard/addLeader`,
}

type LeaderboardActionType = BaseActionType<ActionTypes>;

/////////////////////////////////////
// ACTIONS
/////////////////////////////////////
const getLeaders = createAction(ActionTypes.GET_LEADERS);
const setLeaders = createAction<LeaderboardUserDataType[]>(ActionTypes.SET_LEADERS);
const addLeader = createAction<AddLeaderType>(ActionTypes.ADD_LEADER);

export const Actions = {
  getLeaders,
  setLeaders,
  addLeader,
};

export type IStore = {
  items: LeaderboardUserDataType[];
};

const initialState: IStore = {items: []};

const LeaderboardReducer: Reducer<IStore, LeaderboardActionType> = createReducer(initialState, (builder) =>
  builder
    .addCase(setLeaders, (state, {payload}) => {
      return {
        ...state,
        items: payload,
      };
    })
    .addDefaultCase((state) => {
      return state;
    }),
);

///////////////////////////////////
// SAGAS
///////////////////////////////////
function* getLeadersFlow() {
  try {
    const result = yield* call(LeaderboardService.getLeaders);
    if (result) {
      yield* put(setLeaders(result));
    }
  } catch (e) {}
}

function* addLeaderFlow(action: PayloadAction<AddLeaderType>) {
  try {
    const {points, callBack} = action.payload;
    const userData = yield* select(getUserItem);

    if (userData && points) {
      const data: LeaderboardUserType = {
        user: userData,
        points,
      };

      const leadersResult = yield* call(LeaderboardService.getLeaders);
      if (leadersResult) {
        const previousUserResult = leadersResult.find((item) => item.data.user.id === userData.id);
        if (!!previousUserResult?.data?.points) {
          data.points += previousUserResult.data.points;
        }
      }

      const result = yield* call(LeaderboardService.addLeaderboardItem, data);

      if (callBack) {
        callBack(data.points);
      }
    }
  } catch (e) {
    yield* put(notificationActions.setNotification(getExceptionByError(e as Error)));
  }
}

export function* leaderboardFlow() {
  yield* takeEvery(getLeaders, getLeadersFlow);
  yield* takeEvery(addLeader, addLeaderFlow);
}

export default LeaderboardReducer;
