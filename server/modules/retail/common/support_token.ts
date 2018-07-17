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

   public static autoGeneratePincode(): string {
      return  String(Math.floor(100000 + Math.random() * 900000));
   }

   public static autoGenerateBarCode(length_barcode : number = 10): string {
       var text = "";
       var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
       for (var i = 0; i < length_barcode ; i++){
           text += possible.charAt(Math.floor(Math.random() * possible.length));
       }
       return text;
   }

   public static updateCodeLogin(user: any, user_id: string, defer: any, pin_code: string, bar_code: string) {
       if(user.hasOwnProperty('has_license') && null !== user['has_license'] && user['has_license'].length > 0) {
           const license_id =  user['has_license'][0]['license_id'];
           const login_code = OM.create<CodeLogin>(CodeLogin);
           const user_code =  login_code.load(license_id,'license_id');
            if(user_code) {
                user_code.setData('user_id',user_id)
                    .setData('username',user['username'])
                    .setData('license_id',license_id)
                    .setData('pin_code',(pin_code !== null ? (pin_code.length >= 4 ? pin_code : user_code['pin_code']) : user_code['pin_code']))
                    .setData('bar_code',(bar_code !== null ? (bar_code !== "" ? bar_code : user_code['bar_code']) : user_code['bar_code']))
                    .save()
                    .then(() => {
                        return defer.resolve();
                    }).catch((err) => defer.reject(err));
            }else {
                const auto_pin_code = (pin_code === null ? this.autoGeneratePincode() : pin_code);
                const auto_bar_code = (bar_code === null ? this.autoGenerateBarCode() : bar_code);
               // console.log("pin_code: ",auto_pin_code, "bar_code: ", auto_bar_code);
                const  temp = {'user_id': user_id,'username': user['username'],'license_id': license_id,'pin_code': auto_pin_code , 'bar_code': auto_bar_code };
                login_code.addData(temp).save().then(() => {
                    Email.send({
                        to: user['emails'][0]['address'],
                        from: "",
                        subject:"Auto Generate default pin code and bar code",
                        html:   `<span style="color: black;">Pin code default: ${auto_pin_code}<br>
                                    Bar code default: ${auto_bar_code}<br>
                                 </span>`

                    })
                    return defer.resolve();
                }).catch((err) => defer.reject(err));
            }
       }
   }
};



