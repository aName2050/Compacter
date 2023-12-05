var ENCRYPTED_accessToken = localStorage.getItem('accessToken');
var expires = localStorage.getItem('expires');

var btn = document.getElementById('dynamicNavbarBtn');
var noLoginLinks =
    '/feedback /about /about/commands /about/features /login/auth';

if (Date.now() >= expires) {
    // Do nothing for now
    // Will later use refresh token to refresh the access token
}

handle();

function handle() {
    if (ENCRYPTED_accessToken) {
        if (window.location.pathname == '/login') {
            console.log('redirecting...');
            return (window.location = '/dashboard');
        }

        if (window.location.pathname.includes('dashboard')) {
            btn.href = '/signout';
            btn.innerText = 'Sign Out';
            return;
        }

        btn.href = '/dashboard';
        btn.innerText = 'Dashboard';
    } else {
        return noLoginLinks.includes(window.location.pathname)
            ? null
            : (window.location = '/login');
    }
}
