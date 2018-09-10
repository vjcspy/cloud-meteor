new ValidatedMethod({
                        name: 'license.get_permissions',
                        validate: function () {
                            if (!this.userId) {
                                throw new Meteor.Error("license.delete_role", "Access denied");
                            }
                        },
                        run: function () {
                            return [
                                {
                                    group: "users",
                                    name: "Users",
                                    sections: [
                                        {
                                            name: "Manage User",
                                            permissions: [
                                                {
                                                    name: "Access to User Management",
                                                    permission: "access_to_user_management",
                                                    is_active: false
                                                }
                                            ],
                                        },
                                        {
                                            name: "Users",
                                            permissions: [
                                                {
                                                    name: "Create New User",
                                                    permission: "create_new_user",
                                                    is_active: false
                                                },
                                                {
                                                    name: "View User",
                                                    permission: "view_user",
                                                    is_active: false
                                                },
                                                {
                                                    name: "Edit User",
                                                    permission: "edit_user",
                                                    is_active: false
                                                },
                                                {
                                                    name: "Delete User",
                                                    permission: "delete_user",
                                                    is_active: false
                                                },

                                            ],
                                        },
                                        {
                                            name: "Roles and Permissions",
                                            permissions: [
                                                {
                                                    name: "View, Edit, Create, Delete Role",
                                                    permission: "view_edit_create_delete_role",
                                                    is_active: false
                                                },
                                                // {
                                                //     name: "View, Edit Role Permission",
                                                //     permission: "view_edit_role_permission",
                                                //     is_active: false
                                                // }
                                            ]
                                        },
                                    ],
                                },
                                {
                                    group: "report",
                                    name: "Report",
                                    sections: [
                                        {
                                            name: "Reports",
                                            permissions: [
                                                {
                                                    name: "Access to XReport",
                                                    permission: "access_to_xreport",
                                                    is_active: false
                                                },
                                                {
                                                    name: "View Dashboard",
                                                    permission: "view_dashboard",
                                                    is_active: false
                                                },
                                                {
                                                    name: "View And Generate Sale Report",
                                                    permission: "view_and_generate_sale_report",
                                                    is_active: false
                                                },
                                                {
                                                    name: "View And Generate Shift Detail Report",
                                                    permission: "view_and_generate_shift_detail_report",
                                                    is_active: false
                                                }
                                            ]
                                        },
                                    ]
                                },
                                {
                                    group: "connectpos",
                                    name: "ConnectPOS",
                                    sections: [
                                        {
                                            name: "ConnectPOS Settings",
                                            permissions: [
                                                {
                                                    name: "Access to ConnectPOS Settings",
                                                    permission: "access_to_connectpos_settings",
                                                    is_active: false
                                                },
                                                {
                                                    name: "Access to ConnectPOS",
                                                    permission: "access_to_connectpos",
                                                    is_active: false
                                                }
                                            ]
                                        },
                                        {
                                            name: "Product",
                                            permissions: [
                                                {
                                                    name: "Allow Using Custom Sale",
                                                    permission: "allow_using_custom_sale",
                                                    is_active: false
                                                },
                                            ]
                                        },
                                        {
                                            name: "Customer",
                                            permissions: [
                                                {
                                                    name: "Update Customer Data",
                                                    permission: "change_customer_information",
                                                    is_active: false
                                                },
                                            ]
                                        },
                                        {
                                            name: "Register",
                                            permissions: [
                                                {
                                                    name: "View Register",
                                                    permission: "view_register",
                                                    is_active: false
                                                },
                                                {
                                                    name: "Open And Close Register",
                                                    permission: "open_and_close_register",
                                                    is_active: false
                                                },
                                                {
                                                    name: "Make Adjustment On Register",
                                                    permission: "make_adjustment_on_register",
                                                    is_active: false
                                                },
                                            ]
                                        },
                                        {
                                            name: "Sales And Transaction",
                                            permissions: [
                                                {
                                                    name: "Create Orders",
                                                    permission: "create_orders",
                                                    is_active: false
                                                },
                                                {
                                                    name: "Custom Price",
                                                    permission: "custom_price",
                                                    is_active: false
                                                },
                                                {
                                                    name: "Add Discount",
                                                    permission: "add_discount",
                                                    is_active: false
                                                },
                                                {
                                                    name: "Make Shipment",
                                                    permission: "make_shipment",
                                                    is_active: false
                                                },
                                                {
                                                    name: "View Order List",
                                                    permission: "view_order_list",
                                                    is_active: false
                                                },
                                                {
                                                    name: "Make Refund",
                                                    permission: "make_refund",
                                                    is_active: false
                                                },
                                            ]
                                        },
                                    ]
                                },
                            ];
                        }
                    });
