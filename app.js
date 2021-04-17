'use strict';
require('dotenv').config();
const PORT = 3000;
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodoveride = require('method-override');
const app = express();
const client = new pg.Client(process.env.DB_URL);
app.use(express());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.use(methodoveride('_method'));

app.get('/',(req,res)=>{
    const sql = "SELECT * FROM country";
    client.query(sql)
    .then(result=>{
        console.log(result.rowCount);
        res.render('index',{data:result.rows,count:result.rowCount});
    })
    .catch(err=>console.log('ERROR in DB ',err))
})

app.get('/allContries',(req,res)=>{
    let url ='https://api.covid19api.com/summary';
    superagent.get(url).then(
        result=>{
            res.render('pages/summary',{data:result.body.Countries});
        }
    ).catch(err=>console.log('Error in summary api',err))
    
})

app.post('/countrySearch',(req,res)=>{
    const countryName = req.body.search;
    console.log(countryName);
    let url = `https://api.covid19api.com/country/${countryName}/status/confirmed?from=2021-04-16T00:00:00Z&to=2021-04-17T00:00:00Z
    `;
    superagent.get(url)
    .then(result=>{
        console.log(result.body[1]);
        res.render('pages/country',{item:result.body[1]});
    })
    .catch(err=>console.log('Error in country Api',err))


})

app.post('/addToDB',(req,res)=>{
    console.log(req.body);
    let arr =[req.body.country ,req.body.totalConfirmed,req.body.totalDeaths,req.body.totalRecovered,req.body.date];
    const sql = 'INSERT INTO country (name,totalconfirmed,totaldeaths,totalrecovered,date) VALUES ($1,$2,$3,$4,$5)';

    client.query(sql,arr)
    .then(result=>{
        res.redirect('/');
    })
    .catch(err=>console.log('Error while Inserting to DB ',err))
})


app.delete('/delete/:id',(req,res)=>{
    console.log(req.params.id);
    let sql = 'delete from country where id=$1';
    client.query(sql,[req.params.id]).then(respo=> res.redirect('/')).catch(err=>console.log('err delete',err));
})


client.connect().then(() => {
    console.log('Connected Successfuly');
    app.listen(process.env.PORT || PORT, () => console.log('Our server Run on PORT ' + PORT));
}).catch(err => console.log('ERROR While Connecting'))