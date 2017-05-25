export interface MessageInterface {
  _id: string;
  chatId: string;
  content: string;
  type: string;
  senderId: string;
  created_at: number
}
