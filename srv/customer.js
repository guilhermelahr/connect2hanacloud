const cds = require("@sap/cds");
const xsenv = require("@sap/xsenv");
xsenv.loadEnv();

module.exports = async function (srv) {

    var service = xsenv.getServices({ "hana": { name: "my-papm-db" } });
    //const db = await cds.connect.to({ kind: 'hana-cloud', credentials: service.hana.credentials });
    const db = await cds.connect.to("db");

    srv.on("READ", "Customers", async (req) => {

        const aFilter = req.query.SELECT.from.ref[0].where || undefined;
        const oLimit = req.query.SELECT.limit;

        let query;

        if ((typeof aFilter !== "undefined")) {
            query = SELECT.from('Customers').alias('').limit(oLimit).where(aFilter);
        } else {
            query = SELECT.from('Customers').alias('').limit(oLimit);
        }

        let aData = await db.run(query);

        return aData.map(oObj => {
            let aProperties = Object.getOwnPropertyNames(oObj),
                oReturn = {};
            aProperties.forEach(sName => {
                oReturn[sName.toLowerCase()] = oObj[sName];
            });
            return oReturn;
        });

    });

    srv.on("CREATE", "Customers", async (req) => {

        let query = INSERT.into('Customers').entries({
            "id": req.data.id,
            "name": req.data.name,
            "city": req.data.city,
            "gender": req.data.gender,
            "number_of_trips": req.data.number_of_trips,
            "loyalty_member": req.data.loyalty_member,
            "balance": req.data.balance
        });

        let returnData = await db
            //.tx(req)
            .run(query)
            .then((resolve, reject) => {
                console.log("resolve:", resolve);
                console.log("reject:", reject);

                if (typeof resolve !== "undefined") {
                   // db.tx(req).commit();
                    return req.data;
                } else {
                    req.error(409, "Record Not Found");
                }
            })
            .catch(err => {
                console.log(err);
                req.error(500, "Error in Updating Record");
            });
        console.log("Before End", returnData);
        return returnData;

    });

    srv.on("DELETE", "Customers", async (req) => {

        const aFilter = req.query.DELETE.from.ref[0].where || undefined;

        if (typeof aFilter !== "undefined") {

            const query = DELETE.from("Customers").where(aFilter);
            await db.run(query);

        } else {

        }
    });


    srv.on("UPDATE", "Customers", async (req) => {
        
        const aFilter = req.query.UPDATE.entity.ref[0].where || undefined;
        const oData = req.query.UPDATE.data;

        if ((typeof aFilter !== "undefined") && (typeof oData !== "undefined")) {

            const query = UPDATE("Customers")
                                .where(aFilter)
                                .with(oData);
            await db.run(query);

        } else {

        }

    });

}


