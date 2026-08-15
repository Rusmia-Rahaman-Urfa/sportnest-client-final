import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axios";
import FacilityCard from "../../components/Cards/FacilityCard";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

const TYPES = [
  "All","Football Turf","Cricket Net","Cricket Ground","Badminton Court",
  "Tennis Court","Swimming Lane","Basketball Court","Volleyball Court",
  "Table Tennis","Futsal Court",
];

const AllFacilitiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search,    setSearch]    = useState(searchParams.get("search") || "");
  const [type,      setType]      = useState(searchParams.get("type")   || "All");
  const [page,      setPage]      = useState(1);
  const [debSearch, setDebSearch] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => setDebSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
    const p = {};
    if (debSearch)      p.search = debSearch;
    if (type !== "All") p.type   = type;
    setSearchParams(p);
  }, [debSearch, type]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["facilities", debSearch, type, page],
    queryFn:  () => api.get("/facilities", {
      params: { search: debSearch||undefined, type: type!=="All"?type:undefined, page, limit:9 },
    }).then(r => r.data),
    keepPreviousData: true,
  });

  const clear = () => { setSearch(""); setType("All"); };

  return (
    <div className="page-shell">
      {/* Page Header */}
      <div className="page-hero">
        <div className="container">
          <motion.h1 className="page-hero-title" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            All Sports Facilities
          </motion.h1>
          <motion.p className="page-hero-sub" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.1}}>
            Find and book your preferred sports facility
          </motion.p>
        </div>
      </div>

      <div className="container page-body">
        {/* Search + Filter */}
        <div className="filter-row">
          <div className="search-field">
            <Search size={15} className="search-field-ico"/>
            <input className="search-field-inp" placeholder="Search by name or location…"
              value={search} onChange={e => setSearch(e.target.value)}/>
            {search && <button className="search-field-clear" onClick={()=>setSearch("")}><X size={13}/></button>}
          </div>
          <div className="filter-type-wrap">
            <SlidersHorizontal size={15} className="filter-ico"/>
            <select className="filter-select" value={type} onChange={e => setType(e.target.value)}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {(search || type !== "All") && (
            <button className="btn-clear-filter" onClick={clear}><X size={13}/>Clear</button>
          )}
        </div>

        <div className="results-info">
          {data && <p>{data.total} {data.total === 1 ? "facility" : "facilities"} found</p>}
        </div>

        {isLoading ? <LoadingSpinner full={false}/> : !data?.facilities?.length ? (
          <div className="empty-state">
            <div className="empty-icon">🏟️</div>
            <h3>No facilities found</h3>
            <p>Try adjusting your search or filter.</p>
            <button className="btn-outline-green" onClick={clear}>Clear Filters</button>
          </div>
        ) : (
          <>
            <div className={`facilities-grid${isFetching?" fading":""}`}>
              {data.facilities.map((f,i) => (
                <motion.div key={f._id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.05}}>
                  <FacilityCard facility={f}/>
                </motion.div>
              ))}
            </div>

            {data.totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>← Previous</button>
                {Array.from({length:data.totalPages},(_,i)=>i+1).map(p=>(
                  <button key={p} className={`page-btn${p===page?" active":""}`} onClick={()=>setPage(p)}>{p}</button>
                ))}
                <button className="page-btn" disabled={page===data.totalPages} onClick={()=>setPage(p=>p+1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default AllFacilitiesPage;
