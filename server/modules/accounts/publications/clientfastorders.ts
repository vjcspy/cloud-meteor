import {ClientFastOrders} from "../collections/clientfastorders";

Meteor.publish("client_fast_orders", function () {
  if (!this.userId)
    return;
  return ClientFastOrders.collection.find({user_id: this.userId});
});
