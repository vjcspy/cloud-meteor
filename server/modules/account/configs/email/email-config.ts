import {Accounts} from 'meteor/accounts-base';
import {Meteor} from 'meteor/meteor';
import {OM} from "../../../../code/Framework/ObjectManager";
import {User} from "../../models/user";
import {Role} from "../../models/role";
import {Plan} from "../../../sales/models/plan";
import {PlanHelper} from "../../../sales/helper/plan-helper";
import {RequestPlan} from "../../../sales/api/data/request-plan";
import {Users} from "../../collections/users";

var greetVar;
var welcomeMsgVar;
var beforeMsgVar;
var regardVar;
var followMsgVar;
var noteMsgVar;
var step1;
var step2;
var step3;
var step4;
var step5;
var username;
var password;

Accounts.urls.resetPassword = function (token) {
    return Meteor.absoluteUrl('#/account/reset/' + token);
};

Accounts.urls.verifyEmail = function (token) {
    return Meteor.absoluteUrl('#/account/verify_email/' + token);
};

Accounts.urls.enrollAccount = function (token) {
    return Meteor.absoluteUrl('#/account/reset/' + token);
};


function prepareTextEmail(user, status) {
    if (status == "resetpwd") {
        greetVar      = `Dear ${getUserName(user)},`;
        welcomeMsgVar = "You have recently requested to reset your password.<br> To continue this process, please follow this link:";
        beforeMsgVar  = "(If clicking the link does not work, try copying and pasting it<br>into your browser)";
        noteMsgVar    = "If you did not request this, please disregard<br>this message. This link will automatically expire within 24<br>hours."
        regardVar     = "<span style='font-weight: bold'>Many thanks</span>,<br>ConnectPOS Team.";
        followMsgVar  = "ConnectPOS Team.";
    } else if (status == "verify") {
        greetVar      = `Dear ${getUserName(user)},`;
        welcomeMsgVar = "Congratulations! You've successfully registered for our free<br>trial. Please follow the next steps to finish setting up your free<br>trial:";
        step1         = "<span style='font-weight: bold'>1.</span> Log into " + "<span style='font-weight: bold'>http://accounts.connectpos.com/</span>";
        step2         = "<span style='font-weight: bold'>2.</span> From the side menu, go to <span style='font-weight: bold'>ConnectPOS Products</span> and click<br><span style='font-weight: bold'>Trial.</span>";
        step3         = "<span style='font-weight: bold'>3.</span> Complete the payment process of <span style='font-weight: bold'>USD 0</span> as instructed.";
        step4         = "<span style='font-weight: bold'>4.</span> From the side menu, go to <span style='font-weight: bold'>Account > License > View Details ><br>Download API</span> version, then select the latest version and down-<br>load.";
        step5         = "<span style='font-weight: bold'>5.</span> Install the <span style='font-weight: bold'>API</span><span style='color: black'> and activate it with the license key in your<br>Magento backend. For the installation instruction, please<br>download</span> <a href='http://accounts.connectpos.com/assets/ConnectPOS%20-%20Installation%20Guide.pdf' style='font-weight: bold'>Installation Guide in Documentation.</a>";
        noteMsgVar    = "If you have any questions, kindly contact us via<br><span style='font-weight: bold'>support@connectpos.com</span>";
        regardVar     = "<span style='font-weight: bold'>Many thanks</span>,<br>ConnectPOS Team.";
        followMsgVar  = "ConnectPOS Team.";
    } else if (status == "enroll") {
        greetVar      = `Dear ${getUserName(user)},`;
        welcomeMsgVar = `Welcome on board! Your ConnectPOS account has been successfully created. <br> Please log in to your account on http://accounts.connectpos.com using the information below:<br>Username: <span style="font-weight: bold">${user['username']}</span>`;
        password      = "Please click the following link to set the password for your account:";
        beforeMsgVar  = "After that you can log in to your account on<br>http://accounts.connectpos.com using your username and password.";
        noteMsgVar    = "If you have any questions, kindly contact us via<br>support@connectpos.com";
        regardVar     = "<span style='font-weight: bold'>Cheers</span>,<br>ConnectPOS Team.";

    }
}

function buildHtmlResetPW(status) {
    return function (user, url) {
        prepareTextEmail(user, status);
        var subject;
        if (status == "resetpwd") {
            subject = "Reset Password";
        }
        
        return `
               <table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
               <tbody>
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                    <table style="border-collapse: collapse; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 0 10px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/email_template.jpg"></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 30px 10px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="auto" cellspacing="0" cellpadding="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td style="padding: 15px 0 0 0; font-family: Arial, sans-serif;font-size: 20px;color: black">${greetVar}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 15px 0 10px 0; font-family: Arial, sans-serif;font-weight: bold; color: black">${welcomeMsgVar}<br/><a href="${url}">Please follow this link</a></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>${beforeMsgVar}</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>${noteMsgVar}</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>${regardVar}</p></td>
                                          </tr>
                                      </tbody>
                                  </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 0px 0px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/_footer2.png"></td>
                            </tr>
                    </tbody>
                </table>
              </td></tr></tbody></table>
               `;
    };
}

function buildHtmlEnroll(status) {
    return function (user, url) {
        prepareTextEmail(user, status);
        var subject;
        if (status == "enroll") {
            subject = "enroll";
        }

        return `
               <table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
               <tbody>
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                    <table style="border-collapse: collapse; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 0 10px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/email_template.jpg"></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 30px 10px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="auto" cellspacing="0" cellpadding="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td style="padding: 15px 0 0 0; font-family: Arial, sans-serif;font-size: 20px;color: black">${greetVar}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 15px 0 10px 0; font-family: Arial, sans-serif; color: black">${welcomeMsgVar}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><a href="${url}">${password}</a></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>${beforeMsgVar}</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>${noteMsgVar}</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>${regardVar}</p></td>
                                          </tr>
                                      </tbody>
                                  </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 0px 0px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/_footer2.png"></td>
                            </tr>
                    </tbody>
                </table>
              </td></tr></tbody></table>
               `;
    };
}

function buildHtmlVerify(status) {

    return function (user) {
        prepareTextEmail(user, status);
        var subject;
        if (status == "verify") {
            subject = "Verify Email";
        }

        return `
               <table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
               <tbody>
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                    <table style="border-collapse: collapse; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 0 10px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/email_template.jpg"></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 30px 10px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="auto" cellspacing="0" cellpadding="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td style="padding: 15px 0 0 0; font-family: Arial, sans-serif; font-size: 20px; color: black">${greetVar}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 15px 0 10px 0; font-family: Arial, sans-serif; font-weight: bold; color: black">${welcomeMsgVar}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 15px 0 10px 0; font-family: Arial, sans-serif; color: black">${step1}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 15px 0 10px 0; font-family: Arial, sans-serif; color: black">${step2}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 15px 0 10px 0; font-family: Arial, sans-serif; color: black">${step3}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 15px 0 10px 0; font-family: Arial, sans-serif; color: black">${step4}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 15px 0 10px 0; font-family: Arial, sans-serif; color: black">${step5}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 15px 0 10px 0; font-family: Arial, sans-serif; color: black">${noteMsgVar}</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>${regardVar}</p></td>
                                          </tr>
                                      </tbody>
                                  </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 0px 0px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/_footer2.png"></td>
                            </tr>
                    </tbody>
                </table>
              </td></tr></tbody></table>
               `;
    };
}

function getUserName(user) {
    return (user.profile && !!user.profile.first_name && !!user.profile.last_name) ? (user.profile.first_name + " " + user.profile.last_name) : ( user['username'] ? user['username'] : "");
}

function getCreateby(user){
    const userModel = OM.create<User>(User);
    userModel.loadById(user['profile']['created_by']);
    if(userModel.isInRoles([Role.SALES], Role.GROUP_CLOUD)){
        return userModel.getUsername();
    } else if(userModel.isInRoles([Role.SUPERADMIN], Role.GROUP_CLOUD)) {
        return "Admin";
    }
}

function buildEmailText(status) {
    return function (user, url) {
        prepareTextEmail(user, status);
        return `    ${greetVar}
                    ${welcomeMsgVar}
                    ${url}
                    ${beforeMsgVar}
                    ${regardVar}
               `;
    }
}



Accounts.emailTemplates = {
    from: "no-reply@omnizio.com",
    siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),
    resetPassword: {
        subject: function (user) {
            return "[ConnectPOS] Reset your password";
        },
        html: buildHtmlResetPW("resetpwd"),
        text: buildEmailText("resetpwd"),
    },
    verifyEmail: {
        subject: function (user) {
            return "[ConnectPOS] Welcome on board! Please follow the next steps";
        },
        html: buildHtmlVerify("verify"),
        text: buildEmailText("verify")
    },
    enrollAccount: {
        subject: function (user) {
            return `[ConnectPOS] Your account has been created!`;
        },
        html: buildHtmlEnroll("enroll"),
        text: buildEmailText("enroll")
    }
};


export const ExtendEmailTemplate = {
    request_trial: (data)=>{
      return  {
            to: `${data['email']}`,
            from: '',
            subject: "Thank you for registering for ConnectPOS trial!",
            html: `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
               <tbody>
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                    <table style="border-collapse: collapse; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 0 10px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/email_template.jpg"></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 30px 10px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="auto" cellspacing="0" cellpadding="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td style="padding: 15px 0 0 0; font-family: Arial, sans-serif;font-size: 20px;color: black">Dear ${getFullName(data['name'])},</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif;"><p style="color: black">This is an automated email to let you know that we have<br>received your trial request. One of our Account Managers<br>will contact you to help you finish trial setup within 12 hours.<br>In order to start the setup, please provide us the following<br>information:</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight:bold">1. Your website URLs</span> including live site and staging site/dev<br><span style="color:black">site. We will assign a license key to these URLs.</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight:bold">2. The email and username</span> you want to use for your<br>ConnectPOS account.</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>In the meantime, if you want to have a look at<br>ConnectPOS and test some functions, please use our demo<br>account:</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight:bold">POS:</span> http://sales.connectpos.com/</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight:bold">Magento backend:</span> http://magento2demo.connectpos.com/admin</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>You can download our User Guide here <a href="http://accounts.connectpos.com/assets/ConnectPOS%20-%20User%20Guide%20v1.0.1.pdf">link download User Guide</a><br>for a full list of functions.</p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight: bold">Best regards,</span><br>ConnectPOS Team</p></td>
                                          </tr>
                                      </tbody>
                                  </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 0px 0px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/_footer2.png"></td>
                            </tr>
                    </tbody>
                </table>
              </td></tr></tbody></table>`,
        }
    },
    trial_expired: (data)=>{
        return {
            to: `${data['email']}`,
            from: '',
            subject:'[Action required] Your free trial ends in 2 days!',
            html: `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
               <tbody>
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                    <table style="border-collapse: collapse; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 0 10px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/email_template.jpg"></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 30px 10px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="auto" cellspacing="0" cellpadding="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td style="padding: 15px 0 0 0; font-family: Arial, sans-serif;font-size: 20px;color: black">Dear ${getFullName(data['shop_owner_username'])},</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 15px 0 10px 0; font-family: Arial, sans-serif;font-weight: bold; color: black">Your ConnectPOS free trial end in less than 2 days</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif;"><p style="color: black">To keep your stores running without interruption, log<br> into your account and choose a suitable plan now.</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 20px 0 20px 0; font-family: Arial, sans-serif;"><div align="center"><a style="background-color: #11b4a8; color: white; text-align: center; padding: 10px 20px; text-decoration: none; border-radius: 5px" href="http://accounts.connectpos.com/">LOG IN AND PICK A PLAN</a></div></td>
                                          </tr>

                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>If you still wonder if ConnectPOS is the right one for you,<br>we'll be happy to help with any questions. Chat with us,<br>send an email to support@smartosc.com or submit a ticket<br>via our Help Center. We'll get back to you asap.</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight: bold">Many thanks,</span><br>ConnectPOS Team</p></td>
                                          </tr>
                                      </tbody>
                                  </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 0px 0px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/_footer2.png"></td>
                            </tr>
                    </tbody>
                </table>
              </td></tr></tbody></table>`,

        }
    },
    expired: (data)=>{
        const plan = OM.create<Plan>(Plan).loadById(data['plan_id']);
        const coupon_id = plan.getData('coupon_id');
        const planHelper        = OM.create<PlanHelper>(PlanHelper);
        const requestPlan: RequestPlan = {
            pricing_id: plan.getPricingId(),
            cycle: plan.getPricingCycle(),
            num_of_cycle: 1,
            addition_entity: plan.getAdditionEntity()
        };
        const {totals} = planHelper.collectTotal(requestPlan, plan.getProductId(), plan.getUserId(), coupon_id);
        return {
            to: `${data['email']}`,
            from: '',
            subject: 'Your ConnectPOS license will be renewed in the next 2 days!',
            html: `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
               <tbody>
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                    <table style="border-collapse: collapse; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 0 10px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/email_template.jpg"></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 30px 10px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="auto" cellspacing="0" cellpadding="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td style="padding: 15px 0 0 0; font-family: Arial, sans-serif;font-size: 20px;color: black">Dear ${getFullName(data['shop_owner_username'])},</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif;"><p style="color: black">We hope you have enjoyed your experience with us.<br>Your ConnectPOS license will be AUTOMATICALLY renewed on ${formatDate(data['expiry_date'])} for<br><b>$${totals['total']['grand_total'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</b>.</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>If you want to upgrade your plan to enjoy more awesome features, <br>or should you have any questions, kindly contact us via support@connectpos.com.
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight: bold">Many thanks,</span><br>ConnectPOS Team</p></td>
                                          </tr>
                                      </tbody>
                                  </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 0px 0px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/_footer2.png"></td>
                            </tr>
                    </tbody>
                </table>
              </td></tr></tbody></table>`,
        }
    },
    invoice: (data)=>{
        return {
            to: `${data['email']}`,
            from: '',
            subject: 'Your receipt from ConnectPOS',
            html: `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
               <tbody>
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                    <table style="border-collapse: collapse; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 0 10px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/email_template.jpg"></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 30px 10px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="auto" cellspacing="0" cellpadding="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td style="padding: 15px 0 0 0; font-family: Arial, sans-serif;font-size: 20px;color: black">Dear ${getFullName(data['user_name'])},</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 15px 0 10px 0; font-family: Arial, sans-serif;font-weight: bold; color: black">Thank you for your purchase.<br>This email is to confirm payment for your ConnectPOS license listed as below:</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Product Name: <span style="font-weight: bold"> ${data['product_name']}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Order Number: <span style="font-weight: bold">${data['order_number']}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Transaction Date: <span style="font-weight: bold">${formatDate(data['transaction_date'])}</span></p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Order Status: <span style="font-weight: bold">${data['order_status']}</span></p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- License is valid through: <span style="font-weight: bold">${formatDate(data['expire_date'])}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Pricing Plan: <span style="font-weight: bold">${data['pricing_plan']}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Price: <span style="font-weight: bold">$${data['price'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Pricing cycle: <span style="font-weight: bold">${data['pricing_cycle']}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Number of cycle: <span style="font-weight: bold">${data['number_cycle']}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Number of register: <span style="font-weight: bold">${data['number_register']}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Sub total: <span style="font-weight: bold">$${data['totals']['grand_total'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Discount: <span style="font-weight: bold">$${data['totals']['discount_amount'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Store credit used: <span style="font-weight: bold">$${data['totals']['credit_spent'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Grand Total: <span style="font-weight: bold">$${data['totals']['total'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Payment method: <span style="font-weight: bold">${data['card_type']} ...${data['card_number']}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>Please note that this is an automated email.If you<br>have any questions, kindly contact us via<br>support@connectpos.com</p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight: bold">Best regards,</span><br>ConnectPOS Team</p></td>
                                          </tr>
                                      </tbody>
                                  </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 0px 0px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/_footer2.png"></td>
                            </tr>
                    </tbody>
                </table>
              </td></tr></tbody></table>`,
        }
    },
    invoiceFee: (data)=>{
        return {
            to: `${data['email']}`,
            from: '',
            subject: 'Your receipt from ConnectPOS',
            html: `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
               <tbody>
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                    <table style="border-collapse: collapse; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 0 10px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/email_template.jpg"></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 30px 10px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="auto" cellspacing="0" cellpadding="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td style="padding: 15px 0 0 0; font-family: Arial, sans-serif;font-size: 20px;color: black">Dear ${getFullName(data['user_name'])},</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 15px 0 10px 0; font-family: Arial, sans-serif;font-weight: bold; color: black">You've completed your payment for ${data['fee_name']}.<br>Here are your purchase details:</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Order Number: <span style="font-weight: bold">${data['order_number']}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Transaction Date: <span style="font-weight: bold">${formatDate(data['transaction_date'])}</span></p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Order Status: <span style="font-weight: bold">${data['order_status']}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Cost: <span style="font-weight: bold">$${data['cost'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Store credit used: <span style="font-weight: bold">$${data['totals']['credit_spent'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Grand Total: <span style="font-weight: bold">$${data['totals']['total'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Payment method: <span style="font-weight: bold">${data['card_type']} ...${data['card_number']}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>Please note that this is an automated email.If you<br>have any questions, kindly contact us via<br>support@connectpos.com</p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight: bold">Best regards,</span><br>ConnectPOS Team</p></td>
                                          </tr>
                                      </tbody>
                                  </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 0px 0px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/_footer2.png"></td>
                            </tr>
                    </tbody>
                </table>
              </td></tr></tbody></table>`,
        }
    },
    renew: (data)=>{
        return {
            to: `${data['email']}`,
            from: '',
            subject: 'Your ConnectPOS license has been successfully renewed!',
            html: `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
               <tbody>
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                    <table style="border-collapse: collapse; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 0 10px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/email_template.jpg"></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 30px 10px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="auto" cellspacing="0" cellpadding="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td style="padding: 15px 0 0 0; font-family: Arial, sans-serif;font-size: 20px;color: black">Dear ${getFullName(data['user_name'])},</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 15px 0 10px 0; font-family: Arial, sans-serif;font-weight: bold; color: black">Thank you for your continued investment in ConnectPOS.<br>Your ConnectPOS license has been successfully renewed with the payment details as below:</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Pricing Plan: <span style="font-weight: bold">${data['pricing_plan']}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Price: <span style="font-weight: bold">$${data['price'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Successfully renewed on: <span style="font-weight: bold">${formatDate(data['old_expire_date'])}</span></p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- License is valid through: <span style="font-weight: bold">${formatDate(data['expire_date'])}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Pricing cycle: <span style="font-weight: bold">${data['pricing_cycle']}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Number of cycle: <span style="font-weight: bold">${data['number_cycle']}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Number of register: <span style="font-weight: bold">${data['number_register']}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Sub total: <span style="font-weight: bold">$${data['totals']['grand_total'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Discount: <span style="font-weight: bold">$${data['totals']['discount_amount'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Store credit used: <span style="font-weight: bold">$${data['totals']['credit_spent'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Grand Total: <span style="font-weight: bold">$${data['totals']['total'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Payment method: <span style="font-weight: bold">${data['card_type']} ...${data['card_number']}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>As always, thank you for your dedication to ConnectPOS.<br>We look forward to helping you achieve your goals!</p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight: bold">Many thanks,</span><br>ConnectPOS Team</p></td>
                                          </tr>
                                      </tbody>
                                  </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 0px 0px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/_footer2.png"></td>
                            </tr>
                    </tbody>
                </table>
              </td></tr></tbody></table>`,
        }
    },
    pendingUser: (data)=>{
        return {
            to: `${data['email']}`,
            from: '',
            subject: '[ConnectPOS] Warning: Review Duplicated Contact',
            html: `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
               <tbody>
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                    <table style="border-collapse: collapse; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 0 10px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/email_template.jpg"></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 30px 10px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="auto" cellspacing="0" cellpadding="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td style="padding: 15px 0 0 0; font-family: Arial, sans-serif;font-size: 20px;color: black">Dear ${getFullName(data['username'])},</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif;"><p style="color: black">The email address ${data['duplicate_data']['email']} you've registered already exists in our database.<br> Our adminstrator will review and notify you of the final result via email within 24 hours.</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif;"><p style="color: black">If you have any questions, please contact us:</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight:bold">Email: <span style='font-weight: bold'>support@connectpos.com</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight: bold">Best regards,</span><br>ConnectPOS Team</p></td>
                                          </tr>
                                      </tbody>
                                  </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 0px 0px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/_footer2.png"></td>
                            </tr>
                    </tbody>
                </table>
              </td></tr></tbody></table>`,
        }
    },
    rejectUser: (data)=>{
        return {
            to: `${data['email']}`,
            from: '',
            subject: '[ConnectPOS] Your New Account Has Been Rejected',
            html: `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
               <tbody>
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                    <table style="border-collapse: collapse; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2); margin: 0 auto" border="0" width="600"  cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 0 10px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/email_template.jpg"></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 30px 10px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="auto" cellspacing="0" cellpadding="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td style="padding: 15px 0 0 0; font-family: Arial, sans-serif;font-size: 20px;color: black">Hi ${getFullName(data['username'])},</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif;"><p style="color: black">We regret to tell you that the account you've just created with the email adress ${data['pending_user']['email']} <br> has been rejected due to the following reason:
</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif;"><p style="color: black">${data['reject_reason']}</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif;"><p style="color: black">If you have any questions, please contact us:</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight:bold">Email: <span style='font-weight: bold'>support@connectpos.com</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight: bold">Best regards,</span><br>ConnectPOS Team</p></td>
                                          </tr>
                                      </tbody>
                                  </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 0px 0px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/_footer2.png"></td>
                            </tr>
                    </tbody>
                </table>
              </td></tr></tbody></table>`,
        }
    },
    listExp: (data)=>{

        return {
            to: `${data['email']}`,
            from: '',
            subject: '[ALERT] Users with licenses expired tomorrow!',
            html: `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
               <tbody>
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                    <table style="border-collapse: collapse; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2); margin: 0 auto" border="0" width="600"  cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 0 10px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/email_template.jpg"></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 30px 10px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="auto" cellspacing="0" cellpadding="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td style="padding: 15px 0 0 0; font-family: Arial, sans-serif;font-size: 20px;color: black">Hi ConnectPOS Admin,</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif;"><p style="color: black">This is the list of users whose licenses will be expired tomorrow. Please remind Sales Team to send payment requests to the customers and renew their licenses:
</p></td>
                                          </tr>
                                          
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif;"><p style="color: black">${data['listUser']}</p></td>
                                          </tr>
                                        
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight: bold">Best regards,</span><br>ConnectPOS Team</p></td>
                                          </tr>
                                      </tbody>
                                  </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 0px 0px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/_footer2.png"></td>
                            </tr>
                    </tbody>
                </table>
              </td></tr></tbody></table>`,
        }
    },
    submitAdditionalFee: (data)=>{

        return {
            to: `${data['email']}`,
            from: '',
            subject: `[ConnectPOS] - ${data['name']}`,
            html: `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
               <tbody>
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                    <table style="border-collapse: collapse; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2); margin: 0 auto" border="0" width="600"  cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 0 10px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/email_template.jpg"></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 30px 10px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="auto" cellspacing="0" cellpadding="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td style="padding: 15px 0 0 0; font-family: Arial, sans-serif;font-size: 20px;color: black">Dear ${getFullNameFromId(data['user_id'])},</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif;"><p style="color: black">Your request on  <span style="font-weight: bold">${data['name']}</span> has been received. Kindly process the below payment to complete the request.
</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Cost: <span style="font-weight: bold">$${data['price'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Discount: <span style="font-weight: bold">$${data['discount'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Grand Total: <span style="font-weight: bold">$${data['cost'].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p></td>
                                          </tr>
        
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>If you have any questions, kindly contact us via support@connectpos.com.</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight: bold">Many thanks,</span><br>ConnectPOS Team</p></td>
                                          </tr>
                                      </tbody>
                                  </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 0px 0px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/_footer2.png"></td>
                            </tr>
                    </tbody>
                </table>
              </td></tr></tbody></table>`,
        }
    },
    paymentError: (data)=>{

        return {
            to: `${data['email']}`,
            from: '',
            subject: '[ConnectPOS] Your payment for is declined',
            html: `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
               <tbody>
                <tr>
                    <td style="padding: 20px 0 30px 0;">
                    <table style="border-collapse: collapse; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2); margin: 0 auto" border="0" width="600"  cellspacing="0" cellpadding="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 10px 0 10px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/email_template.jpg"></td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 30px 10px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="auto" cellspacing="0" cellpadding="0" align="center">
                                      <tbody>
                                          <tr>
                                              <td style="padding: 15px 0 0 0; font-family: Arial, sans-serif;font-size: 20px;color: black">Dear ${getFullNameFromId(data['user_id'])},</td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif;"><p style="color: black">This email is to notify that your payment is declined. To keep your license alive, please follow the instructions below to update your payment details.

</p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Step 1: Login www.accounts.connectpos.com</p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Step 2: Under Account menu, select Payment Method</span></p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Step 3: Create new/update payment information and click on Save button to update the changes.</span></p></td>
                                          </tr>
                                           <tr>
                                              <td style="padding: 0 0 0 10%; font-family: Arial, sans-serif; color: black"><p>- Step 4: Mark as default for the new payment method.</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>Finally, please inform us once you have complete the update.</p></td>
                                          </tr>
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p>If you have any questions, kindly contact us via support@connectpos.com.
</p></td>
                                          </tr>
                                      
                                          <tr>
                                              <td style="padding: 0 0 0 0; font-family: Arial, sans-serif; color: black"><p><span style="font-weight: bold">Many thanks,</span><br>ConnectPOS Team</p></td>
                                          </tr>
                                      </tbody>
                                  </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0px 0px 0px 25px;" align="center" bgcolor="#ffffff"><img src="http://accounts.connectpos.com/assets/img/account/_footer2.png"></td>
                            </tr>
                    </tbody>
                </table>
              </td></tr></tbody></table>`,
        }
    },

};
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function getFullName(username) {
    const user = Users.collection.findOne({username: username});
    return getUserName(user);
}

function getFullNameFromId(userId) {
    const user = Users.collection.findOne({_id: userId});
    return getUserName(user);
}
