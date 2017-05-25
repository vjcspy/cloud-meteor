import {MessageInterface} from "../api/message-interface";
import {Messages} from "../collections/messages";

Meteor.publish('messages', function (): Mongo.Cursor<MessageInterface> {
  if (!this.userId) {
    return;
  }
  
  return Messages.collection.find({}, {
    sort: {createdAt: -1}
  });
});
