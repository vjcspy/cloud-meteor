export interface OrderInterface {
    _id?: string;
    user_id: string;
    product_id: string;
    
    pricing_id: string;
    pricing_type: string;
    prev_pricing_id: string;
    
    cost_new_plan: number;
    cost_extra_user: number;
    
    credit_change_user: number;
    credit_change_plan: number;
    
    discount_amount: number;
    
    subtotal: number;
    grand_total: number;
}