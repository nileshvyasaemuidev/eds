export default function decorate(block) {
  const items = [];

  [...block.children].forEach((row, index) => {
    const [question, answer] = row.children;

    const item = document.createElement('div');
    item.className = 'accordion-item';

    const button = document.createElement('button');
    button.className = 'accordion-title';
    button.innerHTML = question.innerHTML;

    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `accordion-panel-${index}`);

    const content = document.createElement('div');
    content.className = 'accordion-content';
    content.id = `accordion-panel-${index}`;

    const contentInner = document.createElement('div');
    contentInner.className = 'accordion-content-inner';
    contentInner.innerHTML = answer.innerHTML;

    content.append(contentInner);

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all items first
      items.forEach((accordionItem) => {
        accordionItem.classList.remove('open');

        const btn = accordionItem.querySelector('.accordion-title');
        const panel = accordionItem.querySelector('.accordion-content');

        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      });

      // Open clicked item if it wasn't already open
      if (!isOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');

        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });

    item.append(button, content);
    row.replaceWith(item);

    items.push(item);
  });
}
