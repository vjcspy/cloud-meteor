import {updateExpireDate} from "../models/updateExpireDate";

SyncedCron.add({
                    name: "update expire date(00:00 everyday)",
                    schedule: function (parser) {
                        return parser.text(' at 00:00 am ');
                    },
                    job: function () {
                            updateExpireDate();

                    }
                });
