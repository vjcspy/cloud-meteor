import {OM} from "../../../../code/Framework/ObjectManager";
import {Cart} from "../../models/cart";
import {CartItem} from "../../models/cart-item";
import {CartItemCollection} from "../../collections/cart-item";
import {CartCollection} from "../../collections/cart";

new ValidatedMethod({
    name: "update.item",
    validate: function () {
    },
    run: function (data: Object) {
      console.log(data);
      const item = data['item'];
      const totals = data['totals'];
      let cartItem: CartItem = OM.create<CartItem>(CartItem);
      let cart: Cart = OM.create<Cart>(Cart).loadById(data['cart_id']);
      const cartItemData = CartItemCollection.findOne({cart_id: data['cart_id'], sku:item['sku'], product_id: item['product_id'], created_at: item['created_at']});
      if (cartItemData) {
          cartItem.loadById(cartItemData['_id']);
          cartItem.setData('qty', item['qty'])
                  .setData('base_row_total', item['base_row_total'])
                  .setData('base_row_total_incl_tax', item['base_row_total_incl_tax'])
                  .setData('row_total', item['row_total'])
                  .setData('row_total_incl_tax', item['row_total_incl_tax'])
                  .setData('is_refund_item', item['is_refund_item'])
                  .setData('type', item['type'])
                  .setData('product_id', item['product_id'])
                  .setData('super_attribute', item['super_attribute'])
                  .setData('bundle_option', item['bundle_option'])
                  .setData('bundle_option_qty', item['bundle_option_qty'])
                  .save();
      } else {
          cartItem.addData(item).save();
      }

      cart.setData('discount', totals['discount'])
          .setData('gift_cart_discount_amount', totals['gift_cart_discount_amount'])
          .setData('grand_total', totals['grand_total'])
          .setData('points_earn', totals['points_earn'])
          .setData('reward_point_discount_amount', totals['reward_point_discount_amount'])
          .setData('shipping', totals['shipping'])
          .setData('subtotal', totals['subtotal'])
          .setData('subtotal_incl_tax', totals['subtotal_incl_tax'])
          .setData('shipping_incl_tax', totals['shipping_incl_tax'])
          .setData('tax', totals['tax'])
          .save();
    }
});
