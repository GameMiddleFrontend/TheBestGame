import React, {FC, useCallback} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import AppRoutes from '../../../utils/app-routes';
import Popup from 'reactjs-popup';
import Button from '../button';
import spadesImg from '../../../styles/images/spades.svg';
import menuImg from '../../../styles/images/menu.svg';
import userImage from '../../../styles/images/user.svg';
import {topBarMenu} from './top-bar.types';
import {connect} from 'react-redux';
import IConfiguredStore from '../../../redux/reducers/configured-store';
import {initialState as authInitialState} from '../../../redux/reducers/auth/auth.ducks';

import './top-bar.scss';

interface IProps {
  isLoggedIn: boolean;
  avatar?: string;
}

const mapStateToProps = (state: IConfiguredStore): IProps => {
  //TODO add Reselect
  const {isLoggedIn} = state && state.auth ? state.auth : authInitialState;
  return {
    isLoggedIn,
  };
};

const TopBar: FC<IProps> = (props) => {
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
          icon={spadesImg}
          onClick={handleNavigate.bind(null, AppRoutes.HOME, undefined)}
        />
      </section>
      <section className={'top-bar-section'}>
        {/*TODO можно отображать аватар*/}
        {props.isLoggedIn && (
          <Button
            className={'button-icon-only'}
            icon={props.avatar || userImage}
            onClick={handleNavigate.bind(null, AppRoutes.SETTINGS, undefined)}
            disabled={location.pathname === AppRoutes.SETTINGS}
          />
        )}
        <Popup
          trigger={
            <div>
              <Button className={'button-icon-only'} icon={menuImg} />
            </div>
          }
          position="bottom right"
          on="click"
          closeOnDocumentClick
          repositionOnResize
          className="menu"
          arrow={false}
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

export default connect(mapStateToProps)(TopBar);
