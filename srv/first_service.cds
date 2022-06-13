// mnettere il namespace delle entity
using innovatesapp.hr as inno from '../db/Student';

// deve avere lo stesso nome della costante in export del file .js
service mysrvdemo {
    // stesso nome messo in on
//   function ReadOperation(msg:String) returns String;
    @readonly entity StudentSRV as projection on inno.Student;
}

//per lanciare il servizio con sqlite: cds run --in-memory

