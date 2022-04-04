import * as Yup from 'yup';

const RegisterSchema = Yup.object({
  email: Yup.string().label('Email').email('Неправильный email').required('Обязательное поле'),
  login: Yup.string()
/*    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .matches(/^[^\s'&<> ]*$/g, 'Есть спецсимволы или пробел')
    .matches(/^[a-zA-Z]*$/g, 'Только латиница')*/
    .required('Обязательное поле'),
  first_name: Yup.string()
    .label('Имя')
/*    .matches(/^[A-ZА-ЯЁ]/, 'Первая буква должна быть заглавной')
    .matches(/^[^\d\s]*$/, 'Есть пробелы и/или цифры')
    .matches(/^[^"'&<>_]*$/, 'Есть недопустимые символы')*/
    .required('Обязательное поле'),
  second_name: Yup.string()
    .label('Фамилия')
/*    .matches(/^[A-ZА-ЯЁ]/, 'Первая буква должна быть заглавной')
    .matches(/^[^\d\s]*$/, 'Есть пробелы и/или цифры')
    .matches(/^[^"'&<>_]*$/, 'Есть недопустимые символы')*/
    .required('Обязательное поле'),
  phone: Yup.string()
    .label('Телефон')
    .min(10, 'Длина от 10 до 15 символов')
    .max(15, 'Длина от 10 до 15 символов')
/*    .matches(/^\+?\d+$/g, 'Неверный формат телефона')*/
    .required('Обязательное поле'),
  password: Yup.string()
/*    .min(8, 'Длина от 8 до 40 символов')
    .max(40, 'Длина от 8 до 40 символов')
    .matches(/[A-ZА-ЯЁ]+/g, 'Должна быть заглавная буква')
    .matches(/\d+/, 'Должна быть цифра')*/
    .required('Обязательное поле'),
});

export {RegisterSchema};
