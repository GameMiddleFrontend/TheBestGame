import React, {FC, PropsWithChildren} from 'react';

import './button.scss';

interface IProps {
  className?: string;
  icon?: string;
}

const ButtonComponent: FC<IProps> = (props: PropsWithChildren<IProps>) => {
  return <button className={`button ${props.className ? props.className : ''}`}>{props.children}</button>;
};

export default ButtonComponent;
