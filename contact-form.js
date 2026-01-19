// contact-form.js
// Compose a mailto: link from the form and open the user's default mail client

(function(){
  const form = document.getElementById('emailForm');
  if (!form) return;

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const to = 'msmith7297@gmail.com'; // default recipient (developers)
    const name = encodeURIComponent(document.getElementById('name').value.trim());
    const email = encodeURIComponent(document.getElementById('email').value.trim());
    const subject = encodeURIComponent(document.getElementById('subject').value.trim());
    const message = encodeURIComponent(document.getElementById('message').value.trim());

    const mailto = `mailto:${to}?subject=${subject}&body=${message}%0A%0AFrom: ${name} <${email}>`;
    window.location.href = mailto; // open default mail client
  });
})();
