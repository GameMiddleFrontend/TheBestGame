import * as Yup from 'yup';

const SignInSchema = Yup.object({
  login: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .matches(/^[^\s'&<> ]*$/g, 'Есть спецсимволы или пробел')
    .matches(/^[a-zA-Z]*$/g, 'Только латиница')*/
    .required('Обязательное поле'),
  password: Yup.string()
    .min(8, 'Длина от 8 до 40 символов')
    .max(40, 'Длина от 8 до 40 символов')
    .matches(/[A-ZА-ЯЁ]+/g, 'Должна быть заглавная буква')
    .matches(/\d+/, 'Должна быть цифра')*/
    .required('Обязательное поле'),
});

export {SignInSchema};
