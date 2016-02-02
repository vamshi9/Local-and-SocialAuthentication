var express = require('express') ; 

var app = express() ; 

var port = process.env.PORT || 2626;

var cookie = require('cookie-parser') ; 

var session =  require('express-session') ; 

var morgan = require('morgan') ;	

var flash = require('connect-flash');																																				

var mongoose = require('mongoose');

var passport = require('passport');

mongoose.connect('mongodb://localhost/db_drakle');
	
 require('./config/passport')(passport);

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended : false}));

//setting up ejs for templating
app.set('view engine','ejs');


app.use(cookie()) ;
app.use(morgan('dev')) ; 

//required for passport
//saveUninitialized and resave is optional
app.use(session({
	secret : 'anystringoftext', 
	saveUninitialized : true ,
	resave : true 
}));

//log every request to console
 

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use('/',function (req,res){
// 	res.send('write something') ;

// 	console.log(req.cookie) ;

// 	console.log(req.session) ;	 
// }) ;

require('./apps/routes.js')(app,passport) ; 


app.listen(port) ;

console.log('server is running on port ' + port ) ;

