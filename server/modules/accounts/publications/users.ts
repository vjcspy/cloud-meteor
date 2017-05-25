import {UserInterface} from "../api/user-interface";
import {Users} from "../collections/users";

Meteor.publish('users', function (): Mongo.Cursor<UserInterface> {
  if (!this.userId) {
    return;
  }
  
  return Users.collection.find({}, {
    fields: {
      profile: 1
    }
  });
});
