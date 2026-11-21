// Demonstration catalog. Each offer is [price in minor units, rating out of 5].
// Equal pack specifications are used across stores in each market.
const catalog = {
  IN: [
    ['BigBasket', 3000, [[5800,4.4],[7800,4.5],[6800,4.3],[5600,4.3],[6800,4.5],[4300,4.2],[4200,4.1],[4700,4.2]]],
    ['Amazon Fresh', 4000, [[6200,4.5],[7400,4.3],[7200,4.4],[5900,4.1],[6200,4.4],[4400,4.3],[3900,4.1],[4500,4.2]]],
    ['Blinkit', 2500, [[6100,4.3],[8000,4.2],[7000,4.2],[5400,4.4],[6900,4.2],null,[4500,4.2],[4900,4.3]]]
  ],
  US: [
    ['Walmart', 695, [[310,4.4],[295,4.5],[225,4.4],[159,4.3],[220,4.3],[190,4.2],[249,4.3],[169,4.1]]],
    ['Amazon Fresh', 995, [[355,4.4],[349,4.5],[210,4.3],[179,4.4],[249,4.5],[210,4.3],[229,4.2],[179,4.2]]],
    ['Target', 999, [[320,4.4],[339,4.4],[239,4.2],[169,4.3],[199,4.3],null,[269,4.3],[169,4.2]]]
  ]
};

const products = [
  ['Milk', '1 L', '½ gal'], ['Eggs', '6 eggs', '12 eggs'],
  ['Rice', '1 kg', '2 lb'], ['Bananas', '1 kg', '2 lb'],
  ['Bread', '400 g', '20 oz'], ['Tomatoes', '500 g', '1 lb'],
  ['Potatoes', '1 kg', '3 lb'], ['Onions', '1 kg', '2 lb']
];

export function parseList(input) {
  const items = new Map();
  for (const entry of input.split(/[\n,]/).map(value => value.trim()).filter(Boolean)) {
    const match = entry.match(/^(\d+)\s*[x×]\s*(.+)$/i);
    const quantity = match ? Number(match[1]) : 1;
    const name = (match ? match[2] : entry).trim().replace(/\s+/g, ' ').toLowerCase();
    const aliases = new Map([['egg','eggs'], ['banana','bananas'], ['tomato','tomatoes'], ['potato','potatoes'], ['onion','onions']]);
    const key = aliases.get(name) ?? name;
    const total = (items.get(key) ?? 0) + quantity;
    if (!name || !Number.isSafeInteger(quantity) || quantity < 1 || total > 99) {
      throw new Error('Enter a quantity from 1 to 99 packs for each grocery.');
    }
    items.set(key, total);
  }
  if (!items.size) throw new Error('Enter at least one grocery to compare.');
  return items;
}

export function compare(market, items) {
  return catalog[market].map(([store, delivery, inventory]) => {
    let subtotal = 0;
    let missing = 0;
    let ratingTotal = 0;
    const lines = Array.from(items, ([name, quantity]) => {
      const index = products.findIndex(product => product[0].toLowerCase() === name);
      const offer = inventory[index];
      if (!offer) {
        missing++;
        return {name, quantity};
      }
      const [price, rating] = offer;
      subtotal += price * quantity;
      ratingTotal += rating;
      return {name: products[index][0], size: products[index][market === 'IN' ? 1 : 2], quantity, price, rating};
    });
    const matched = lines.length - missing;
    return {store, delivery, lines, matched, total: subtotal + delivery, rating: matched ? ratingTotal / matched : 0};
  }).sort((a, b) => b.matched - a.matched || a.total - b.total || b.rating - a.rating);
}
