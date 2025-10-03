document.addEventListener('DOMContentLoaded', () => {
const form = document.getElementById('loginForm');
const msg = document.getElementById('loginMessage');

if (!form) return;

form.addEventListener('submit', async (e) => {
e.preventDefault();

const username = (form.querySelector('[name="username"]') || {}).value || '';
const password = (form.querySelector('[name="password"]') || {}).value || '';

if (!username || !password){
showmsg('Please enter username and password', true);
return;
}

const body = new URLSearchParams();
body.append('username', username);
body.append('password', password);

const contextPath = window.location.pathname.split('/')[1] ? '/' + window.location.pathname.split('/')[1] : '';
const url = contextPath + '/j_spring_security_check';


try{
const res = await fetch(url, {
method: 'POST',
headers: {
'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
},
credentials: 'same-origin',
body: body.toString(),
redirect: 'follow'
});

const finalUrl = res.url || '';

if (finalUrl.includes('/products')){
window.location.href = '/products/gets';
return;
}

if (finalUrl.includes('/login') && finalUrl.includes('error')){
showmsg('Invalid username or password', true);
return;
}

if (!res.ok){
const text = await res.text().catch(() => '');
showmsg('Login failed: ' + res.status + ' ' + text, true);
return;
}

window.location.href = contextPath + '/products/gets';
} catch(err){
console.error('login error', err);
showmsg('Network error while logging in', true);
}

});

function showmsg(text, isError =false){
msg.textContent = text;
msg.className = isError ? 'error' : 'info';
if(!isError) setTimeout(()=>msg.textContent='', 4000);
}
});