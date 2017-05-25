import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {UserInterface} from "../api/user-interface";

export const Users = CollectionMaker.makeFromExisting<UserInterface>(Meteor.users);

// hook to add default role and send verify email
CollectionMaker.hookAfterInsert('users', (userId, user) => {
  console.log('Hook after insert user with id: ' + userId)
});
