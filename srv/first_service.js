// simple demo function
/* const mysrvdemo = function(srv) {
    srv.on("ReadOperation", (req, _) => {
       // res.send("Hello World!");
       return `Hello World ${req.data.msg}`;
    } );
}; */

// funciton that performs a SELECT query
const cds = require("@sap/cds");
const req = require("express/lib/request");
// namespace of the entity defined in the .cds file
const { Student } = cds.entities("innovatesapp.hr");

const mysrvdemo = srv => 
{ 
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
    srv.on("READ", "GetStudent", async (req, _) => { 
        //const { SELECT } = cds.ql(req);
        //inserimento filtro 
        /*
        se si filtra su un parametro chiave, si può inserire il parametro tra le parentesi
        - StudentSRV(email='gyo@email.com')
        */
       // va capito come usare la SELECT attraverso la query
        const filter1 = req.query.SELECT;
        // in req.data ci sono i dati che vengono passati tramite filtro sul parametro chiave
        const filter2 = req.data
        // in questo modo si controlla che un oggetto JS non sia vuoto
        if( Object.keys(filter2).length > 0 )
        {
            console.log(req.data);
            const result = await SELECT.from( Student ).where( filter2 );
            console.log(result); 
            return result;
        }
        if(req._queryOptions)
        {
            // se passano dei parametri tramite queryOptions (?age=30)
            console.log(req._queryOptions);
            const result2 = await SELECT.from( Student ).where( req._queryOptions ); 
            return result2;
        }
        
        return await SELECT.from( Student );
    });

    // con after manipoliamo i dati estratti dalla query ON:
    /*
    * non si può alterare il numero di righe restituite
    * non si possono aggiungere nuovi campi, oltre quelli restituiti dalla query in ON
    */
    srv.after("READ", "GetStudent", data => {
        return data.map(item => { item.first_name = item.first_name.toUpperCase(); return item; });
    });

    // manipoliamo l'update
    /*
    srv.on("CREATE", "UpdateStudent", async (req, _) => {
  //      const { UPDATE } = cds.ql(req);
        console.log("Printing data: " + JSON.stringify(req.data));
        let first_name = req.data.first_name;
        let email = req.data.email;
        const result = await UPDATE( Student ).set({ first_name : first_name }).where({ email: email });
        console.log("Printing Result: " + result);
        return req.data;

     } );
     */
     // scriviamo la stessa funzione per l'update, ma usando una transazione:
     
     srv.on("CREATE", "UpdateStudent", async (req, next) => 
     {
        console.log("Printing data: " + JSON.stringify(req.data));
        let first_name = req.data.first_name;
        let email = req.data.email;
        //const { UPDATE } = cds.ql(req);
        const resultTx = await cds.transaction(req)
// in run è anche possibile inserire un array di operazioni:
//run( [UPDATE(...), UPDATE(...), UPDATE(...)] )
                    .run( UPDATE( Student )
                                        .where({ email: email })
                                        .set({ first_name : first_name } ) )
                    .then( (resolve, reject) => {
// in resolve abbiamo il numero di linee aggiornate, quindi se non si aggorna nessuna riga, il valore sarà 0
                        if(typeof resolve === "number")
                        {
                            console.log("Resolve " + resolve);
                            console.log("Transaction Successfull");
                            // non funziona: non è`possibile aggiungere un campo alla risposta
                            return { ...req.data, updated_records: resolve };
                        }
                        else
                        {
                            console.log("Reject " + reject);
                            console.log("Transaction Failed");
                            return req.error(409, "Transaction Failed, Rollback");
                        }
                    } )
                    .catch(err => {
                        req.error(500, "Error During Update, Rollback");
                    });
        req.data = resultTx;
        console.log("Printing Result: " + JSON.stringify(resultTx));
        //next(req);            
        return resultTx;

    } );
    srv.on("CREATE", "CreateStudent", async (req, next) => 
     {
        console.log("Printing data: " + JSON.stringify(req.data));
        let first_name = req.data.first_name;
        let email = req.data.email;
        //const { UPDATE } = cds.ql(req);
        const resultTx = await cds.transaction(req)
// in run è anche possibile inserire un array di operazioni:
//run( [UPDATE(...), UPDATE(...), UPDATE(...)] )
                    .run( INSERT.into( Student ).entries( { 
                        email : req.data.email,
                        first_name : first_name, 
                        last_name : req.data.last_name,
                        age : req.data.age,
                        date_signed_up: req.data.date_signed_up } ) )
                    .then( (resolve, reject) => {
// in resolve abbiamo il numero di linee aggiornate, quindi se non si aggorna nessuna riga, il valore sarà 0
                        if(typeof resolve !== "undefined")
                        {
                            console.log("Resolve " + resolve);
                            console.log("Transaction Successfull");
                            // non funziona: non è`possibile aggiungere un campo alla risposta
                            return { ...req.data, updated_records: resolve };
                        }
                        else
                        {
                            console.log("Reject " + reject);
                            console.log("Transaction Failed");
                            return req.error(409, "Transaction Failed, Rollback");
                        }
                    } )
                    .catch(err => {
                        req.error(500, err);
                    });
        //req.data = resultTx;
        // in resultTx non ci sono solo i dati dell'oggetto aggiornato, ma anche altri dati
        console.log("Printing Result: " + resultTx.email);
        //next(req);            
        return resultTx;
                    
    } );
    srv.on("DELETE", "DeleteStudent", async (req, next) => 
     {
        const filter = req.data
        console.log("Printing data: " + JSON.stringify(req.data));
        //let first_name = req.data.first_name;
        let { email } = req.data;
        //const { UPDATE } = cds.ql(req);
        const resultTx = await cds.transaction(req)
// in run è anche possibile inserire un array di operazioni:
//run( [UPDATE(...), UPDATE(...), UPDATE(...)] )
                    .run( DELETE.from( Student ).where( filter ) )
                    .then( (resolve, reject) => {
// in resolve abbiamo il numero di linee aggiornate, quindi se non si aggorna nessuna riga, il valore sarà 0
                        if(typeof resolve !== "undefined")
                        {
                            console.log("Resolve " + resolve);
                            console.log("Transaction Successfull");
                            // non funziona: non è`possibile aggiungere un campo alla risposta
                            return { ...req.data, updated_records: resolve };
                        }
                        else
                        {
                            console.log("Reject " + reject);
                            console.log("Transaction Failed");
                            return req.error(409, "Transaction Failed, Rollback");
                        }
                    } )
                    .catch(err => {
                        req.error(500, err);
                    });
        //req.data = resultTx;
        // in resultTx non ci sono solo i dati dell'oggetto aggiornato, ma anche altri dati
        //console.log("Printing Result: " + resultTx.email);
        //next(req);            
        return resultTx;
                    
    } );

    srv.before("CREATE", "CreateStudent", (req, _) => {
        if(typeof req.data.email === "undefined")
        {
            req.error(409, "Missing email");
        }
        if(!req.data.email.toLowerCase().includes("@"))
        {
            req.error(409, "Invalid email");
        }
    });
    
}

exports.mysrvdemo = mysrvdemo;
