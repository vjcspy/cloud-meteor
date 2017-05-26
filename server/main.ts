import {Meteor} from 'meteor/meteor';
import {Users} from "./modules/accounts/collections/users";
import {OM} from "./code/Framework/ObjectManager";
import {User} from "./modules/accounts/models/user";
import {Role} from "./modules/accounts/api/role";

Meteor.startup(() => {
  initSupperAdminAccount();
  /*if (Meteor.settings) {
    Object.assign(Accounts._options, Meteor.settings['accounts-phone']);
    SMS.twilio = Meteor.settings['twilio'];
  }*/
  
  //dummyUser();
});

let initSupperAdminAccount = () => {
  let su = OM.create<User>(User).load("superadmin", "username");

  if (!su) {
    Accounts.createUser(
      {
        username: "superadmin",
        email: "mr.vjcspy@gmail.com",
        password: "admin123"
      });
    OM.create<User>(User).load("superadmin", "username").setRoles([Role.SUPERADMIN], Role.GROUP_CLOUD);
  }
};

const dummyUser = () => {
  if (Users.collection.find().count() == 0) {
    Accounts.createUserWithPhone({
                                   phone: '+972540000001',
                                   profile: {
                                     name: 'Ethan Gonzalez',
                                     picture: 'https://randomuser.me/api/portraits/men/1.jpg'
                                   }
                                 });
    
    Accounts.createUserWithPhone({
                                   phone: '+972540000002',
                                   profile: {
                                     name: 'Bryan Wallace',
                                     picture: 'https://randomuser.me/api/portraits/lego/1.jpg'
                                   }
                                 });
    
    Accounts.createUserWithPhone({
                                   phone: '+972540000003',
                                   profile: {
                                     name: 'Avery Stewart',
                                     picture: 'https://randomuser.me/api/portraits/women/1.jpg'
                                   }
                                 });
    
    Accounts.createUserWithPhone({
                                   phone: '+972540000004',
                                   profile: {
                                     name: 'Katie Peterson',
                                     picture: 'https://randomuser.me/api/portraits/women/2.jpg'
                                   }
                                 });
    
    Accounts.createUserWithPhone({
                                   phone: '+972540000005',
                                   profile: {
                                     name: 'Ray Edwards',
                                     picture: 'https://randomuser.me/api/portraits/men/2.jpg'
                                   }
                                 });
  }
};
