import {Meteor} from 'meteor/meteor';
import {OM} from "./code/Framework/ObjectManager";
import {User} from "./modules/accounts/models/user";
import {Role} from "./modules/accounts/api/role";

Meteor.startup(() => {
    initSupperAdminAccount();
    SyncedCron.start();
    /*if (Meteor.settings) {
     Object.assign(Accounts._options, Meteor.settings['accounts-phone']);
     SMS.twilio = Meteor.settings['twilio'];
     }*/
});

const initSupperAdminAccount = () => {
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
