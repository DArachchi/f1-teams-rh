const AUTH0_CLIENT_ID = '8FwgtM329iVhTfu9gZ91jrs1d1vOHQQR';
const AUTH0_DOMAIN = 'f1-sso.auth0.com';

if (!AUTH0_CLIENT_ID || !AUTH0_DOMAIN) {
    alert('Make sure to set the AUTH0_CLIENT_ID and AUTH0_DOMAIN variables in auth0-variables.js.');
}

const auth0js = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
    scope: 'openid profile',
    responseType: 'token',
    redirectUri: 'http://localhost:8080'
});