import React, {ButtonHTMLAttributes, FC, MouseEvent} from 'react';

import './button.scss';

interface IProps {
  className?: string;
  icon?: string;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<unknown>['type'];
}

interface IHandler {
  onClick?(e?: MouseEvent): void;
}

const Button: FC<IProps & IHandler> = (props) => {
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    props.onClick && props.onClick(e);
  };

  return (
    <button
      className={`button ${props.className ? props.className : ''}`}
      onClick={handleClick}
      disabled={props.disabled}
      type={props.type}
    >
      {props.icon && <img src={props.icon} role="img" />}
      {props.children}
    </button>
  );
};

export default Button;
