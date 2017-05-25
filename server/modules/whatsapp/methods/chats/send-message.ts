import {OM} from "../../../../code/Framework/ObjectManager";
import {Chat} from "../../models/chat";
import {Message} from "../../models/message";

new ValidatedMethod({
                      name: "chats.user_send_message",
                      validate: function (data: any) {
                        if (!this.userId) throw new Meteor.Error('unauthorized',
                                                                 'User must be logged-in to create a new chat');
                      },
                      run: function (data: Object) {
                        const chatExisted = OM.create<Chat>(Chat).loadById(data['chat_id']);
    
                        if (!chatExisted) {
                          throw new Meteor.Error('chat-not-exists',
                                                 'Chat doesn\'t exist');
                        }
                        let messageModel = OM.create<Message>(Message);
                        return messageModel.addData({
                                                      chatId: data['chat_id'],
                                                      content: data['content'],
                                                      type: data['type'],
                                                      senderId: this.userId,
                                                      createdAt: Date.now()
                                                    })
                                           .save()
                      }
                    });
DDPRateLimiter.addRule({
                         userId: function (userId) {
                           return true;
                         },
                         type: "method",
                         name: "user.chats.user_send_message",
                       }, 1, 1000);
