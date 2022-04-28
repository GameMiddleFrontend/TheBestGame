import React, {FC} from 'react';
import PageLayoutComponent from './page-layout.component';
import withAuth from "../../../hooks/chechAuthHookHOC";

interface IProps {
  component: React.ElementType;
  layout?: React.ElementType;
}

const WithLayout: FC<IProps> = (props) => {
  const {component: Component, layout: Layout = PageLayoutComponent, ...rest} = props;

  return (
    <Layout>
      <Component {...rest} />
    </Layout>
  );
};

export default WithLayout;
