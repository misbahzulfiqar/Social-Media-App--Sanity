import React, { useEffect, useState } from 'react';

import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';

const resultCache = new Map();
const inFlightCache = new Map();

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const normalizedTerm = searchTerm.toLowerCase();
    const cacheKey = normalizedTerm ? `search:${normalizedTerm}` : 'search:feed';
    const query = normalizedTerm ? searchQuery(normalizedTerm) : feedQuery;

    const loadPins = async () => {
      if (resultCache.has(cacheKey)) {
        setPins(resultCache.get(cacheKey));
        return;
      }

      setLoading(true);
      try {
        let pending = inFlightCache.get(cacheKey);
        if (!pending) {
          pending = client.fetch(query);
          inFlightCache.set(cacheKey, pending);
        }
        const data = await pending;
        const safePins = Array.isArray(data) ? data : [];
        resultCache.set(cacheKey, safePins);
        if (!cancelled) setPins(safePins);
      } catch (error) {
        if (!cancelled) setPins([]);
      } finally {
        inFlightCache.delete(cacheKey);
        if (!cancelled) setLoading(false);
      }
    };

    loadPins();

    return () => {
      cancelled = true;
    };
  }, [searchTerm]);

  return (
    <div>

      {loading && <Spinner message="Searching pins" />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className="mt-10 text-center text-xl ">No Pins Found!</div>
      )}
    </div>
  );
};

export default Search;