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
        const  invoice_agency_data = data['invoice'];
        const  user_id = data['user_id'];
        let defer         = $q.defer();
        let agencyInvoiceModel = OM.create<AgencyInvoice>(AgencyInvoice);
        const agency_invoice_data = {"user_id" : user_id, "month": invoice_agency_data['month'] ,  "year": invoice_agency_data['year'],"status":1, "grand_total":invoice_agency_data['grand_total']  };
        agencyInvoiceModel.addData(agency_invoice_data)
            .save()
            .then(() => defer.resolve(), (err) => defer.reject(err));

        return defer.promise;
    }
});