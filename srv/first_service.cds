// mettere il namespace delle entity
using innovatesapp.hr as inno from '../db/Student';

// deve avere lo stesso nome della costante in export del file .js
// con @path cambiamo il path di default
service mysrvdemo @(path:'student', impl: './first_service.js'){
    // stesso nome messo in on
//   function ReadOperation(msg:String) returns String;
    @readonly entity GetStudent as projection on inno.Student;
    @updateonly entity UpdateStudent as projection on inno.Student;
    @createeonly entity CreateStudent as projection on inno.Student;
    @deleteeonly entity DeleteStudent as projection on inno.Student;
}

//per lanciare il servizio con sqlite: cds run --in-memory

// per deployare cds deploy --to sqlite (o to hana)

