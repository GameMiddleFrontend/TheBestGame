import React, {PropsWithChildren} from 'react';
import {themes, ThemeContext} from './theme.context';
import {UserState} from '@store/reducers/user/user.ducks';
import {useSelector} from 'react-redux';
import IConfiguredStore from '@store/reducers/configured-store';

const ThemeProvider = (props: PropsWithChildren<any>) => {
  const {item} = useSelector<IConfiguredStore, UserState>((state) => state.user);

  return (
    <ThemeContext.Provider value={item?.customTheme === false ? themes.dark : themes.light}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
