module.exports = srv => 
{ 
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
