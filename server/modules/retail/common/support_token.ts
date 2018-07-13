import * as crypto from "crypto";
import { Random } from 'meteor/random'
import {CodeLogin} from "../models/code-login";
import {OM} from "../../../code/Framework/ObjectManager";
export class SupportToken {
   public  generateStampedLoginToken = function () {
       return {token: Random.secret(), when: new Date()};
    };


   public hashStampedToken = function (stampedToken) {
        return _.extend(_.omit(stampedToken, 'token'), {
            hashedToken: this.hashLoginToken(stampedToken.token)
        });
    };

   public hashLoginToken = function (loginToken) {
       var hash = crypto.createHash('sha256');
       hash.update(loginToken);
       return hash.digest('base64');
   };

   public static updateCodeLogin(user: any, user_id: string, defer: any, pin_code: string, bar_code: string) {
       if(user.hasOwnProperty('has_license') && null !== user['has_license'] && user['has_license'].length > 0) {
           const license_id =  user['has_license'][0]['license_id'];
           const login_code = OM.create<CodeLogin>(CodeLogin);
           const user_code =  login_code.load(license_id,'license_id');
           let supportToken = new SupportToken();
           const stampedToken = supportToken.generateStampedLoginToken();
            if(user_code) {
                user_code.setData('user_id',user_id)
                    .setData('username',user['username'])
                    .setData('license_id',license_id)
                    .setData('token',stampedToken.token)
                    .setData('pin_code',pin_code)
                    .setData('bar_code',bar_code)
                    .save()
                    .then(() => {
                        return defer.resolve();
                    }).catch((err) => defer.reject(err));
            }else {
                const  temp = {'user_id':user_id,'username' : user['username'],'license_id':license_id, 'token' :stampedToken.token,'pin_code' :pin_code , 'bar_code' : bar_code };
                login_code.addData(temp).save().then(() => {
                    return defer.resolve();
                }).catch((err) => defer.reject(err));
            }

       }
   }

};



