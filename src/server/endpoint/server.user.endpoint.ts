import express, {Router} from 'express';
import {HttpStatuses} from '@services/enum/call-method-type.enum';
import cookieParser from 'cookie-parser';
import {changeUserTheme, createOrUpdateUserIfNotExists, getUsers} from '@postgres/models/user';

const userRouter = Router();

const baseUserURL = '/api/v1/user';

export const userRoutes = (router: Router) => {
  const userApi: Router = Router();

  userApi.post('/add', async (request, response) => {
    response.append('Content-Type', 'application/json');
    try {
      const user = request.body;
      const result = await createOrUpdateUserIfNotExists(user);
      response.status(HttpStatuses.SUCCESS);
      response.send(JSON.stringify(result));
    } catch (error) {
      response.status(HttpStatuses.INTERNAL);
      response.send(JSON.stringify(error));
    }
  });

  userApi.post('/getAll', async (request, response) => {
    response.append('Content-Type', 'application/json');
    try {
      const result = await getUsers();
      response.status(HttpStatuses.SUCCESS);
      response.send(JSON.stringify(result));
    } catch (error) {
      response.status(HttpStatuses.INTERNAL);
      response.send(JSON.stringify(error));
    }
  });

  userApi.post('/changeTheme', async (request, response) => {
    response.append('Content-Type', 'application/json');
    try {
      const {userId} = request.body;
      await changeUserTheme(userId);
      response.status(HttpStatuses.SUCCESS);
      response.send(JSON.stringify({message: 'success'}));
    } catch (error) {
      response.status(HttpStatuses.INTERNAL);
      response.send(JSON.stringify(error));
    }
  });

  router.use(cookieParser());

  router.use(express.json());
  router.use(baseUserURL.concat('/*'), (request, response, next) => {
    if (!request.cookies) {
      response.status(HttpStatuses.UNAUTHORIZED);
      response.send(JSON.stringify({reason: 'unauthorized'}));
    }
    next();
  });
  router.use(baseUserURL, userApi);
};

userRoutes(userRouter);

export default userRouter;
