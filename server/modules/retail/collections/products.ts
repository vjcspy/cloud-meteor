import SimpleSchema from 'simpl-schema';
import {CollectionMaker} from "../../../code/MeteorBase/CollectionMaker";
import {ProductInterface} from "../api/product-interface";
import {DateTimeHelper} from "../../../code/Framework/DateTimeHelper";

export const Products = CollectionMaker.make<ProductInterface>(
	"products",
	new SimpleSchema(
		{
			_id:             {
				type:     String,
				optional: true
			},
			code:            String,
			name:            String,
			additional_data: {
				type:     Object,
				optional: true
			},
			description:     {
				type:     String,
				optional: true
			},
			has_pricing:     {
				type: Array
			},
			'has_pricing.$': new SimpleSchema(
				{
					pricing_id:    String,
					addition_data: {
						type:     Object,
						optional: true
					},
				}
			),
			versions:        [
				new SimpleSchema(
					{
						name:         String,
						version:      String,
						api:          {
							type: Array
						},
						'api.$':      String,
						customers:    new SimpleSchema(
							{
								type:      String,
								users:     {
									type: Array
								},
								'users.$': String,
							}
						),
						path:         String,
						descriptions: {
							type:     String,
							optional: true
						},
						changelog:    {
							type:     String,
							optional: true
						},
						created_at:   {
							type: Date,
						},
						updated_at:   {
							type: Date,
						},
					}
				)
			],
			apiVersions:     {
				type: Array
			},
			'apiVersions.$': new SimpleSchema(
				{
					code:           String,
					name:           String,
					package_module: String
				}
			),
			created_at:      {
				type:         Date,
				defaultValue: DateTimeHelper.getCurrentDate()
			},
			updated_at:      {
				type:         Date,
				defaultValue: DateTimeHelper.getCurrentDate()
			}
		}
	)
);
