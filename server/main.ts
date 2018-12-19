import {Meteor} from 'meteor/meteor';
import {OM} from "./code/Framework/ObjectManager";
import {User} from "./modules/account/models/user";
import {Role} from "./modules/account/models/role";
import {Stone} from "./code/core/stone";

const notify = require('sd-notify');

Meteor.startup(() => {
    Stone.getInstance().bootstrap();
    
    initSupperAdminAccount();
    startWatchDog();
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

const startWatchDog = () => {
    setTimeout(() => {
        try {
            console.log("Notifying Systemd of service startup");
            notify.ready();
            
            const watchdogInterval = notify.watchdogInterval();
            if (watchdogInterval > 0) {
                console.log("Systemd watchdog interval is " + watchdogInterval + "ms");
                const interval = Math.floor(watchdogInterval / 2);
                console.log("Starting Systemd watchdog mode");
                notify.startWatchdogMode(interval);
                notify.sendStatus('watching server');
            }
        } catch (err) {
            console.log(err);
        }
    });
};