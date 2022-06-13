namespace innovatesapp.hr;

//using { cuid } from '@sap

entity Student {
    key email: String;
    first_name: String;
    last_name: String;
    age: Integer;
    date_signed_up: Date;  
}

