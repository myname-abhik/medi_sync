import React, { useEffect, useMemo, useState } from "react";
import Style from "../../css/service.module.css";
import Common from "../../css/common.module.css";
import Buttonstyle from "../../css/button.module.css";
import { FaSearch } from "react-icons/fa";
import ServiceCard from "./ServiceCard";
import { getDoctors } from "../../services/catalog";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    let alive = true;
    getDoctors()
      .then((list) => alive && setServices(list))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services
      .filter((d) => !onlyAvailable || d.Doctor_available !== false)
      .filter((d) => !q || [d.doctor_name, d.doctor_profile, d.doctor_address].filter(Boolean).some((f) => f.toLowerCase().includes(q)));
  }, [services, query, onlyAvailable]);

  return (
    <>
      <div className={Style.background}>
        <div className={Style.overlay}></div>
        <div className={Style.searchContainer}>
          <div className={Style.searchText}>Search Your Doctors</div>
          <form className={Style.searchBar} onSubmit={(e) => e.preventDefault()} role="search">
            <button type="submit" aria-label="Search" className={`${Buttonstyle.button} ${Style.searchIcon}`}>
              <FaSearch className={Style.icon} />
            </button>
            <input type="text" placeholder="Search by name, specialty or city..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </form>
        </div>
      </div>

      <div className={Style.chipRow}>
        <button type="button" className={`${Style.chip} ${!onlyAvailable ? Style.chipActive : ""}`} onClick={() => setOnlyAvailable(false)}>All doctors</button>
        <button type="button" className={`${Style.chip} ${onlyAvailable ? Style.chipActive : ""}`} onClick={() => setOnlyAvailable(true)}>Available now</button>
      </div>

      <div className={Style.cardContainerWrapper}>
        {loading && <div className={Common.empty}>Loading doctors...</div>}
        {!loading && visible.length === 0 && (
          <div className={Common.empty}>
            <h2>No doctors found</h2>
            <p>Try a different name or specialty.</p>
          </div>
        )}
        <div className={Style.cardContainer}>
          {visible.map((service) => (
            <ServiceCard key={service._id} data={service} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Services;
