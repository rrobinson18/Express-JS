const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
let app = express();

let formPath = path.join(__dirname, '../form-post.json');


app.use((req, res, next) => {
  fs.appendFileSync('log.txt', `${req.originalUrl}\n`);
  next();
})

app.use(bodyParser.urlencoded({
  extended: false
}));

let contact = {
  email: '',
  name: ''
};


app.post('/contact-form', (req, res, next) => {

  contact.email = req.body.email;
  contact.name = req.body.name;
  console.log(contact);

  require('fs').writeFileSync(formPath, JSON.stringify(contact),
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  res.redirect('/formsubmission');
  next();
});

// app.get('/', (req, res, next) => {
//     res.send('Hello from the server side...');
// });

app.use(express.static(path.join(__dirname, '../public')));


app.get('/formsubmission', (req, res, next) => {
  fs.readFile(formPath, 'utf8', function (err, data) {
    if (err) console.log(err);

    data = JSON.parse(data);
    let contactData =

    `email: ${data.email} <br>
     name: ${data.name}
    `

    console.log(data)
    res.send(`Thank You ${data.name} for submitting your data. Just to confirm. You entered ${contactData} `);
    next();
  })
})

app.listen(3000);