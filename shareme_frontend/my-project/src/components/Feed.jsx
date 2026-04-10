import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const resultCache = new Map();
const inFlightCache = new Map();

const Feed = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();

  useEffect(() => {
    let cancelled = false;
    const cacheKey = categoryId ? `cat:${categoryId}` : 'feed:all';
    const query = categoryId ? searchQuery(categoryId) : feedQuery;

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
  }, [categoryId]);
  const ideaName = categoryId || 'new';
  if (loading) {
    return (
      <Spinner message={`We are adding ${ideaName} ideas to your feed!`} />
    );
  }
  return (
    <div>
      {pins && (
        <MasonryLayout pins={pins} />
      )}
    </div>
  );
};

export default Feed;