import sequelize from './sequelize';
import {addUser} from './models/user';
import {addTopic} from './models/forum-topic';
import {CurrentUserItem} from '@models/user.model';
import {addComment} from './models/forum-comment';
import {addBranch} from './models/comments-tree';

export default async function dbConnect() {
  console.log('-----------DB CONNECT-----------');
  try {
    await sequelize.authenticate();
    await sequelize.sync({force: true});
    databaseTests();
    console.log('SQL Connection has been established successfully.');
  } catch (error) {
    console.error('SQL Unable to connect to the database:', error);
  }
}

const TestUserData: CurrentUserItem = {
  id: 1,
  login: '1',
  email: '1',
  first_name: '1',
  second_name: '1',
  display_name: '1',
  phone: '1',
  avatar: '',
};

const testTopicData: any = {
  id: 1,
  title: 'Test topic',
  content: 'Test content topic',
  author: '1',
};

const testCommentData: any = {
  id: 1,
  content: 'Test comment',
  author: 1,
};

const testRelationsData: any = {
  comment: 1,
  parentTopic: 1,
};

function databaseTests() {
  addUser(TestUserData)
    .then(() => {
      console.log('user created');
      testTopic();
    })
    .catch(() => {
      console.log('user failure');
    });
}

function testTopic() {
  addTopic(testTopicData)
    .then(() => {
      testComment();
      console.log('topic created');
    })
    .catch(() => {
      console.log('topic failure');
    });
}

function testComment() {
  addComment(testCommentData)
    .then(() => {
      console.log('comment created');
      testRelations();
    })
    .catch(() => {
      console.log('comment failure');
    });
}

function testRelations() {
  addBranch(testRelationsData)
    .then(() => {
      console.log('comment tree created');
    })
    .catch(() => {
      console.log('comment tree failure');
    });
}
