const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const session = require('express-session');
const LokiStore = require('connect-loki')(session);

const port = 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//express session initc
app.use(session({
	store: new LokiStore(),
	secret: 'het5feladat',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}))

app.get('/', (req, res) => {
	//init clickCount
	if (typeof req.session.clickCount === 'undefined') {
		req.session.clickCount = 0;
	}
	console.log(req.sessionID);
	console.log(req.session);
	let btn1ClickCount = req.session.clickCount;
	res.render('index', {btn1ClickCount});
})

app.post('/',(req, res, next) =>{
	//button1
	if  (typeof req.session.clickCount !== 'undefined' && req.body.btn1 === 'btn1click'){
		req.session.clickCount++;
		let btn1ClickCount = req.session.clickCount;
		console.log(req.sessionID);
		console.log(req.session);
		return res.render('index', {btn1ClickCount});
	}
	//button2
	if (req.body.btn2 === 'btn2click'){
		req.session.regenerate(function(err) {
			//for error handler MW when exit on MW chain
			if (err){
				next(new Error(err.stack));
			}
		})
		return res.redirect('/');
	}
	return res.redirect('/');
})



app.listen(port, () => {
	console.log(`Running on http://localhost:${port}`)
})
