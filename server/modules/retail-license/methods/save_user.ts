import {User} from "../../accounts/models/user";
import {OM} from "../../../code/Framework/ObjectManager";
import {Role} from "../../accounts/api/role";
import {License} from "../../retail/models/license";
import {UserLicense} from "../models/userlicense";
import {Users, userSchema} from "../../accounts/collections/users";
import * as _ from "lodash"

const METHOD_NAME = 'accounts.save_user';

new ValidatedMethod(
    {
        name: METHOD_NAME,
        validate: function (data) {
            if (!this.userId) {
                throw new Meteor.Error(METHOD_NAME, "Access denied");
            }
            
            userSchema.validate(data);
        },
        run: function (data) {
            return new Promise(async (resolve, reject) => {
                const currentUser: User = OM.create<User>(User).loadById(this.userId);
                
                if (currentUser.isInRoles([Role.SUPERADMIN, Role.ADMIN])) {
                
                } else if (currentUser.isInRoles([Role.USER])) {
                    if (_.size(currentUser.getLicenses()) !== 1) {
                        throw new Meteor.Error(METHOD_NAME, "current_account_has_not_license_key");
                    }
                    
                    if (!data['_id']) {
                        let user = createUser({
                                                  username: data['username'],
                                                  email: data['email'],
                                                  password: data['password'],
                                                  profile: data['profile']
                                              });
                        
                        const licenseId = currentUser.getLicenses()[0]['license_id'];
                        const license   = OM.create<License>(License).loadById(licenseId);
                        
                        license.setData('current_cashier_increment', ++license.current_cashier_increment);
                        
                        if (_.isObject(data['role']) && data['role']['group_shop']) {
                            user.setRoles(data['role']['group_shop'], Role.GROUP_SHOP);
                        }
                        
                        return UserLicense.attach(user, license, User.LICENSE_PERMISSION_CASHIER, data['products']);
                        
                    } else {
                        updateUser(data['_id'], {
                            profile: data['profile']
                        });
                    }
                    
                }
                else {
                    throw new Meteor.Error(METHOD_NAME, "Access denied");
                }
            });
        }
    }
);

function createUser(newUserData): User {
    const newUserId = Accounts.createUser(newUserData);
    Accounts.setPassword(newUserId, User.DEFAULT_PASSWORD_USER);
    Accounts.sendEnrollmentEmail(newUserId);
    
    return OM.create<User>(User).loadById(newUserId);
}

function updateUser(id, newUserData) {
    Users.update({_id: id}, {$set: newUserData});
}


DDPRateLimiter.addRule({
                           userId: function (userId) {
                               return true;
                           },
                           type: "method",
                           name: "user.create_user",
                       }, 1, 1000);
