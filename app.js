//in dev run nodemon with for instant reload
//add requiered library 
const express = require('express'); //must be installed with npm
const ejs = require('ejs'); //must be installed with npm
const db = require('./db.js'); // Import the database module
const bodyParser = require('body-parser');//must be installed with npm

//create variable representing express
const app = express();

//set public folder for static web pages
app.use(express.static('public'));

//set dynamic web pages, set views and engine
app.set('view engine', 'ejs');

// Set up body parser middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

////////////////Routing

let selectedTable;


app.get('/', async (req, res) => {
    //res.send("hello World");//serves index.html
    const pageTitle = "Home";
    const sql = 'SHOW TABLES';
    const dbData = await db.query(sql);
    console.log(dbData);
    res.render('index', { pageTitle, dbData });
});

app.post('/', async (req, res) => {
    //res.send("hello World");//serves index.html
    console.log(req.body);
    const tableName = req.body;
    const pageTitle = "Home";
    const sql = `SELECT * FROM ${tableName.table_name}`;
    const dbData = await db.query(sql);
    const sql2 = `DESCRIBE ${tableName.table_name}`;
    const dbHeaders = await db.query(sql2);

    selectedTable = tableName.table_name;
    console.log("this is selected " + selectedTable);
    console.log(dbData);
    console.log(dbHeaders);
    res.render('index', { pageTitle, dbData, dbHeaders });
});

//Remove sidan 


app.get('/remove.ejs', async (req, res) => {
    //res.send("hello World");//serves index.html
    const pageTitle = "Remove";
    const sql = `SELECT * FROM ${selectedTable}`;
    const dbData = await db.query(sql);
    console.log(dbData);
    res.render('remove', { pageTitle, dbData });
});

app.post('/remove.ejs', async (req, res) => {
    //res.send("hello World");//serves index.html
    console.log(req.body);
    const idReq = req.body;
    const pageTitle = "Remove";

    const del = `DELETE FROM ${selectedTable} WHERE id = ${idReq.id}`;

    const dbDataDel = await db.query(del);
    console.log(dbDataDel);

    const sql = `SELECT * FROM ${selectedTable}`;

    const dbData = await db.query(sql);
    console.log(dbData);

    res.render('remove', { pageTitle, dbData });
});

//Add sida

app.get('/add.ejs', async (req, res) => {
    //res.send("hello World");//serves index.html
    const pageTitle = "Add klasser";
    const sql = 'SHOW TABLES';
    const dbData = await db.query(sql);
    console.log(dbData);
    res.render('add', { pageTitle, dbData });
});



app.post('/add.ejs', async (req, res) => {
    //res.send("hello World");//serves index.html
    console.log(req.body);
    const klassInfo = req.body;
    const values = [klassInfo.klassnamn, klassInfo.studieår]
    console.log(values);
    const pageTitle = "Add klasser";

    const addKlass = `INSERT INTO klasser(klassnamn, studieår) VALUES (?,?);`;
    const klassAdded = await db.query(addKlass, values);
    console.log("added " + klassAdded);

    const sql = `SELECT * FROM klasser;`;
    const dbData = await db.query(sql);

    // selectedTable = tableName.table_name;
    // console.log("this is selected " + selectedTable);
    // console.log(dbData);
    // console.log(dbHeaders);

    // res.render('add', { pageTitle, dbData, dbHeaders });

    res.render('add', { pageTitle, dbData });
});


//Addmore sida

app.get('/addmore.ejs', async (req, res) => {
    //res.send("hello World");//serves index.html
    const pageTitle = "Add more";
    const sql = 'SHOW TABLES';
    const dbData = await db.query(sql);
    console.log(dbData);
    res.render('addmore', { pageTitle, dbData });
});

let selectedTable2;

app.post('/addmoreForm1', async (req, res) => {
    //res.send("hello World");//serves index.html
    console.log(req.body);
    selectedTable2 = req.body;
    // const values = [klassInfo.klassnamn, klassInfo.studieår]
    const pageTitle = "Add more";

    const describedData = `DESCRIBE ${selectedTable2.selected_table};`;
    const dbData = await db.query(describedData);

    // const sql = `SELECT * FROM klasser;`;
    // const dbData = await db.query(sql);

    // selectedTable = tableName.table_name;
    // console.log("this is selected " + selectedTable);
    // console.log(dbData);
    // console.log(dbHeaders);

    // res.render('add', { pageTitle, dbData, dbHeaders });

    res.render('addmore', { pageTitle, dbData });
});


app.post('/addmoreForm2', async (req, res) => {
    //res.send("hello World");//serves index.html
    // console.log(req.body);
    const userInfo = req.body;
    console.log(userInfo);
    // const values = [klassInfo.klassnamn, klassInfo.studieår]
    const pageTitle = "Dynamic webpage";

    // const describedData = `DESCRIBE ${selectedTable2.selected_table};`;
    // const dbData = await db.query(describedData);
    let userInfoKey = '';
    let userInfoValue = '';
    let amount = '';
    for (const key in userInfo) {
        userInfoKey += key + ", ";
        userInfoValue += userInfo[key] + ", ";
        amount += '?, ';

    }
    console.log(userInfoKey.slice(0, -2));
    console.log(userInfoValue.slice(0, -2));

    const columns = userInfoKey.slice(0, -2);

    const addRow = `INSERT INTO ${selectedTable2.selected_table}(${columns}) VALUES (${amount.slice(0, -2)});`;

    const rowAdded = await db.query(addRow, Object.values(userInfo));
    console.log(rowAdded);

    const sql = `SHOW TABLES;`;
    const dbData = await db.query(sql);

    // selectedTable = tableName.table_name;
    // console.log("this is selected " + selectedTable);
    // console.log(dbData);
    // console.log(dbHeaders);

    // res.render('add', { pageTitle, dbData, dbHeaders });

    res.render('addmore', { pageTitle, dbData });
});


//server configuration
const port = 3000;
app.listen(port, () => {
    console.log(`server is running on  http://localhost:${port}/`);
});