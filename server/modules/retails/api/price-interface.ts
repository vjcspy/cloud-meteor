export interface PriceInterface {
  _id?: string;
  code?: string;
  name?: string;
  display_name?: string;
  type?: number;
  nousers?: number;
  cost_monthly?: string;
  cost_annually?: string;
  cost_adding?: string;
  visibility?: number;
  description?: string;
}