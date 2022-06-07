import {addTopic, getDBTopics} from '@postgres/models/forum-topic';
import express, {Router} from 'express';
import {HttpStatuses} from '@services/enum/call-method-type.enum';
import cookieParser from 'cookie-parser';

const topicRouter = Router();

export const topicRoutes = (router: Router) => {
  const topicAPI: Router = Router();
  topicAPI.post('/get', async (request, response) => {
    const {limit, offset} = request.body;
    response.append('Content-Type', 'application/json');
    try {
      const topics = await getDBTopics(limit, offset);
      response.status(HttpStatuses.SUCCESS);
      response.send(JSON.stringify(topics));
    } catch (error) {
      response.status(HttpStatuses.INTERNAL);
      response.send();
    }
  });

  topicAPI.post('/add', async (request, response) => {
    response.append('Content-Type', 'application/json');
    try {
      const topic = request.body;
      await addTopic(topic);
      response.status(HttpStatuses.SUCCESS);
      response.send(JSON.stringify({message: 'success'}));
    } catch (error) {
      response.status(HttpStatuses.INTERNAL);
      response.send(JSON.stringify(error));
    }
  });

  router.use(cookieParser());

  router.use(express.json());
  router.use('/api/v1/topic/*', (request, response, next) => {
    if (!request.cookies) {
      response.status(HttpStatuses.UNAUTHORIZED);
      response.send(JSON.stringify({reason: 'unauthorized'}));
    }
    console.log(request.cookies);
    next();
  });
  router.use('/api/v1/topic', topicAPI);
};

topicRoutes(topicRouter);

export default topicRouter;
