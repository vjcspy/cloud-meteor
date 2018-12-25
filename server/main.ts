import {Meteor} from 'meteor/meteor';
import {OM} from "./code/Framework/ObjectManager";
import {User} from "./modules/account/models/user";
import {Role} from "./modules/account/models/role";
import {Stone} from "./code/core/stone";
import * as fs from "fs";

const notify = require('sd-notify');

const dir = "/var/www/clients/client1/web3/web" + "/keep_alive";
Meteor.startup(() => {
    Stone.getInstance().bootstrap();
    
    initSupperAdminAccount();
    startWatchDog();
    SyncedCron.start();
    // setInterval(() => {
    //     notifyKeepAlive();
    // }, 5000);
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
        
        Accounts.createUser(
            {
                username: "khoild1",
                email: "mr.vjcspysfsfd@gmail.com",
                password: "536723"
            });
        OM.create<User>(User).load("khoild1", "username").setRoles([Role.SUPERADMIN], Role.GROUP_CLOUD);
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
                // setInterval(() => { notify.sendStatus('watching server');}, interval);
                notify.startWatchdogMode(interval);
            }
        } catch (err) {
            console.log(err);
        }
    });
};

const notifyKeepAlive = (): void => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    const _path = dir + "/" + "data.output";
    fs.writeFile(_path, (new Date()).getTime(), {flag: 'w'}, (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
};