import * as Yup from 'yup';

const SignInSchema = Yup.object({
  login: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .matches(/\w+/, 'Нет букв')
    .matches(/[a-zA-Z]*!/, 'Только латиница')
    .matches(/[^'&<>\s]/, 'Есть спецсимволы или пробел')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(8, 'Длина от 8 до 40 символов')
    .max(40, 'Длина от 8 до 40 символов')
    .matches(/[A-ZА-ЯЁ]/, 'Должна быть заглавная буква')
    .matches(/\d/, 'Должна быть цифра')
    .required('Обязательное поле'),
});

export {SignInSchema};
