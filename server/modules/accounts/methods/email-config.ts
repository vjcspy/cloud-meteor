import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

var greetVar;
var welcomeMsgVar;
var btnTextVar;
var beforeMsgVar;
var regardVar;
var followMsgVar;

Accounts.urls.resetPassword = function (token) {
  return Meteor.absoluteUrl('#/reset_password/' + token);
};

Accounts.urls.verifyEmail = function (token) {
  return Meteor.absoluteUrl('#/verify_email/' + token);
};

Accounts.urls.enrollAccount = function (token) {
  return Meteor.absoluteUrl('#/reset_password/' + token);
};


function textEmail(status) {
  if(status == "resetpwd"){
    greetVar = "Hello ";
    welcomeMsgVar = "You've just requested to reset your password for your ConnectPOS account. Please click the button below to reset it";
    btnTextVar = "Password Reset for ConnectPOS";
    beforeMsgVar = "To protect the security of your account, this link will expire in 48 hours.<br>If you did not request this, please let us" +
                   " know immediately by replying to this email.";
    regardVar = "Thank you so much!<br>ConnectPOS Team.";
    followMsgVar = "ConnectPOS Team.";
  }else if(status == "verify"){
    greetVar = "Hello ";
    welcomeMsgVar = "Welcome to ConnectPOS!<br>Your account has just been created.<br>Please click the link below to varify your account.";
    btnTextVar = "Verify your account";
    beforeMsgVar = "To protect the security of your account, this link will expire in 48 hours.<br>If you did not request this, please let us" +
                   " know immediately by replying to this email.";
    regardVar = "Thank you so much!<br>ConnectPOS Team.";
    followMsgVar = "ConnectPOS Team.";
  }else if(status == "enroll"){
    greetVar = "Hello ";
    welcomeMsgVar = "We have just created an account for you, if it was you click the button above.";
    btnTextVar = "Enroll";
    beforeMsgVar = "To protect the security of your account, this link will expire in 48 hours.<br>If you did not request this, please let us" +
                   " know immediately by replying to this email.";
    regardVar = "Thanks, SmartOSC.<br>ConnectPOS Team.";
    followMsgVar = "Follow us on social networks";
  }
}

function greet(status) {
  return function (user, url) {

    textEmail(status);
    var subject;
    if(status == "resetpwd"){
      subject = "Reset Password";
    }else if(status == "verify"){
      subject = "Verify Email";
    }else if(status == "enroll"){
      subject = "Enroll Account";
    }
    var greeting = (user.profile && user.profile.first_name) ? (greetVar + user.profile.first_name + ",") : greetVar;

    return `
               <table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
               <tbody>
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                    <table style="border-collapse: collapse; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);" border="0" width="60%" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 0 10px 0;" align="center" bgcolor="#11b4a8"><h3 style="color:#fff;">${subject}</h3></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 30px 10px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="100%" cellspacing="0" cellpadding="0">
                                      <tbody>
                                          <tr>
                                              <td style="padding: 15px 0 0 0; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold;">${greeting}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 15px 0 10px 0; font-family: Arial, sans-serif;">${welcomeMsgVar}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 20px 0 20px 0; font-family: Arial, sans-serif;"><div align="center"><a style="background-color: #11b4a8; color: white; text-align: center; padding: 15px 30px; text-decoration: none;" href="${url}">${btnTextVar}</a></div></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif;"><p>${beforeMsgVar} <br /> ${regardVar}</p></td>
                                          </tr>
                                      </tbody>
                                  </table>
                                </td>
                            </tr>
                    </tbody>
                </table>
              </td></tr></tbody></table>
               `;
  };
}

function greetText() {
  return function (user, url) {

    textEmail(user);
    var greeting = (user.profile && user.profile.first_name) ? (greetVar + user.profile.first_name + ",") : greetVar;

    return `    ${greeting}
                    ${welcomeMsgVar}
                    ${url}
                    ${beforeMsgVar}
                    ${regardVar}
               `;
  }
}

Accounts.emailTemplates = {
  from: "Superadmin <bot@smartosc.com>",
  siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),
  resetPassword: {
    subject: function (user) {
        return "Reset your password on " + Accounts.emailTemplates.siteName;
    },
    html: greet("resetpwd"),
    text: greetText(),
  },
  verifyEmail: {
    subject: function (user) {
      return "How to verify email address on " + Accounts.emailTemplates.siteName;
    },
    html: greet("verify"),
    text: greetText()
  },
  enrollAccount: {
    subject: function (user) {
      return "An account has been created for you on " + Accounts.emailTemplates.siteName;
    },
    html: greet("enroll"),
    text: greetText()
  }
};

