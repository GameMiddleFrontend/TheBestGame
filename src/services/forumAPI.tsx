import {IForumTheme} from '../components/common/forum-theme/forum-theme.types';

const testThemes: IForumTheme[] = [
  {
    id: 1,
    name: '1',
  },
  {
    id: 2,
    name: '2',
    lastMessage: 'test2',
  },
  {
    id: 3,
    name: '3',
    lastMessage: 'test1',
    lastMessageTime: '12:12',
  },
];

class ForumAPI {
  static async getThemes(): Promise<IForumTheme[]> {
    const response = await Promise.resolve(testThemes);
    return response;
  }
}

export default ForumAPI;
