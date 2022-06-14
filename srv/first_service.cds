// mnettere il namespace delle entity
using innovatesapp.hr as inno from '../db/Student';

// deve avere lo stesso nome della costante in export del file .js
service mysrvdemo {
    // stesso nome messo in on
//   function ReadOperation(msg:String) returns String;
    @readonly entity GetStudent as projection on inno.Student;
    @updateonly entity UpdateStudent as projection on inno.Student;
    @createeonly entity CreateStudent as projection on inno.Student;
    @deleteeonly entity DeleteStudent as projection on inno.Student;
}

//per lanciare il servizio con sqlite: cds run --in-memory

