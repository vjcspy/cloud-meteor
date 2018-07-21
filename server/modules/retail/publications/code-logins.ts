import {CodeLoginInterface} from "../api/code-login-interface";
import {CodeLoginsCollection} from "../collections/code-login-collection";
Meteor.publishComposite("code_login", function (): PublishCompositeConfig<CodeLoginInterface> {
    if (!this.userId) {
        return;
    }
    return {
        find() {
            return CodeLoginsCollection.collection.find({user_id: Meteor.userId()});
        }
    };
});
