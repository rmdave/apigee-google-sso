/**
 * Used this example https://developers.google.com/drive/web/quickstart/nodejs?hl=en
 *
 */
var express = require('express');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var loginAppConfig = require('./config.js');

var SCOPES = ['https://www.googleapis.com/auth/userinfo.profile'];
var MYDOMAIN_LOCAL = 'http://local.naksho.net';
var MYDOMAIN_CLOUD = "http://demo23-test.apigee.net/generic_google_login";
var MYDOMAIN = MYDOMAIN_CLOUD;

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 */
function authorize(redirectUrl) {

    //TODO:: Map the App API KEY from Edge to a Vault store that has the App's
    // Google ID, Secret, and Redirect URL
    var clientSecret = loginAppConfig.googleClientSecret;
    var clientId = loginAppConfig.googleClientId;
    var auth = new googleAuth();
    return ( new auth.OAuth2(clientId, clientSecret, redirectUrl));
}

/**
 * getNewToken()
 * @returns {string}
 */
function getNewAuthZ(oauth2Client) {

    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'online',
        scope: SCOPES
    });
    console.log('Redirect to=' + authUrl);
    return (authUrl);
}

/**
 * getToken - so use the authZCode and get an access_token for this user
 * @param authzCode
 * @param res
 * @param oauth2Client
 */
function getToken(authzCode, res, oauth2Client) {
    oauth2Client.getToken(authzCode, function (err, token) {
        if ( err ) {
            console.log('Error while trying to retrieve access token', err);
            res.status(500).send('Error retrieving token');

            return;
        }
        console.log("access_token is = " + JSON.stringify(token.access_token));

        // TODO:: map to Origin header to host making the request
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-type", "application/json");
        res.send(JSON.stringify(token.access_token));
    });
}

/**
 * getProfile - get the user's profile and rock!
 * @param req
 * @param res
 */
function getProfile(req, res) {

    // Google does not need a callback in order to return user profile to us; use null
    var oauth2Client = authorize('null');
    var plus = google.plus('v1');
    oauth2Client.credentials = { access_token: req.query.access_token };


    plus.people.get({ userId: 'me', auth: oauth2Client }, function (err, response) {
        // handle err and response
        if ( err ) {
            console.log("Could not get user's profile using access_token = "
                        + req.query.access_token
                        + "Error is ="
                        + (err));
            res.status(500).send('Error getting profile');

            return;
        }
        console.log('User profile = ' + JSON.stringify(response));

        // TODO:: map to Origin header if local.naksho.net or demo23-test.apigee.net
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-type", "application/json");
        res.send(JSON.stringify(response));
    });

}

//////////////////////////////////////////////////
var app = express();

//////////////////////////////////////////
app.get('/login', function (req, res) {

    if ( req.query.cb_url === undefined ) {
        console.log('ERROR! Request to login user does not have a callback.');
        res.status(500).send('Please provide a callback URL as a query parameter with your request (cb_url)');
        return;
    }

    var oauth2Client = authorize(req.query.cb_url);

    var redirectUri = getNewAuthZ(oauth2Client);
    console.log("Redirect to " + redirectUri);

    res.writeHead(302,
        { Location: redirectUri + "&cb_url=" + req.query.cb_url }
    );
    res.end();
});

//////////////////////////////////////////
app.get('/code', function (req, res) {
    if ( !req.query.cb_url ) {
        console.log('ERROR! Request to get access_toekn does not have callback URL');
        res.status(500).send('Please provide a callback URL as a query parameter with your request (cb_url)');
        return;
    }

    if ( !req.query.code ) {
        console.log('ERROR! Request to get access_token does not have authorization_code');
        res.status(500).send('Please provide a authorization code as a query parameter with your request (code)');
        return;
    }

    var oauth2Client = authorize(req.query.cb_url);

    getToken(req.query.code, res, oauth2Client);
});

//////////////////////////////////////////
app.get('/profile', function (req, res) {
    getProfile(req, res);
});

app.listen(3000);

