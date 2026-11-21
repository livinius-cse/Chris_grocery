import {compare, parseList} from './compare.mjs';

const form = document.querySelector('#basket');
const market = document.querySelector('#market');
const input = document.querySelector('#items');
const status = document.querySelector('#status');
const cards = document.querySelector('#cards');

function element(tag, content) {
  const node = document.createElement(tag);
  node.textContent = content;
  return node;
}

function render() {
  cards.replaceChildren();
  let items;
  try {
    items = parseList(input.value);
  } catch (error) {
    status.textContent = error.message;
    return;
  }

  const currency = new Intl.NumberFormat(market.value === 'IN' ? 'en-IN' : 'en-US', {
    style: 'currency', currency: market.value === 'IN' ? 'INR' : 'USD'
  });
  const money = minorUnits => currency.format(minorUnits / 100);
  const stores = compare(market.value, items);
  const complete = stores[0].matched === items.size;
  status.textContent = complete
    ? `${stores[0].store} has the lowest delivered total for the full list in this sample.`
    : 'No store matches the full list. Stores are ranked by items matched, then by delivered total.';

  for (const [index, result] of stores.entries()) {
    const card = element('article', '');
    if (complete && index === 0) card.className = 'best';
    const coverage = `${result.matched} of ${items.size} items matched`;
    const description = result.matched
      ? `${money(result.total)} · ${money(result.delivery)} delivery included · ${coverage}`
      : coverage;
    card.append(element('h3', result.store), element('p', description));

    const details = element('details', '');
    const lines = element('ul', '');
    for (const line of result.lines) {
      const info = line.price === undefined
        ? 'Unavailable in the sample catalog'
        : `${line.size} per pack · ${money(line.price)} per pack · ${line.rating.toFixed(1)}/5 sample rating`;
      lines.append(element('li', `${line.quantity} × ${line.name} · ${info}`));
    }
    details.append(element('summary', 'View products and ratings'), lines);
    card.append(details);
    cards.append(card);
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  render();
});
document.querySelector('#sample').addEventListener('click', () => {
  input.value = 'Milk\n2 x eggs\nRice\nBananas\nTomatoes';
  render();
});
for (const control of [market, input]) {
  control.addEventListener('input', () => {
    cards.replaceChildren();
    status.textContent = 'Select Compare stores to update the results.';
  });
}
