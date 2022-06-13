using mysrvdemo as srv1 from '../../../srv/first_service';


annotate srv1.StudentSRV with @(
    UI: {
            LineItem  : [
                {
                    Label: 'Email',
                    Value: email,
                },
                {
                    Label: 'First Name',
                    Value: first_name,
                },
                {
                    Label: 'Last Name',
                    Value: last_name,
                },
                {
                    Label: 'Age',
                    Value: age,
                },
                {
                    Label: 'Date Signed Up',
                    Value: date_signed_up,
                }
            ],
            // fornisce i dettagli dell'item selezionato
            HeaderInfo  : {
                $Type : 'UI.HeaderInfoType',
                TypeName : 'Student',
                TypeNamePlural : 'Students',
                Title : { Value: last_name },
                Description : {
                    Value : email
                }
            },
    }
);
