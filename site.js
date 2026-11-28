(() => {
  for (const offer of document.querySelectorAll('[data-until]')) {
    if (Date.now() >= Date.parse(offer.dataset.until)) offer.remove();
  }
  for (const anchor of document.querySelectorAll('[data-link]')) {
    const [category, item] = anchor.dataset.link.split('.');
    anchor.href = item ? LINKS[category][item] : LINKS[category];
  }


  const fragment = document.getElementById(location.hash.slice(1));
  if (fragment instanceof HTMLDetailsElement) {
    fragment.open = true;
    fragment.scrollIntoView({block:'start'});
  }
})();

const bookingTabs = document.querySelector('.booking-tabs');
if (bookingTabs) {
  const tabs = Array.from(bookingTabs.querySelectorAll('button'));
  function selectBookingTab(active) {
    history.replaceState({ ...history.state, bookingTab: active.id }, '');
    for (const tab of tabs) {
      const selected = tab === active;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
    }
  }
  bookingTabs.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    tab.addEventListener('click', () => selectBookingTab(tab));
    tab.addEventListener('keydown', event => {
      const next = {ArrowRight: (index+1)%tabs.length, ArrowLeft: (index+tabs.length-1)%tabs.length, Home: 0, End: tabs.length-1}[event.key];
      if (next === undefined) return;
      event.preventDefault();
      selectBookingTab(tabs[next]);
      tabs[next].focus();
    });
  });
  selectBookingTab(tabs.find(tab => tab.id === history.state?.bookingTab) || tabs[0]);
  bookingTabs.hidden = false;
}

