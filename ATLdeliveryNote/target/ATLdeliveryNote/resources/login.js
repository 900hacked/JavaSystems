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

// compute contextPath reliably
const contextPath = window.location.pathname.split('/')[1] ? '/' + window.location.pathname.split('/')[1] : '';

try {
  const res = await fetch(contextPath + '/j_spring_security_check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    credentials: 'same-origin',
    body: body.toString(),
    redirect: 'follow'
  });

  // if server redirected to our /products/front controller it may show in res.url,
  // but to be deterministic we redirect the browser client-side to the static page:
  if (res.ok) {
    window.location.href = contextPath + '/resources/productsGets.html';
    return;
  }

  // handle failed login
  const finalUrl = res.url || '';
  if (finalUrl.includes('error=true') || res.status === 401 || res.status === 403) {
    showmsg('Invalid username or password', true);
    return;
  }

  const text = await res.text().catch(() => '');
  showmsg('Login failed: ' + res.status + ' ' + text, true);

} catch (err) {
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