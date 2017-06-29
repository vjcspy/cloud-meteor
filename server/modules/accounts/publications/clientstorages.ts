import {User} from "../models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../api/role";
import {License} from "../../retails/models/license";
import {ClientStorages} from "../collections/clientstorages";
import * as _ from "lodash";
import * as moment from "moment";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";

Meteor.publish('client_storages', function () {
  const allClientStorages = ClientStorages.find().fetch();
  if (allClientStorages.length > 0) {
    _.forEach(allClientStorages, (clientStorage) => {
      let createTime = moment(clientStorage['created_at'], 'YYYY-MM-DD');
      let currentTime = moment(DateTimeHelper.getCurrentDate(), 'YYYY-MM-DD');
      let diff = createTime.diff(currentTime, 'days');
      if (diff > 5){
        ClientStorages.remove(clientStorage);
      }
    });
  }
  if (!this.userId)
    return;
  const user: User = OM.create<User>(User).loadById(this.userId);
  if (user.isInRoles(Role.USER)) {
    const licenses = user.getLicenses();
    if (_.size(licenses) == 1) {
      const license: License = OM.create<License>(License).loadById(licenses[0].license_id);
      if (license)
        return ClientStorages.collection.find({ license: license.getData('key') });
      else
        return;
    }
    else {
      return;
    }
  } else { return; }

});