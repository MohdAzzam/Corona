drop TABLE country;

CREATE TABLE country (
    id serial primary key ,
    name varchar(255),
    totalconfirmed VARCHAR(255),
    totaldeaths VARCHAR(255),
    totalrecovered VARCHAR(255),
    date VARCHAR(255)
    );