(function () {
  let session = {};
  try { session = JSON.parse(localStorage.getItem('stacklySession')) || {}; } catch (_) {}
  const role = document.body.dataset.role || 'user';
  const name = session.name || (role === 'admin' ? 'Admin' : 'User');
  const main = document.querySelector('.dash-main');
  const overview = main.innerHTML;

  const userViews = {
    'My tasks': ['My tasks', 'Organize everything you need to finish.', ['8 today','5 complete','3 upcoming','2 overdue'], [['Review project roadmap','Website launch','High','Today, 09:00'],['Draft product brief','Q3 planning','High','Today, 14:00'],['Prepare research notes','Product design','Medium','Tomorrow'],['Send weekly update','Operations','Low','Friday']]],
    'Calendar': ['Calendar', 'Your meetings and focus blocks in one schedule.', ['3 meetings','3.5h focus','1 deadline','2 free blocks'], [['Product critique','Design team','Meeting','10:30 – 11:15'],['Lunch with Maya','Personal','Event','13:00 – 14:00'],['Product brief','Q3 planning','Focus','14:00 – 16:00'],['Weekly review','Personal','Review','16:00 – 16:30']]],
    'Goals': ['Goals', 'Connect daily progress to meaningful outcomes.', ['4 active','68% progress','12 milestones','2 on track'], [['Launch new website','Company','68% complete','Due Sep 18'],['Improve focus routine','Personal','82% complete','Due Aug 31'],['Finish Q3 research','Product','45% complete','Due Sep 05'],['Build design library','Design','30% complete','Due Oct 12']]],
    'Projects': ['Projects', 'See momentum, ownership, and next milestones.', ['6 active','18 tasks','3 teammates','1 at risk'], [['Website launch','Marketing','On track','18 tasks'],['Product design','Design','In progress','12 tasks'],['Q3 planning','Operations','Review','8 tasks'],['Customer research','Research','At risk','5 tasks']]],
    'Notes': ['Notes', 'Keep decisions and ideas connected to the work.', ['24 notes','6 shared','4 this week','3 pinned'], [['Weekly planning notes','Personal','Updated today','Pinned'],['Product critique','Product design','Yesterday','Shared'],['Customer interview themes','Research','Aug 21','Shared'],['Ideas for Q4','Planning','Aug 18','Private']]],
    'Team': ['Team', 'Collaborate without losing sight of your own day.', ['8 members','5 online','3 projects','2 guests'], [['Maya Chen','Product design','Online','3 tasks'],['Jon Bell','Engineering','In focus','5 tasks'],['Elena Ortiz','Research','Online','2 tasks'],['Noah Kim','Marketing','Away','4 tasks']]],
    'Settings': ['Settings', 'Manage your personal workspace preferences.', ['Personal plan','English','UTC +05:30','Sync active'], [['Profile and account','Name, email, and password','Configured','Manage'],['Notifications','Email and browser alerts','Daily digest','Manage'],['Calendar sync','Google Calendar','Connected','Manage'],['Privacy','Visibility and data controls','Private','Manage']]],
    'Profile': ['My profile', 'View and manage your personal account information.', ['Personal user','Active account','6 day streak','Private profile'], [['Display name',name,'Personal account','Active'],['Email address',session.email || 'you@company.com','Verified','Active'],['Workspace','My Workspace','Personal plan','Active'],['Last sign in','Today','This device','Secure']]]
  };
  const adminViews = {
    'Users': ['Users', 'Manage people, access, and account status.', ['1,248 total','892 active','36 invited','14 suspended'], [['Maya Chen','maya@halo.design','Admin','Active'],['Jon Bell','jon@northstar.io','Member','Active'],['Elena Ortiz','elena@cg.org','Owner','Active'],['Noah Kim','noah@atlas.co','Member','Invited']]],
    'Workspaces': ['Workspaces', 'Monitor organizations across the platform.', ['74 total','68 active','4 trials','2 paused'], [['Northstar Labs','Jon Bell','128 members','Active'],['Halo Studio','Maya Chen','42 members','Active'],['Atlas Digital','Noah Kim','18 members','Trial'],['Common Ground','Elena Ortiz','76 members','Paused']]],
    'Subscriptions': ['Subscriptions', 'Track plans, renewals, and recurring revenue.', ['$84.2k MRR','68 paid','4 trials','2 overdue'], [['Northstar Labs','Enterprise','$2,400/mo','Renews Sep 01'],['Halo Studio','Team','$480/mo','Renews Sep 08'],['Atlas Digital','Trial','$0','Ends Aug 29'],['Common Ground','Team','$760/mo','Payment due']]],
    'Analytics': ['Analytics', 'Understand adoption and platform engagement.', ['71.5% active','5,642 sessions','22m avg.','+18.4% growth'], [['Daily active users','892 users','+12.4%','Healthy'],['Task completion','68.2%','+5.1%','Improving'],['Workspace adoption','81.6%','+8.7%','Strong'],['Feature engagement','64.9%','-1.2%','Monitor']]],
    'Reports': ['Reports', 'Generate and review operational summaries.', ['18 reports','6 scheduled','4 shared','1 processing'], [['Weekly adoption report','Platform','Ready','Aug 24'],['Revenue summary','Finance','Ready','Aug 23'],['Security audit','Compliance','Processing','Aug 24'],['Workspace health','Customer success','Scheduled','Aug 28']]],
    'Activity logs': ['Activity logs', 'Review important actions across the system.', ['2,840 events','128 today','4 warnings','0 critical'], [['Plan upgraded','Halo Studio','Billing','12 min ago'],['Users invited','Northstar Labs','Access','38 min ago'],['Ticket opened','Atlas Digital','Support','1 hr ago'],['Report generated','System','Reports','3 hrs ago']]],
    'Support tickets': ['Support tickets', 'Resolve customer questions and incidents.', ['12 open','3 urgent','8 pending','96% SLA'], [['#4821 Calendar not syncing','Northstar Labs','Urgent','12 min ago'],['#4819 Invoice question','Halo Studio','Normal','42 min ago'],['#4816 Import assistance','Atlas Digital','Pending','2 hrs ago'],['#4812 Permission issue','Common Ground','High','4 hrs ago']]],
    'Settings': ['Settings', 'Configure platform-wide policies and services.', ['All systems live','SSO enabled','Daily backup','12 admins'], [['Authentication','SSO and login policies','Enabled','Manage'],['Data retention','Workspace data policies','365 days','Manage'],['Email delivery','Transactional email','Operational','Manage'],['API access','Keys and webhooks','18 active','Manage']]],
    'Profile': ['Administrator profile', 'Review your identity, permissions, and account security.', ['Administrator','Full access','MFA enabled','Active session'], [['Display name',name,'Administrator','Active'],['Email address',session.email || 'admin@stackly.app','Verified','Active'],['Permission level','Platform administrator','Full access','Enabled'],['Last sign in','Today','This device','Secure']]]
  };

  function applyIdentity() {
    document.querySelectorAll('[data-user-name]').forEach(el => { el.textContent = name; });
    document.querySelectorAll('[data-user-initial]').forEach(el => { el.textContent = name.charAt(0).toUpperCase(); });
  }

  function renderView(label) {
    if (label === 'Overview') {
      main.innerHTML = overview;
      applyIdentity();
      bindContentActions();
      return;
    }
    const data = (role === 'admin' ? adminViews : userViews)[label];
    if (!data) return;
    const cards = data[2].map((value, i) => `<article class="dash-card"><div class="metric-icon ${['purple','green','blue','amber'][i]}">${['◇','✓','↗','◷'][i]}</div><div><span>${['Overview','Current','Progress','Status'][i]}</span><strong>${value}</strong><small class="trend">Live workspace data</small></div></article>`).join('');
    const rows = data[3].map(row => `<div class="task-table-row">${row.map((cell, i) => `<span>${i === 3 ? `<i class="status ${/active|ready|strong|healthy|enabled|connected/i.test(cell) ? 'success' : /urgent|risk|due|critical/i.test(cell) ? 'danger' : /trial|pending|processing|monitor/i.test(cell) ? 'warning' : 'neutral'}">${cell}</i>` : cell}</span>`).join('')}</div>`).join('');
    main.innerHTML = `<div class="dash-breadcrumb">${role === 'admin' ? 'Admin' : 'Dashboard'} <span>/</span> ${label}</div><header class="dash-head"><div><h1>${data[0]}</h1><p>${data[1]}</p></div><div class="dash-head-actions"><button class="btn btn-ghost" data-view-action>Export</button><button class="btn btn-solid" data-view-action>+ Add new</button></div></header><section class="dash-cards">${cards}</section><section class="dash-panel view-panel"><div class="panel-head"><div><h2>${label} overview</h2><p>Recently updated records</p></div><label class="table-filter">⌕ <input type="search" placeholder="Filter ${label.toLowerCase()}" data-table-filter></label></div><div class="task-table"><div class="task-table-head"><span>Name</span><span>Details</span><span>Progress</span><span>Status</span></div>${rows}</div></section>`;
    bindContentActions();
  }

  function selectView(label) {
    document.querySelectorAll('.dash-nav a').forEach(link => link.classList.toggle('active', linkLabel(link) === label));
    renderView(label);
    document.body.classList.remove('nav-open');
  }

  function linkLabel(link) {
    const copy = link.cloneNode(true);
    copy.querySelectorAll('b, em').forEach(el => el.remove());
    return copy.textContent.trim();
  }

  document.querySelectorAll('.dash-nav a').forEach(link => link.addEventListener('click', function (event) {
    event.preventDefault();
    selectView(linkLabel(link));
  }));

  function bindContentActions() {
    main.querySelectorAll('a[href="#"]').forEach(link => link.addEventListener('click', function (event) {
      event.preventDefault();
      const text = link.textContent.toLowerCase();
      if (text.includes('task')) selectView('My tasks');
      else if (text.includes('workspace')) selectView('Workspaces');
      else if (text.includes('detail')) selectView('Subscriptions');
      else if (text.includes('status')) selectView(role === 'admin' ? 'Activity logs' : 'Goals');
      else selectView(role === 'admin' ? 'Users' : 'My tasks');
    }));
    main.querySelectorAll('[data-view-action]').forEach(button => button.addEventListener('click', () => {
      button.textContent = button.textContent.includes('Export') ? 'Export ready ✓' : 'Added ✓';
    }));
    const filter = main.querySelector('[data-table-filter]');
    if (filter) filter.addEventListener('input', () => {
      main.querySelectorAll('.task-table-row').forEach(row => { row.hidden = !row.textContent.toLowerCase().includes(filter.value.toLowerCase()); });
    });
  }

  const menu = document.querySelector('.dash-menu');
  if (menu) menu.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  const sidebar = document.querySelector('.dash-sidebar');
  if (sidebar) {
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'dash-close';
    closeButton.setAttribute('aria-label', 'Close navigation');
    closeButton.textContent = '×';
    sidebar.prepend(closeButton);
    closeButton.addEventListener('click', () => document.body.classList.remove('nav-open'));
  }
  document.addEventListener('click', event => {
    if (document.body.classList.contains('nav-open') && window.innerWidth <= 820 && !event.target.closest('.dash-menu, .dash-sidebar')) {
      document.body.classList.remove('nav-open');
    }
  });
  const logo = document.querySelector('.dash-logo');
  if (logo) {
    logo.href = role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
  }
  const profile = document.querySelector('.profile-pill');
  if (profile) {
    profile.setAttribute('role', 'button');
    profile.setAttribute('tabindex', '0');
    profile.setAttribute('aria-label', 'Open profile');
    profile.addEventListener('click', () => renderView('Profile'));
    profile.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        renderView('Profile');
      }
    });
  }
  document.querySelectorAll('.dash-tools button').forEach(button => button.addEventListener('click', () => {
    if (button.getAttribute('aria-label') === 'Theme') document.body.classList.toggle('dash-dark');
    else selectView(role === 'admin' ? 'Activity logs' : 'Calendar');
  }));
  const logout = document.querySelector('[data-logout]');
  if (logout) logout.addEventListener('click', () => { localStorage.removeItem('stacklySession'); window.location.href = 'login.html'; });
  bindContentActions();
  applyIdentity();
})();
