import {SecondScreenInterface} from "../api/second-screen-interface";
import {SecondScreenCollection} from "../collections/second-screen";
import {User} from "../../account/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {LicenseCollection} from "../collections/licenses";

Meteor.publishComposite("second_screen", function (): PublishCompositeConfig<SecondScreenInterface> {
    if (!this.userId) {
        return;
    }
    let userModel: User = OM.create<User>(User).loadById(this.userId);
    if(userModel.getLicenses()) {
        const license = LicenseCollection.findOne({_id: userModel.getLicenses()['license_id']});
        if (license) {
            return {
                find: function () {
                    return SecondScreenCollection.collection.find({license_key: license['key']});
                }
            };
        }
    }
});
