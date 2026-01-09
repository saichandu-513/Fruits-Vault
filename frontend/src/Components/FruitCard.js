import React, { useMemo, useState } from "react";
import "./FruitCard.css";
import { useWishlist } from "../wishlist/WishlistContext";

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const FruitCard = ({ fruit, addToCart }) => {
  const { toggle, isWishlisted } = useWishlist();
  const [wishPop, setWishPop] = useState(false);

  const fruitId = useMemo(() => {
    if (typeof fruit?.id === "string" && fruit.id.trim()) return fruit.id.trim();
    return slugify(fruit?.name);
  }, [fruit?.id, fruit?.name]);

  const wishlisted = isWishlisted(fruitId);

  return (
    <div className="fruit-card">
      <div className="fruit-card__media">
        <img src={fruit.image} alt={fruit.name} />
        <button
          type="button"
          className={
            "fruit-card__wish" +
            (wishlisted ? " fruit-card__wish--active" : "") +
            (wishPop ? " fruit-card__wish--pop" : "")
          }
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle({ ...fruit, id: fruitId });
            setWishPop(true);
            window.setTimeout(() => setWishPop(false), 220);
          }}
          aria-label={wishlisted ? `Remove ${fruit.name} from wishlist` : `Add ${fruit.name} to wishlist`}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>

      <div className="fruit-card__meta">
        <h3 className="fruit-card__name">{fruit.name}</h3>
        <p className="fruit-card__price">${Number(fruit.price || 0).toFixed(2)}</p>
      </div>

      <div className="fruit-card__actions">
        <button type="button" onClick={() => addToCart(fruit)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FruitCard;
