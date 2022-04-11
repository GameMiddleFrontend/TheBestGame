import {MouseEventHandler} from 'react';

interface IForumTheme {
  id: number;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface IForumThemeEvents {
  onCLick: (event: MouseEventHandler<HTMLDivElement> | undefined) => void;
}

type ForumProps = IForumTheme & IForumThemeEvents;

export {IForumTheme, ForumProps};
