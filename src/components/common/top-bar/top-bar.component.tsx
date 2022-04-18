import React, {FC, useCallback} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import AppRoutes from '../../../utils/app-routes';
import Popup from 'reactjs-popup';
import Button from '../button';
import cancelArrowImg from '../../../styles/images/cancel-arrow.svg';
import menuImg from '../../../styles/images/menu.svg';
import userImage from '../../../styles/images/user.svg';
import {topBarMenu} from './top-bar.types';

import './top-bar.scss';

interface IProps {
  avatar?: string;
}
interface IHandlers {
  onCancel?(): void;
}

const TopBar: FC<IProps & IHandlers> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = useCallback((route: AppRoutes) => {
    navigate(route);
  }, []);

  return (
    <header className={'top-bar'}>
      <section className={'top-bar-section'}>
        {props.onCancel && <Button className={'button-icon-only'} icon={cancelArrowImg} onClick={props.onCancel} />}
      </section>
      <section className={'top-bar-section'}>
        {/*TODO можно отображать аватар*/}
        <Button
          className={'button-icon-only'}
          icon={props.avatar || userImage}
          onClick={handleNavigate.bind(null, AppRoutes.SETTINGS)}
          disabled={location.pathname === AppRoutes.SETTINGS}
        />
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
          <ul className="menu-container" role={'menu'}>
            {topBarMenu
              .filter((menuItem) => menuItem.route !== location.pathname)
              ?.map((menuItem, index) => (
                <li key={menuItem.sysName + index} className="menu-item">
                  <Button
                    className={'button-text menu-button-text'}
                    onClick={handleNavigate.bind(null, menuItem.route)}
                  >
                    {menuItem.item}
                  </Button>
                </li>
              ))}
          </ul>
        </Popup>
      </section>
    </header>
  );
};

export default TopBar;
