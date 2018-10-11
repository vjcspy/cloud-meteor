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
                            const item             = data['item'];
                            const totals           = data['totals'];
                            let cartItem: CartItem = OM.create<CartItem>(CartItem);
                            let cart: Cart         = OM.create<Cart>(Cart).loadById(data['cart_id']);
                            const cartItemData     = CartItemCollection.findOne({
                                                                                    cart_id: data['cart_id'],
                                                                                    sku: item['sku'],
                                                                                    product_id: item['product_id'],
                                                                                    time: item['time']
                                                                                });
                            const superAttribute = item['super_attribute'] ?JSON.stringify(item['super_attribute']) : null;
                            const bundleOption  = item['bundle_option'] ? JSON.stringify(item['bundle_option']) : null;
                            const bundleOptionQty  = item['bundle_option_qty'] ? JSON.stringify(item['bundle_option_qty']) : null;

                            
                            if (cartItemData) {
                                cartItem.loadById(cartItemData['_id']);
                                cartItem.setData('qty', item['qty'])
                                        .setData('base_row_total', item['base_row_total'])
                                        .setData('base_row_total_incl_tax', item['base_row_total_incl_tax'])
                                        .setData('row_total', item['row_total'])
                                        .setData('row_total_incl_tax', item['row_total_incl_tax'])
                                        .setData('is_refund_item', item['is_refund_item'])
                                        .setData('pos_is_sales', item['pos_is_sales'])
                                        .setData('type_id', item['type_id'])
                                        .setData('product_id', item['product_id'])
                                        .setData('item_id', item['item_id'])
                                        .setData('is_qty_decimal', item['is_qty_decimal'])
                                        .setData('super_attribute', superAttribute)
                                        .setData('bundle_option',  bundleOption)
                                        .setData('bundle_option_qty', bundleOptionQty)
                                        .save();
                            } else {
                                cartItem.addData(item)
                                    .setData('super_attribute', superAttribute)
                                    .setData('bundle_option',  bundleOption)
                                    .setData('bundle_option_qty', bundleOptionQty).
                                    save();
                            }
    
                            cart.setData('discount', totals['discount'])
                                .setData('retail_discount_per_item', totals['retail_discount_per_item'])
                                .setData('gift_card_discount_amount', totals['gift_card_discount_amount'])
                                .setData('grand_total', totals['grand_total'])
                                .setData('base_grand_total', totals['base_grand_total'])
                                .setData('points_earn', totals['points_earn'])
                                .setData('reward_point_discount_amount', totals['reward_point_discount_amount'])
                                .setData('base_reward_point_discount_amount', totals['base_reward_point_discount_amount'])
                                .setData('shipping', totals['shipping'])
                                .setData('subtotal', totals['subtotal'])
                                .setData('subtotal_incl_tax', totals['subtotal_incl_tax'])
                                .setData('shipping_incl_tax', totals['shipping_incl_tax'])
                                .setData('tax', totals['tax'])
                                .setData('base_shipping', totals['base_shipping'])
                                .setData('base_subtotal', totals['base_subtotal'])
                                .setData('base_subtotal_incl_tax', totals['base_subtotal_incl_tax'])
                                .setData('base_shipping_incl_tax', totals['base_shipping_incl_tax'])
                                .setData('base_tax', totals['base_tax'])
                                .setData('remain', totals['remain'])
                                .setData('cash_rounding', totals['cash_rounding'])
                                .setData('refunded_total', totals['refunded_total'])
                                .setData('subtotal_refund', totals['subtotal_refund'])
                                .setData('refund_discount', totals['refund_discount'])
                                .setData('refund_tax', totals['refund_tax'])
                                .setData('refund_shipping', totals['refund_shipping'])
                                .setData('adjustment', totals['adjustment'])
                                .setData('is_integrate_reward_points', totals['is_integrate_reward_points'])
                                .setData('total_exchange_amount', totals['total_exchange_amount'])
                                .setData('is_complete_order', data['is_complete_order'])
                                .save();
                        }
                    });
