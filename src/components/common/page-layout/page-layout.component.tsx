import React, {FC, ReactNode} from 'react';
import TopBarComponent from '../top-bar/top-bar.component';

interface LayoutProps {
  children: ReactNode;
}

const PageLayoutComponent: FC<LayoutProps> = (props) => {
  return (
    <div className={'page'}>
      <TopBarComponent />
      {props.children}
    </div>
  );
};

export default PageLayoutComponent;
