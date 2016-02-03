var LocalStrategy = require('passport-local').Strategy;

var FacebookStrategy =  require('passport-facebook').Strategy;

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


var User = require('../apps/models/users.js');

var configAuth = require('./auth');

module.exports =function(passport){

    //serialize user
	passport.serializeUser(function(user,done){
		done(null,user.id);
	});


    //deserialize user
	passport.deserializeUser(function(id,done){
		User.findById(id, function(err, user) {
            done(err, user);
        });
	});

	passport.use('local-signup', new LocalStrategy({
	         	usernameField : 'email',
                passwordField : 'password',
                passReqToCallback : true
	         },
             function(req , email , password , done){
	         	process.nextTick(function(){
	         		User.findOne({'local.email' : email},function(err,user){
	         			if(err)
	         				return done(err);
	         			if(user){
	         				return done(null,false,req.flash('signupMessage' ,'email already in existence'));
	         			}else{
	         				var newUser = new User();

	         				newUser.local.email = email;
	         				newUser.local.password = newUser.generateHash(password);

	         				newUser.save(function(err){
	         					if(err)
	         						throw err;
                                return done(null,newUser);
	         				});
	         			}
	         		});
	         	});

	         }));  

    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
      process.nextTick(function(){
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            if (user.validPassword(password))
                return done(null, user);
        });
       });
    }));

    passport.use('facebook',new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : ["email","id","displayName","photos","name"] ,
        passReqToCallback : true

    },

    // facebook will send back the token and profile
    function(req,token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {


          if(!req.user){
            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user
                      //console.log('you are connected');
                    displayName = profile.displayName;                    
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.facebook.photos = profile.photos[0].value;

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
          }else{
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session

                // update the current users facebook credentials
                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = profile.emails[0].value;

                // save the user
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

          }
        });

    }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));



     

}

 