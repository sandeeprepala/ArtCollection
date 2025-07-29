import { useState, useCallback } from 'react';
import { Artwork } from '../types/artwork';

export const useArtworkSelection = () => {
  const [selected, setSelected] = useState<Map<number, Artwork>>(new Map());

  const add = useCallback((artworks: Artwork[]) => {
    setSelected(prev => {
      const newMap = new Map(prev);
      artworks.forEach(artwork => {
        newMap.set(artwork.id, artwork);
      });
      return newMap;
    });
  }, []);

  const remove = useCallback((ids: number[]) => {
    setSelected(prev => {
      const newMap = new Map(prev);
      ids.forEach(id => {
        newMap.delete(id);
      });
      return newMap;
    });
  }, []);

  const selectCount = useCallback((artworks: Artwork[], count: number) => {
    const toSelect = artworks.slice(0, count);
    add(toSelect);
    return toSelect.length;
  }, [add]);

  const clear = useCallback(() => {
    setSelected(new Map());
  }, []);

  const isSelected = useCallback((id: number) => {
    return selected.has(id);
  }, [selected]);

  const getSelected = useCallback(() => {
    return Array.from(selected.values());
  }, [selected]);

  const getCount = useCallback(() => {
    return selected.size;
  }, [selected]);

  return {
    add,
    remove,
    selectCount,
    clear,
    isSelected,
    getSelected,
    getCount
  };
};