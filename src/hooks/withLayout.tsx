import React, {useCallback} from 'react';
import WithLayout from '../components/common/page-layout';

const useLayout = () => {
  return useCallback((component: React.ElementType) => {
    return <WithLayout component={component} />;
  }, []);
};

export default useLayout;
