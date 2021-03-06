export type UserItem = {
  id: number;
  login: string;
  display_name?: string;
  avatar?: string;
  email?: string;
};

export type CurrentUserItem = {
  id: number;
  login: string;
  email: string;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  avatar: string;
  customTheme?: boolean;
};

export type CurrentUserPasswordItem = {
  oldPassword: string;
  newPassword: string;
  newPasswordCopy: string;
};

export type UserPasswordApiItem = Omit<CurrentUserPasswordItem, 'newPasswordCopy'>;

type Password = {
  password: string;
};

export type UserLoginItem = Pick<CurrentUserItem, 'login'> & Password;

export type UserRegisterItem = Pick<CurrentUserItem, 'email' | 'login' | 'first_name' | 'second_name' | 'phone'> &
  Password;

export type UpdateUserInfoType<T> = {
  data: T;
  callback: () => void;
};
