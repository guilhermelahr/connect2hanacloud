service Catalog @(impl:'./customer.js')
{

    entity Customers {
        key id              : Integer not null;
            name            : String(30) not null;
            city            : String(100);
            gender          : String(6);
            number_of_trips : Integer;
            loyalty_member  : Boolean default 0;
            balance         : Decimal(6, 2);
    }

};