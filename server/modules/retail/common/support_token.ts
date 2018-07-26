import * as crypto from "crypto";
import {Random} from 'meteor/random'
import {CodeLogin} from "../models/code-login";
import {OM} from "../../../code/Framework/ObjectManager";
import {CodeLoginsCollection} from "../collections/code-login-collection";

export class SupportToken {
    public generateStampedLoginToken = function () {
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
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    public static autoGenerateBarCode(length_barcode: number = 10): string {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length_barcode; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    public static updateCodeLogin(user: any, user_id: string, pin_code: string, bar_code: string, code_information: any) {
        if (user.hasOwnProperty('has_license') && null !== user['has_license'] && user['has_license'].length > 0) {
            const license_id = user['has_license'][0]['license_id'];
            const licenses = CodeLoginsCollection.find({'license_id': license_id}).fetch();
            const login_code = OM.create<CodeLogin>(CodeLogin);
            const list_license_duplicate = licenses.filter(temp => ((temp['pin_code'] === pin_code || temp['bar_code'] === bar_code) && (temp['user_id'] !== user_id)));
            if (null === list_license_duplicate || list_license_duplicate.length === 0) {
                const user_code = login_code.load(user['_id'], 'user_id');
                if (null !== user_code) {
                    user_code.setData('user_id', user_id)
                        .setData('username', user['username'])
                        .setData('license_id', license_id)
                        .setData('pin_code', (pin_code !== null ? (pin_code === "" ? null : pin_code) : user_code['pin_code']))
                        .setData('bar_code', (bar_code !== null ? (bar_code === "" ? null : bar_code) : user_code['bar_code']))
                        .setData('active_type', code_information['active_type'])
                        .setData('height_qr_code', code_information['height_qr_code'])
                        .setData('width_bar_code', code_information['width_bar_code'])
                        .setData('format_bar_code', code_information['format_bar_code'])
                        .save()
                        .catch((err) => {
                            throw new Meteor.Error(err);
                        });
                } else {
                    const auto_pin_code = (pin_code === null ? this.autoGeneratePincode() : pin_code);
                    const auto_bar_code = (bar_code === null ? this.autoGenerateBarCode() : bar_code);
                    const temp = {
                        'user_id': user_id,
                        'username': user['username'],
                        'license_id': license_id,
                        'pin_code': auto_pin_code,
                        'bar_code': auto_bar_code,
                        'active_type': code_information['active_type'],
                        'height_qr_code': code_information['height_qr_code'],
                        'width_bar_code': code_information['width_bar_code'],
                        'format_bar_code': code_information['format_bar_code']
                    };
                    login_code.addData(temp).save().then(() => {
                    }).catch((err) => {
                        throw new Meteor.Error(err);
                    });
                }
            } else {
                throw new Meteor.Error('Invalid pin code or barcode. Please try again!');
            }
        }
    }
};



