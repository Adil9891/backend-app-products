var express = require('express')
const { Client } = require('pg');
var cors = require('cors')
var app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cors())

/* const products = [{ name: 'Pomme', description: 'Pomme de fes', price: '100', picture: 'pomme.jpg' },
{ name: 'Banane', description: 'Banane de costarica', price: '200', picture: 'banane.jpg' },
{ name: 'Pasthèque', description: 'Pasthèque de Agadir', price: '300', picture: 'pastheque.jpg' },
{ name: 'Avocat', description: 'Avocat de kenitra', price: '400', picture: 'avocat.jpg' },
{ name: 'Courgette', description: 'Courgette ...', price: '200', picture: 'courgette.jpg' },
{ name: 'Olive', description: 'Olive Essaouira', price: '700', picture: 'olive.jpg' },
{ name: 'Pomme de terre', description: 'Pomme de terre ...', price: '800', picture: 'pomme_de_terre.jpg' },
{ name: 'Persil', description: 'Persil ...', price: '300', picture: 'persil.jpg' }
] */

const client = new Client({
    user: 'admin',
    host: '127.0.0.1',
    database: 'BANQUE',
    password: 'azerty',
    port: 5432
});

client.connect();

function getAllProducts(clt, callback) {
    const query = "SELECT *  FROM products";
    clt.query(query, callback);
}

app.get('/get-products', (req, res) => {

    function callback(err, result) {
        if (err) {

            res.status(500).json({ message: 'Error retrieving data from PostgreSQL' });
        } else {
            // res.status(200).send(displayAllClient(result.rows))
            res.status(200).json(result.rows)

        }
    }
    getAllProducts(client, callback)



})
let newProduct = {};
function addProduct(clt, callback) {
    console.log(newProduct)
    console.log(newProduct.nom)
    const query = {
        text: 'INSERT INTO products(nom,description,price,picture) VALUES($1, $2, $3, $4)',

        values: [newProduct.nom, newProduct.description, newProduct.price, newProduct.picture],
    };

    console.log(query)
    clt.query(query, callback)
}


app.post('/add-product', (req, res) => {
    console.log(req.body)
    newProduct = req.body
    console.log(newProduct)
    function callback(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send('Error adding data to database');
        } else {
            res.send('Data added to database successfully');
        }
    };
    addProduct(client, callback)



})

let idProduct = ''
function deleteProduct(clt, callback) {

    const query = {
        text: 'DELETE FROM products where id = $1',

        values: [idProduct],
    };

    console.log(query)
    clt.query(query, callback)
}

app.delete('/delete-product', (req, res) => {
    console.log(req.body.idProduct)
    idProduct = req.body.idProduct
    console.log('idProduct : ' + idProduct)
    function callback(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send('Error adding data to database');
        } else {
            res.send('Data added to database successfully');
        }
    };
    deleteProduct(client, callback)



})


app.listen(8000, function () {
    console.log('server listening on port 8000')
})
