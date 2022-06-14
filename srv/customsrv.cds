using mysrvdemo as mysrv from './first_service';
using innovatesapp.hr as inno from '../db/Student';

// quando si estende un servizio va rideployato a DB per creare le nuove strutture
extend service mysrv with @(path: 'student'
// impl: './customsrv.js' --> se qui aggiungiamo una impl, non verrà più eseguita quella di default nella cds principale
)
{
        @readonly entity GetCustomStudent as select from inno.Student {
            *, // prende tutti i campi
            first_name ||' '|| last_name as full_name: String
        }excluding {
            date_signed_up
        }

    }
