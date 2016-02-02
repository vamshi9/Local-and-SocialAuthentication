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
        successRedirect : '/', // redirect to the secure profile section
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
    app.get('/auth/facebook', passport.authenticate('facebook',{authType : 'rerequest', scope : ['email','user_friends', 'manage_pages','public_profile','publish_actions','user_about_me'],return_scopes: true}));

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
};

//checking whether they are logged in or not
	function isLoggedIn(req,res,next){
		//if they are then direct them to next
           if(req.isAuthenticated())
                return next();
           //else redirect them to home page
           res.redirect('/login');
	}