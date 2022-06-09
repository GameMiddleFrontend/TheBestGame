import {FormElementsDef} from '@common/form/types';

export type CreateTheme = {
  title: string;
  content: string;
};

const CreateThemeDef: FormElementsDef<CreateTheme>[] = [
  {
    name: 'title',
    label: 'Тема',
    defaultValue: '',
  },
  {
    name: 'content',
    label: 'Сообщение',
    defaultValue: '',
  },
];

export {CreateThemeDef};
