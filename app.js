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

  // Give each primary ten-card collection its own lightweight editorial image.
  // The source files are WebP and all remain below the project's 100 KB budget.
  const cardImages = {
    home: [1,2,3,8,12,17,9,16,10,21],
    about: [4,7,10,20,13,3,18,14,15,21],
    services: [5,2,9,15,6,12,13,11,8,19],
    blog: [17,3,7,12,15,2,14,8,11,16],
    contact: [6,11,13,7,18,19,2,12,10,20]
  };
  const primaryCards = document.querySelectorAll('section.page .subgrid .subcard');
  (cardImages[page] || []).forEach((imageNumber, index) => {
    const card = primaryCards[index];
    if (!card || card.querySelector('.card-media')) return;
    const image = document.createElement('img');
    image.className = 'card-media';
    image.src = `assets/images/editorial-${String(imageNumber).padStart(2, '0')}.webp`;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    card.prepend(image);
  });

  // Blog category controls filter the visible posts without reloading the page.
  if (page === 'blog') {
    const pills = document.querySelectorAll('.tagbar .pill');
    const posts = [...primaryCards];
    pills.forEach(pill => {
      pill.setAttribute('role', 'button');
      pill.setAttribute('tabindex', '0');
      pill.setAttribute('aria-pressed', pill.classList.contains('active') ? 'true' : 'false');
      const activate = () => {
        const selected = pill.textContent.trim().toLowerCase();
        pills.forEach(item => {
          const active = item === pill;
          item.classList.toggle('active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        posts.forEach(post => {
          const category = post.querySelector('.tag')?.textContent.trim().toLowerCase() || '';
          const singular = value => value.replace(/ies$/, 'y').replace(/s$/, '');
          post.hidden = selected !== 'all posts' && singular(category) !== singular(selected);
        });
      };
      pill.addEventListener('click', activate);
      pill.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
      });
    });
    document.getElementById('featured-article')?.addEventListener('click', () => {
      document.querySelector('.tagbar')?.scrollIntoView({behavior:'smooth', block:'center'});
    });
  }

  // Send unfinished controls to the site's friendly 404 page.
  document.querySelectorAll('a[href="#"], a[href=""]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      window.location.href = '404.html';
    });
  });

  document.querySelectorAll('button').forEach(button => {
    if (button.id === 'hamburger' || button.id === 'featured-article') return;
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
