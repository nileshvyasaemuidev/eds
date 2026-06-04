export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [question, answer] = row.children;
    const item = document.createElement('div');
    item.className = 'accordion-item';
    const button = document.createElement('button');
    button.className = 'accordion-title';
    button.textContent = question.textContent;

    const content = document.createElement('div');
    content.className = 'accordion-content';
    content.innerHTML = answer.innerHTML;

    button.addEventListener('click', () => {
      item.classList.toggle('open');
    });

    item.append(button, content);
    row.replaceWith(item);
  });
}
