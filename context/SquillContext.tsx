import React, { createContext, useContext, useState } from "react";
import { ImageSourcePropType } from "react-native";

interface SquillContextType {
  squillImage: ImageSourcePropType;
  setSquillImage: (img: ImageSourcePropType) => void;
}

const SquillContext = createContext<SquillContextType | undefined>(undefined);

export const SquillProvider = ({ children }: { children: React.ReactNode }) => {
  const [squillImage, setSquillImage] = useState<ImageSourcePropType>(
    require("@/assets/acessorios/base.png")
);


  return (
    <SquillContext.Provider value={{ squillImage, setSquillImage }}>
      {children}
    </SquillContext.Provider>
  );
};

export const useSquill = () => {
  const context = useContext(SquillContext);
  if (!context) throw new Error("useSquill must be used inside SquillProvider");
  return context;
};
