import {User} from "../../../account/models/user";
import {OM} from "../../../../code/Framework/ObjectManager";
import * as $q from "q";
import {Role} from "../../../account/models/role";
import {AgencyInvoice} from "../../models/agency-invoice";

new ValidatedMethod({
    name: "invoice.save_agency_invoice",
    validate: function () {
        const user = OM.create<User>(User).loadById(this.userId);
        if (user.isInRoles([Role.SUPERADMIN, Role.ADMIN, Role.SALES], Role.GROUP_CLOUD)) {
        } else {
            throw new Meteor.Error("agencyInvoice.create_agency_invoice_error", "Access denied");
        }
    },
    run: function (data: Object) {
        const  user_id = data['user_id'];
        const  invoice_id = data['invoice_id'];
        const  commission = data['commission'];
        let defer         = $q.defer();
        let agencyInvoiceModel = OM.create<AgencyInvoice>(AgencyInvoice);
        const agency_invoice_data = {"user_id" : user_id, "invoice_id": invoice_id ,  "commission": commission};
        agencyInvoiceModel.addData(agency_invoice_data)
            .save()
            .then(() => defer.resolve(), (err) => defer.reject(err));

        return defer.promise;
    }
});