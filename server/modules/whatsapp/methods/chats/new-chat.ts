import {Chats} from "../../collections/chats";
import {ZValidator} from "../../../../code/Framework/ZValidator";
import SimpleSchema from 'simpl-schema';

new ValidatedMethod({
                      name: "chats.user_add_chat",
                      validate: function (data: any) {
                        ZValidator.validate(new SimpleSchema({
                                                               receiverId: String
                                                             }), data);
    
                        if (!this.userId) {
                          throw new Meteor.Error('unauthorized',
                                                 'User must be logged-in to create a new chat');
                        }
                        if (data['receiverId'] === this.userId) {
                          throw new Meteor.Error('illegal-receiver',
                                                 'Receiver must be different than the current logged in user');
                        }
                      },
                      run: function (data: Object) {
                        const chatExists = !!Chats.collection.find({
                                                                     memberIds: {$all: [this.userId, data['receiverId']]}
                                                                   }).count();
    
                        if (chatExists) {
                          throw new Meteor.Error('chat-exists',
                                                 'Chat already exists');
                        }
                        const chat = {
                          memberIds: [this.userId, data['receiverId']]
                        };
    
                        return Chats.insert(chat);
                      }
                    });
DDPRateLimiter.addRule({
                         userId: function (userId) {
                           return true;
                         },
                         type: "method",
                         name: "user.chats.user_add_chat",
                       }, 1, 1000);
