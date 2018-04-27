import {Meteor} from 'meteor/meteor';
import {OM} from "./code/Framework/ObjectManager";
import {User} from "./modules/account/models/user";
import {Role} from "./modules/account/models/role";
import {Stone} from "./code/core/stone";

Meteor.startup(() => {
    Stone.getInstance().bootstrap();
    
    initSupperAdminAccount();
    SyncedCron.start();
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
