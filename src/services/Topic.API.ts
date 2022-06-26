import ServiceUtils from '@services/service.utils';
import {ForumTopicDBModel} from '@models/forum-topic.model';
import {ForumCommentDBModel, ForumCommentResponseModel} from '@models/forum-comment.model';
import isServer from '@utils/isServer';

const baseURL = isServer ? '' : window.location.origin.concat('/api/v1/topic');

class TopicAPI {
  static async getTopics(url?: string) {
    const tmpUrl = url || baseURL;
    return await ServiceUtils.post('', undefined, undefined, tmpUrl.concat('/get'))
      .then((response) => {
        return response;
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }

  static async addTopic(data: ForumTopicDBModel, url?: string) {
    const tmpUrl = url || baseURL;
    return await ServiceUtils.post('', data, undefined, tmpUrl.concat('/add'));
  }

  static async addTopicComment(topicId: number, data: ForumCommentDBModel, url?: string) {
    const tmpUrl = url || baseURL;
    return await ServiceUtils.put('', data, undefined, baseURL.concat(`/${topicId}/comments`));
  }

  static async getTopicComments(topicId: number, url?: string): Promise<ForumCommentResponseModel> {
    const tmpUrl = url || baseURL;
    return await ServiceUtils.post('', {}, undefined, baseURL.concat(`/${topicId}/comments`));
  }
}

export default TopicAPI;
