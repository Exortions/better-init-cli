const layouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.set('layout', './layouts/full-width')
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(layouts)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.listen(3000);