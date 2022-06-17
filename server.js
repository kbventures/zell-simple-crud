console.log('May Node Be With You')

const express = require('express');
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://kb:Fuckthis22@cluster0.8dyricr.mongodb.net/?retryWrites=true&w=majority'


MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')


    // Middlewares
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.static('public'))
    app.use(bodyParser.json())


    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.get('/', function (req, res) {
      db.collection('quotes').find().toArray()
        .then(results => {
          res.render('index.ejs', { quotes: results })
        })
        .catch(error => console.error(error))
    })

    app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })

    app.delete('/quotes', (req,res)=>{
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if(result.deletedCount === 0){
          return res.json('No quote to delete')
          }
          res.json(`Deleted Darth Vadar's quote`)
        })
        .catch(error => console.error(error))
    })
})




// app.get('/', function(req,res){
//     res.sendFile(__dirname + '/index.html')
// })


app.listen(3001, () => {
  console.log('listening on 3001')
})

