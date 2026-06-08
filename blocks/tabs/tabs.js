export default function decorate(block) {
  const rows = [...block.children];

  const tabsWrapper = document.createElement('div');
  tabsWrapper.className = 'tabs-wrapper';

  const tabList = document.createElement('div');
  tabList.className = 'tabs-nav';
  tabList.setAttribute('role', 'tablist');

  const panelsContainer = document.createElement('div');
  panelsContainer.className = 'tabs-panels';

  const tabs = [];
  const panels = [];

  const activateTab = (activeIndex) => {
    tabs.forEach((tab, index) => {
      const isActive = index === activeIndex;

      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive);
      tab.setAttribute('tabindex', isActive ? '0' : '-1');

      panels[index].classList.toggle('active', isActive);
      panels[index].hidden = !isActive;
    });
  };

  rows.forEach((row, index) => {
    const [titleCell, contentCell] = row.children;

    const tab = document.createElement('button');
    tab.className = 'tab-button';
    tab.type = 'button';

    const panelId = `tab-panel-${index}`;
    const tabId = `tab-${index}`;

    tab.id = tabId;
    tab.innerHTML = titleCell.innerHTML;

    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panelId);
    tab.setAttribute('aria-selected', index === 0);
    tab.setAttribute('tabindex', index === 0 ? '0' : '-1');

    const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.id = panelId;

    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);

    panel.innerHTML = contentCell.innerHTML;

    if (index !== 0) {
      panel.hidden = true;
    } else {
      tab.classList.add('active');
      panel.classList.add('active');
    }

    tab.addEventListener('click', () => {
      activateTab(index);
    });

    tab.addEventListener('keydown', (event) => {
      let newIndex = index;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          newIndex = (index + 1) % tabs.length;
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
          newIndex = (index - 1 + tabs.length) % tabs.length;
          break;

        case 'Home':
          newIndex = 0;
          break;

        case 'End':
          newIndex = tabs.length - 1;
          break;

        default:
          return;
      }

      event.preventDefault();
      activateTab(newIndex);
      tabs[newIndex].focus();
    });

    tabs.push(tab);
    panels.push(panel);

    tabList.append(tab);
    panelsContainer.append(panel);
  });

  tabsWrapper.append(tabList, panelsContainer);

  block.innerHTML = '';
  block.append(tabsWrapper);
}
