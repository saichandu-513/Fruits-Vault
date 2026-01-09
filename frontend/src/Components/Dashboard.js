import React, { useMemo } from "react";
import FruitCard from "./FruitCard";
import "./Dashboard.css";
import Layout from "./Layout";
import { useCart } from "../cart/CartContext";
import { useSearch } from "../search/SearchContext";

const fruitsData = [
  { name: "Apple", price: 2, image: "/images/apple.jpg" },
  { name: "Banana", price: 1, image: "/images/banana.jpg" },
  { name: "Orange", price: 1.5, image: "/images/orange.jpg" },
  { name: "Mango", price: 3, image: "/images/mango.jpg" },
  { name: "Pineapple", price: 2.5, image: "/images/pineapple.jpg" },
  { name: "Grapes", price: 2.2, image: "/images/grapes.jpg" }
];

const Dashboard = () => {
  const { addItem } = useCart();
  const { term } = useSearch();

  const filtered = useMemo(() => {
    const t = (term || "").trim().toLowerCase();
    if (!t) return fruitsData;
    return fruitsData.filter((f) => String(f.name).toLowerCase().includes(t));
  }, [term]);

  return (
    <Layout size="xl">
      <div className="dashboard-home">
        <h1>Fresh Fruits</h1>
        {filtered.length === 0 ? (
          <p className="fb-muted">No fruits found. Try another name.</p>
        ) : null}
        <div className="fruits-grid">
          {filtered.map((fruit, index) => (
            <FruitCard key={index} fruit={fruit} addToCart={addItem} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
