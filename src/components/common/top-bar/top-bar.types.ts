import AppRoutes from '../../../utils/app-routes';

type MenuItemType = {
  sysName: string;
  route: AppRoutes;
  item: string;
};

export const topBarMenu: MenuItemType[] = [
  {
    sysName: 'leaderboard',
    route: AppRoutes.LEADERBOARD,
    item: 'Таблица лидеров',
  },
  {
    sysName: 'forum',
    route: AppRoutes.FORUM,
    item: 'Форум',
  },
  {
    sysName: 'game',
    route: AppRoutes.GAME,
    item: 'Новая игра',
  },
];
