export type User = {
  userID: string;
  username: string;
  self: boolean;
  connected: boolean;
  messages: Message[];
  hasNewMessages: boolean;
};

export type Message = {
  content: string;
  fromSelf: boolean;
};
