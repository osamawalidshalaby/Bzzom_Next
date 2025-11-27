

// app/menu/components/MenuGrid.js
import MenuCard from "../../_components/MenuCard";

const MenuGrid = ({ items, onAddToCart, onItemClick }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
      {items.map((dish) => (
        <MenuCard
          key={dish.id}
          dish={dish}
          onAddToCart={onAddToCart}
          onItemClick={onItemClick}
        />
      ))}
    </div>
  );
};

export default MenuGrid;