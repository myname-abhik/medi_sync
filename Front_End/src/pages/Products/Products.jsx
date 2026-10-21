import React, { useEffect, useMemo, useState } from "react";
import Style from "../../css/products.module.css";
import Common from "../../css/common.module.css";
import Buttonstyle from "../../css/button.module.css";
import { FaSearch } from "react-icons/fa";
import ProductCard from "./ProductCard";
import { getProducts } from "../../services/catalog";
import { getPricing } from "../../utils/format";

const SORTS = {
  featured: { label: "Featured", fn: () => 0 },
  priceAsc: { label: "Price: low to high", fn: (a, b) => getPricing(a).price - getPricing(b).price },
  priceDesc: { label: "Price: high to low", fn: (a, b) => getPricing(b).price - getPricing(a).price },
  discount: { label: "Biggest discount", fn: (a, b) => getPricing(b).pct - getPricing(a).pct },
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    let alive = true;
    getProducts()
      .then((list) => alive && setProducts(list))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(() => ["All", ...new Set(products.map((p) => p.category).filter(Boolean))], [products]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => category === "All" || p.category === category)
      .filter(
        (p) =>
          !q ||
          [p.Product_Title, p.Product_description, p.category, p.Product_available?.store_name]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(q))
      )
      .sort(SORTS[sort].fn);
  }, [products, query, category, sort]);

  return (
    <>
      <div className={Style.background}>
        <div className={Style.overlay}></div>
        <div className={Style.searchContainer}>
          <div className={Style.searchText}>Search Your Products</div>
          <form className={Style.searchBar} onSubmit={(e) => e.preventDefault()} role="search">
            <button type="submit" aria-label="Search" className={`${Buttonstyle.button} ${Style.searchIcon}`}>
              <FaSearch className={Style.icon} />
            </button>
            <input type="text" placeholder="Search medicines, devices, stores..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </form>
        </div>
      </div>

      <div className={Style.toolbar}>
        <div className={Style.chips}>
          {categories.map((c) => (
            <button key={c} type="button" className={`${Style.chip} ${c === category ? Style.chipActive : ""}`} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
        <select className={Style.sort} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
          {Object.entries(SORTS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      {!loading && <p className={Style.resultCount}>{visible.length} {visible.length === 1 ? "product" : "products"}</p>}

      {loading && <div className={Common.empty}>Loading products...</div>}
      {!loading && visible.length === 0 && (
        <div className={Common.empty}>
          <h2>No products found</h2>
          <p>Try a different search or category.</p>
          <button type="button" className={Common.ghostBtn} onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button>
        </div>
      )}
      {visible.map((product) => (
        <ProductCard key={product._id} data={product} onStoreClick={setQuery} />
      ))}
    </>
  );
};

export default Products;
