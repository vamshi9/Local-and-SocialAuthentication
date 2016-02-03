var user =  require('./models/users.js');

module.exports = function(app,passport){

    //get home page and send a message
	app.get('/',function(req,res){
		res.render('index.ejs');
	});

	//load login page
	app.get('/login',function(req,res){
		res.render('login.ejs',{message : req.flash('loginMessage')});
	});

 
	// process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


	//load signup page
	app.get('/signup',function(req,res){
		res.render('signup.ejs',{message : req.flash('signupMessage') });
	});

	//process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
        })); 
    

	//you have to login before you view this page i.e, we have to protect this page
	app.get('/profile',isLoggedIn,function(req,res){
		res.render('profile.ejs',{
			user : req.user //get user out of the session and direct to template
		});
	});

	// route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook',{scope : ['email','user_friends', 'manage_pages','public_profile','publish_actions','user_about_me'],return_scopes: true}));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect : '/'
        }),function(req,res){
        	res.redirect('/profile');
        });

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));



      
    //logging out user and redirecting to index.ejs
	app.get('/logout',function(req,res){
		req.logout();//this is provided by passport
		//after logout we have to redirect user to home page 
		res.redirect('/')
	});


    //Authorize( If already logged in)

    //local login
    app.get('/connect/local',function(req,res){
        res.render('connect-local.ejs',{message : req.flash('loginMessage')});
    });
    app.post('/connect/local',passport.authenticate('local-signup',{
        successRedirect : '/profile',
        failureRedirect : '/connect/local',
        failureFlash : true
    }));

    //facebook authorization
    app.get('/connect/facebook',passport.authorize('facebook',{scope : ['email']}));
    app.get('/connect/facebook/callback',passport.authorize('facebook',{
        successRedirect : '/profile',
        failureRedirect : '/',
    }));

    //google authorization
    app.get('/connect/google',passport.authorize('google',{scope : ['profile','email']}));
    app.get('/connect/google/callback',passport.authorize('google',{
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

    //unlink local account
    app.get('/unlink/local',function(req,res){
        var user = req.user;
        user.local.email = undefined;
        user.local.password = defined;
        user.save(function(err){
            res.redirect('/profile');
        });
    });

    //unlink facebook account
    app.get('/unlink/facebook',function(req,res){
        var user = req.user;
        user.facebook.token = undefined;
        user.save(function(err){
            res.redirect('/profile');
        });
    });

    //unlink google account
    app.get('unlink/google',function(req,res){
        var user = req.user;
        user.google.token = undefined;
        user.save(function(err){
            res.redirect('/profile');
        });
    });

};

//checking whether they are logged in or not
	function isLoggedIn(req,res,next){
		//if they are then direct them to next
           if(req.isAuthenticated())
                return next();
           //else redirect them to home page
           res.redirect('/login');
	}