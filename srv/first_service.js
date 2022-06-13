// simple demo function
/* const mysrvdemo = function(srv) {
    srv.on("ReadOperation", (req, _) => {
       // res.send("Hello World!");
       return `Hello World ${req.data.msg}`;
    } );
}; */

// funciton that performs a SELECT query
const cds = require("@sap/cds");
// namespace of the entity defined in the .cds file
const { Student } = cds.entities("innovatesapp.hr");

const mysrvdemo = srv => { 
    // StudentSRV is the name of the entity defined in the .cds file
    // with promises for the SELECT query
    /*
    srv.on("READ", "StudentSRV", (req, _) => { 
        const { SELECT } = cds.ql(req);
        return SELECT.from( Student ).then(res => { console.log(res); } );
        //console.log(result);
        //return result;
    });
    */
   // with async/await
    srv.on("READ", "StudentSRV", async (req, _) => { 
        const { SELECT } = cds.ql(req);
        const result = await SELECT.from( Student );
        console.log(result);
        return result;
    });
};

exports.mysrvdemo = mysrvdemo;
