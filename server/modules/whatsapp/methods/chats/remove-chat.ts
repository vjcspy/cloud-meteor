import {Chats} from "../../collections/chats";
import {ZValidator} from "../../../../code/Framework/ZValidator";
import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
                      name: "chats.user_remove_chat",
                      validate: function (data: any) {
                        ZValidator.validate(new SimpleSchema({
                                                               chatId: String
                                                             }), data);
    
                        if (!this.userId) {
                          throw new Meteor.Error('unauthorized',
                                                 'User must be logged-in to remove chat');
                        }
                      },
                      run: function (data: Object) {
    
                        const chatExists = !!Chats.collection.find(data['chatId']).count();
    
                        if (!chatExists) {
                          throw new Meteor.Error('chat-not-exists',
                                                 'Chat doesn\'t exist');
                        }
    
                        return Chats.remove(data['chatId']);
                      }
                    });
DDPRateLimiter.addRule({
                         userId: function (userId) {
                           return true;
                         },
                         type: "method",
                         name: "user.chats.user_remove_chat",
                       }, 1, 1000);
