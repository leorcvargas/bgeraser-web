"use client";
import { FC, ReactNode, createContext, useState } from "react";

export const LoadingContext = createContext({
  loading: false,
  setLoading: (_: boolean) => {},
});

export const LoadingProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
