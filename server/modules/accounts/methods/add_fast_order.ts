import {ClientFastOrder} from "../models/clientfastorder";
import {OM} from "../../../code/Framework/ObjectManager";

new ValidatedMethod({
  name    : "client.add_fast_order",
  validate: function (data) {
  },
  run     : function (data) {
    let clientFastOrder: ClientFastOrder = OM.create<ClientFastOrder>(ClientFastOrder);
    clientFastOrder.addData(data);
    return clientFastOrder.save();
  }
});
