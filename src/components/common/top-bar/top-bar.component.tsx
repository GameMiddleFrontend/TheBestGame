import React, {FC, useCallback} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import AppRoutes from '@utils/app-routes';
import Popup from 'reactjs-popup';
import Button from '../button';
import '@images/spades.svg';
import '@images/menu.svg';
import '@images/userImg.svg';
import {topBarMenu} from './top-bar.types';
import {useDispatch, useSelector} from 'react-redux';
import IConfiguredStore from '@store/reducers/configured-store';
import {IStore as IAuthStore} from '@store/reducers/auth/auth.ducks';
import AvatarComponent from '../avatar';
import {UserState, Actions as UserActions} from '@store/reducers/user/user.ducks';
import Toggle from 'react-toggle';

import './top-bar.scss';
import 'react-toggle/style.css';

const TopBar: FC = (props) => {
  const {isLoggedIn} = useSelector<IConfiguredStore, IAuthStore>((state) => state.auth);
  const {item} = useSelector<IConfiguredStore, UserState>((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigate = useCallback((route?: AppRoutes, closePopup?: () => void) => {
    if (route) {
      navigate(route);
      closePopup && closePopup();
    }
  }, []);

  const changeTheme = useCallback(() => {
    dispatch(UserActions.changeTheme());
  }, []);

  return (
    <header className={'top-bar'}>
      <section className={'top-bar-section'}>
        <Button
          className={'button-icon-only'}
          icon={'/images/spades.svg'}
          onClick={handleNavigate.bind(null, AppRoutes.HOME, undefined)}
        />
      </section>
      <section className={'top-bar-section'}>
        {isLoggedIn && (
          <Button
            className={'button-text'}
            onClick={handleNavigate.bind(null, AppRoutes.SETTINGS, undefined)}
            disabled={location.pathname === AppRoutes.SETTINGS}
          >
            <AvatarComponent className={'avatar-sm'} imgSrc={item?.avatar} />
          </Button>
        )}
        <Popup
          trigger={
            <div>
              <Button className={'button-icon-only'} icon={'/images/menu.svg'} />
            </div>
          }
          position="bottom right"
          on="click"
          closeOnDocumentClick
          repositionOnResize
          className="menu"
          arrow={false}
          a
        >
          {(close: () => void) => {
            return (
              <ul className="menu-container" role={'menu'}>
                {topBarMenu
                  .filter((menuItem) => menuItem.route !== location.pathname)
                  ?.map((menuItem, index) => (
                    <li key={menuItem.sysName + index} className="menu-item">
                      <Button
                        className={'button-text menu-button-text'}
                        onClick={handleNavigate.bind(null, menuItem.route, close)}
                      >
                        {menuItem.item}
                      </Button>
                    </li>
                  ))}
                <li key={'theme-toggle'} className="menu-item">
                  {isLoggedIn && (
                    <label className={'theme-toggle'}>
                      <span>Темная тема</span>
                      <Toggle
                        defaultChecked={!item?.customTheme}
                        onChange={changeTheme}
                        icons={false}
                        className="custom-toggle"
                      />
                    </label>
                  )}
                </li>
              </ul>
            );
          }}
        </Popup>
      </section>
    </header>
  );
};

export default TopBar;
