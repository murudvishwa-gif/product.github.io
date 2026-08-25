(function(){
  const pages = ['home','about','services','blog','contact'];
  const colors = {home:'--home-a', about:'--about-a', services:'--services-a', blog:'--blog-a', contact:'--contact-a'};
  const page = document.body.dataset.page || 'home';
  const activeIndex = Math.max(0, pages.indexOf(page));
  const root = document.documentElement;
  const header = document.getElementById('site-header');
  const nav = document.getElementById('primary-nav');
  const hamburger = document.getElementById('hamburger');
  const scrim = document.getElementById('scrim');
  const navLinks = document.querySelectorAll('nav.primary a[data-nav]');

  root.style.setProperty('--accent', getComputedStyle(root).getPropertyValue(colors[page]).trim());
  navLinks.forEach(link => link.classList.toggle('active', link.dataset.nav === page));

  function closeMenu(){
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    scrim.classList.remove('open');
  }
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    scrim.classList.toggle('open', open);
  });
  scrim.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  function updateProgress(){
    header.classList.toggle('condensed', window.scrollY > 40);
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / max));
  }
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('in-view'); });
  }, {threshold:0.12});
  document.querySelectorAll('.subcard, .content-section, .image-story-card').forEach(card => observer.observe(card));

  // Send unfinished controls to the site's friendly 404 page.
  document.querySelectorAll('a[href="#"], a[href=""]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      window.location.href = '404.html';
    });
  });

  document.querySelectorAll('button').forEach(button => {
    if (button.id === 'hamburger') return;
    const form = button.closest('form');
    if (form) {
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (form.checkValidity()) window.location.href = '404.html';
        else form.reportValidity();
      }, { once: true });
      return;
    }
    button.addEventListener('click', () => { window.location.href = '404.html'; });
  });
})();
