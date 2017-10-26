import {UserInterface} from "../api/user-interface";
import {Users} from "../collections/users";

Meteor.publishComposite('usersreport', function (): PublishCompositeConfig<UserInterface> {

    return {
      find: () => {
        return Users.collection.find({});
      }
    };

});
