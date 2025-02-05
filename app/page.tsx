"use client";

import { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { listProducts } from "../graphql/queries";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("price");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response: any = await API.graphql(graphqlOperation(listProducts));
      setProducts(response.data.listProducts.items);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const filteredProducts = products
    .filter((product) =>
      product.product_title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === "price"
        ? parseFloat(a.price_eur.replace("€", "")) - parseFloat(b.price_eur.replace("€", ""))
        : b.bid_count - a.bid_count
    );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Catawiki Products</h1>

      <input
        type="text"
        placeholder="Search by title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2"
      />

      <button onClick={() => setSortBy("price")} className="ml-2 bg-blue-500 text-white p-2">
        Sort by Price
      </button>
      <button onClick={() => setSortBy("bids")} className="ml-2 bg-green-500 text-white p-2">
        Sort by Bids
      </button>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <li key={product.url} className="border p-2">
            <img src={product.image_url} alt={product.product_title} className="w-full h-40 object-cover" />
            <h2 className="font-bold mt-2">{product.product_title}</h2>
            <p>Price: {product.price_eur}</p>
            <p>Bids: {product.bid_count}</p>
            <p>End Time: {new Date(product.end_time).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
