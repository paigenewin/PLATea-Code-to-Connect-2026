import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

type BloomingFilterContextValue = {
  bloomingOnly: boolean;
  setBloomingOnly: (value: boolean) => void;
};

const BloomingFilterContext =
  createContext<BloomingFilterContextValue | null>(null);

/*
 * Shares whether the "Blooming now" filter is
 * active between the Explore and Map tabs, so
 * pressing it on Explore also filters the Map.
 */
export function BloomingFilterProvider({
  children,
}: PropsWithChildren) {
  const [bloomingOnly, setBloomingOnly] =
    useState(false);

  return (
    <BloomingFilterContext.Provider
      value={{ bloomingOnly, setBloomingOnly }}
    >
      {children}
    </BloomingFilterContext.Provider>
  );
}

export function useBloomingFilter() {
  const context = useContext(BloomingFilterContext);

  if (!context) {
    throw new Error(
      'useBloomingFilter must be used within a BloomingFilterProvider'
    );
  }

  return context;
}
