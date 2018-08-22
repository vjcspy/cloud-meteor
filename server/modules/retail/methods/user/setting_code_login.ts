import {OM} from "../../../../code/Framework/ObjectManager";
import {CodeLogin} from "../../models/code-login";
new ValidatedMethod({
    name: "setting.code_login",
    validate: function () {
    },
    run: function (setting) {
        const is_active_pin_code = parseInt(setting['active_pin_code']);
        const is_active_bar_code = parseInt(setting['active_bar_code']);
        const unlock_type = parseInt(setting['unlock_type']);
        const minute_unlock = parseInt(setting['minute_unlock']);
        const username = setting['username'];
        const login_code_model = OM.create<CodeLogin>(CodeLogin);
        const code_login =  login_code_model.load(username,'username');
        if (code_login) {  //  active_type?: number ===> 0:  deactivate all, 1: active all, 2: active pin_code, 3: active bar_code
            let active_type: Number = 0;
            if (1 === is_active_pin_code && 1 === is_active_bar_code) {
                active_type = 1;
            }
            if (1 === is_active_pin_code && 0 === is_active_bar_code) {
                active_type = 2;
            }
            if (0 === is_active_pin_code && 1 === is_active_bar_code) {
                active_type = 3;
            }
            code_login.setData('active_type', active_type)
                .setData('unlock_type', unlock_type)
                .setData('minute_unlock', minute_unlock)
                .save()
            return {
                hasError: false,
                mess: null
            };
        }else {
            return {
                hasError: true,
                mess: "User not exist pin code or bar code"
            };
        }
    }
});

