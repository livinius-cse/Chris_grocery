# Chris_grocery

Basketwise is a grocery basket comparison prototype. It compares stores in India and the United States in their local currencies.

Serve the checkout with `python3 -m http.server 8000` and open http://localhost:8000. Choose a market, enter grocery names separated by commas or line breaks, then compare stores. The sample list demonstrates quantities and missing products.

The catalog contains illustrative prices, ratings, pack sizes, availability and delivery fees. Complete baskets rank ahead of partial baskets, with the delivered total determining the order among equally complete offers and sample ratings breaking ties. Product details show per-pack prices and ratings. Live comparisons require retailer data and local delivery coverage.
