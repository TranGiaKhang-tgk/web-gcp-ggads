import { createContext, useState } from "react";

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);

  // thêm sản phẩm vào compare
  const addToCompare = (product) => {
    if (compareItems.length >= 3) return;

    if (!compareItems.find((item) => item.id === product.id)) {
      setCompareItems([...compareItems, product]);
    }
  };

  // xoá sản phẩm
  const removeFromCompare = (id) => {
    setCompareItems(compareItems.filter((item) => item.id !== id));
  };

  return (
    <CompareContext.Provider
      value={{ compareItems, addToCompare, removeFromCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
};