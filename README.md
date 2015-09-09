What is this?
=============

This Apigee API proxy should be used when you have an App that needs to interact with 
Google and Apigee.  You want to submit the request to authenticate the user but you 
don't want to store the Google credentials in the App.

You have the App call this proxy and which invokes the Google API with the Google credentials 
stored in the config.js file.  Google returns an access_token for this authenticated 
user to the App (along with other profile info).

Requirements
============

1. You will need to have an account with Google and register to use Google+ API for SSO 
with Google - https://console.developers.google
.com/project/app-sso-1020/apiui/apiview/plus/overview
1. You need an Apigee Edge account; get one for free - https://developers.apigee
.com/get-started
1. Get this - https://github.com/apigee/apigeetool-node
1. Copy the dummy_config.js file as config.js and enter your credentials.
1. Then, create a deployNodeApp.bash file that is similar to:

<pre>
<code>
#!/usr/bin/env bash
apigeetool deploynodeapp \
-n generic_google_login \
-d ./ \
-m server.js \
-o <<apigee_edge_org>> \
-e test \
-b /generic_google_login \
-u <<apigee_edge_admin_user@company.com>>
</code></pre>


Deployment of proxy
===================
You should be able to download this package, and...

<pre><code>
cd apiproxy/resources/node
npm install <<the files from package.json>> ./   #local node-modules dir
bash deployNodeApp.bash (should ask you for your password)
</code></pre>

And, you should be set!


Enhancements, bugs
=================
Use GitHub to track all of the above




