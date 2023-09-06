"use client";

import { FC, ReactNode, createContext, useState } from "react";

export const FileContext = createContext<{
  file?: File;
  setFile: (file?: File) => void;
}>({
  file: undefined,
  setFile: () => {},
});

export const FileProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [file, setFile] = useState<File>();

  return (
    <FileContext.Provider value={{ file, setFile }}>
      {children}
    </FileContext.Provider>
  );
};
