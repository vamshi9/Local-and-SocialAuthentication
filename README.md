# Paaport Authentication
passport.js Authentication

#About this Project
   >I have done everything right from the scratch and cross-checked it many times so i'll assure you that there will be no error unless you create one.
   
#Before going into the project we need to know few things
   
   >Express **Framework** *you can install it from here* [Node installation](https://nodejs.org/en/) 
       
   >Mongoose **mongoDB-database**
       
   >EJS **Template Engine ** *you can use any template engine like jade,handlebars*
       
   >brypt-Nodejs **hashing password**
  
   >[PassportJS](http://passportjs.org/docs)
  
#OMG! Did I forget to mention about what we are about to see? o.O

![alt text](https://github.com/vamshi9/Local-and-SocialAuthentication/blob/master/images/Screenshot%20(145).png "home page")

>Just be so clear about this structure because *routes.js* (you'll come to know) is going to play huge role in this application.

![alt text](https://github.com/vamshi9/Local-and-SocialAuthentication/blob/master/images/Capture.PNG "Application Structure")
 
>Your application is useless without dependencies so how do we install these dependencies?

   Before installation make sure *npm* works fine otherwise installation will be resulting in bunch of errors.
   
   If you don't know how to install node-express go through [Derek Benas express and mongo      tutorial](https://www.youtube.com/playlist?list=PLGLfVvz_LVvSpxyVx5XcprEgvhJ1BzruD) video.
   
   I love his videos more than any other online tutorial.
   
   Open command prompt set the path and type *npm install dependency --save* which directly saves into your package.json file
   
>Following are the dependencies we need to install.

![alt text](https://github.com/vamshi9/Local-and-SocialAuthentication/blob/master/images/Screenshot%20(128).png)

>Enough is enough!

* Now let's dive into the application and have some fun * 

#server.js
  We need to set up server.js with all bootstraping of the files which we are going to see.
  
  Get all the requirements through *require()*
  
```javascript

var express = require('express') ; 

var app = express() ; 

//setting up the port
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


```

*Yeah! You are stuck with an error right. That's because we haven't included out passport file*

![alt text](https://github.com/vamshi9/Local-and-SocialAuthentication/blob/master/images/error1.PNG "error1")

Chill out! Just comment out this line.

```javascript
    require('./config/passport')(passport);
```
Did you notice one strange thing in the above command prompt? Hope you didn't! :p. 

I always use **nodemon** to run server because I need not restart my server again and again.I am going to pass my work to nodemon so it checks out my server whenever I make any changes.

Now open your preferable browser and 






