import ServiceUtils from '@services/service.utils';
import {ForumTopicDBModel} from '@models/forum-topic.model';

const baseURL = 'http://localhost:3000/api/v1/topic';

class TopicAPI {
  static async getTopics() {
    return await ServiceUtils.post('', undefined, undefined, baseURL.concat('/get'))
      .then((response) => {
        return response;
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }

  static async addTopic(data: ForumTopicDBModel) {
    return await ServiceUtils.post('', data, undefined, baseURL.concat('/add'));
  }
}

export default TopicAPI;
