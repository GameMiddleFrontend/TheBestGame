import React, {FC} from 'react';
import TopBarComponent from '../top-bar/top-bar.component';

const PageLayoutComponent: FC = (props) => {
  return (
    <div className={'page'}>
      <TopBarComponent />
      {props.children}
    </div>
  );
};

export default PageLayoutComponent;
