import {ChatInterface} from "../api/chat-interface";
import {Chats} from "../collections/chats";
import {MessageInterface} from "../api/message-interface";
import {Messages} from "../collections/messages";
import {UserInterface} from "../../accounts/api/user-interface";
import {Users} from "../../accounts/collections/users";

Meteor.publishComposite('chats', function (): PublishCompositeConfig<ChatInterface> {
  if (!this.userId) {
    return;
  }
  
  return {
    find: () => {
      return Chats.collection.find({memberIds: this.userId});
    }
  };
});
