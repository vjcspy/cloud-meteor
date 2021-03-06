import {OM} from "../../../../code/Framework/ObjectManager";
import {CodeLogin} from "../../models/code-login";
import {SupportToken} from "../../common/support_token";
import {CodeLoginsCollection} from "../../collections/code-login-collection";
import {Licenses} from "../../collections/licenses";
new ValidatedMethod({
    name: "generate.token",
    validate: function () {
    },
    run: function (data) {
        const pin_code = data['pin_code'];
        const bar_code = data['bar_code'];
        const license_id = data['license_id'];

        const login_code_model = OM.create<CodeLogin>(CodeLogin);
        const data_license = Licenses.find({'key' : license_id}).fetch();
        const temps = CodeLoginsCollection.find({'license_id' : data_license[0]['_id']}).fetch();
        const user = temps.find(login => (login['pin_code'] === pin_code || login['bar_code'] === bar_code));

        if (user) {
            const code_login =  login_code_model.load(user['user_id'],'user_id');
            if(code_login) {
                if(code_login['_data']['pin_code'] === pin_code || code_login['_data']['bar_code'] === bar_code) {
                    let supportToken = new SupportToken();
                    const stampedToken = supportToken.generateStampedLoginToken();
                    var hashStampedToken = supportToken.hashStampedToken(stampedToken);
                    Meteor.users.update(code_login['_data']['user_id'], {$push: {'services.resume.loginTokens': hashStampedToken}});
                    // console.log(stampedToken.token);
                    return { token: stampedToken.token, username:code_login['_data']['username'] , msg: null};
                }else {
                    if (code_login['_data']['pin_code'] !== pin_code) {
                        throw new Meteor.Error('Login Code', 'Pin code not correct');
                    }else {
                        throw new Meteor.Error('Login Code', 'Bar code not correct');
                    }
                }
            }else {
                throw new Meteor.Error('Login Code', 'Code login not support license');
            }
        }else {
            if(data['active_type']=='pin_code')
                throw new Meteor.Error('Login Code', "Pin code not correct");
            else
                throw new Meteor.Error('Login Code', "Bar code not correct");
        }
    }
});

