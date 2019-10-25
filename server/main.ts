import {Meteor} from 'meteor/meteor';
import {OM} from "./code/Framework/ObjectManager";
import {User} from "./modules/account/models/user";
import {Role} from "./modules/account/models/role";
import {Stone} from "./code/core/stone";

const dir = "/var/www/clients/client1/web3/web" + "/keep_alive";
Meteor.startup(() => {
    process.env.MAIL_URL='smtp://AKIA2LNBLDX6MQ6J5G6E:' + encodeURIComponent("BBFMUYhpjmSepzb5FsV/apKH1p7jwxp+2OjL2jzCpV7c") + '@email-smtp.us-east-1.amazonaws.com:587';
    Stone.getInstance().bootstrap();
    
    initSupperAdminAccount();
    SyncedCron.start();
});


const initSupperAdminAccount = () => {
    let su  = OM.create<User>(User).load("superadmin", "username");
    let su1 = OM.create<User>(User).load("khoild1", "username");
    
    if (!su) {
        Accounts.createUser(
            {
                username: "superadmin",
                email: "mr.vjcspy@gmail.com",
                password: "admin123"
            });
        OM.create<User>(User).load("superadmin", "username").setRoles([Role.SUPERADMIN], Role.GROUP_CLOUD);
    }
    
    if (!su1) {
        Accounts.createUser(
            {
                username: "khoild1",
                email: "mr.vjcspysfsfd@gmail.com",
                password: "admin123"
            });
        OM.create<User>(User).load("khoild1", "username").setRoles([Role.SUPERADMIN], Role.GROUP_CLOUD);
    }
};
