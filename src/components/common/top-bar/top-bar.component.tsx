import React, {FC, useCallback} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import AppRoutes from '@utils/app-routes';
import Popup from 'reactjs-popup';
import Button from '../button';
import '@images/spades.svg';
import '@images/menu.svg';
import {topBarMenu} from './top-bar.types';
import {useSelector} from 'react-redux';
import IConfiguredStore from '@store/reducers/configured-store';
import {IStore as IAuthStore} from '@store/reducers/auth/auth.ducks';
import AvatarComponent from '../avatar';
import {UserState} from '@store/reducers/user/user.ducks';

import './top-bar.scss';

const TopBar: FC = (props) => {
  const {isLoggedIn} = useSelector<IConfiguredStore, IAuthStore>((state) => state.auth);
  const {item} = useSelector<IConfiguredStore, UserState>((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = useCallback((route: AppRoutes, closePopup?: () => void) => {
    navigate(route);
    closePopup && closePopup();
  }, []);

  return (
    <header className={'top-bar'}>
      <section className={'top-bar-section'}>
        <Button
          className={'button-icon-only'}
          icon={'Images/spades.svg'}
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
              <Button className={'button-icon-only'} icon={'Images/menu.svg'} />
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
              </ul>
            );
          }}
        </Popup>
      </section>
    </header>
  );
};

export default TopBar;
