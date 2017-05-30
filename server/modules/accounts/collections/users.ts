import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {UserInterface} from "../api/user-interface";
import {OM} from "../../../code/Framework/ObjectManager";
import {User} from "../models/user";
import {Role} from "../api/role";

export const Users = CollectionMaker.makeFromExisting<UserInterface>(Meteor.users);

// hook to add default role and send verify email
CollectionMaker.hookAfterInsert('users', (userId, user) => {
  let userModel = OM.create<User>(User, false, user);
  userModel.addToRoles([Role.USER], Role.GROUP_CLOUD);
  //Accounts.sendVerificationEmail(user['_id'])
});
