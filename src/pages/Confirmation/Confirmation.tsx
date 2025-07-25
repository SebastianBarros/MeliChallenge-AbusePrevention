import { Button } from "../../components/ui/button";
import React from "react";

export const Confirmation = (): React.ReactElement => {
  return (
    <div className="flex justify-center mt-6">
      <div className="flex flex-col max-w-[400px] min-w-[300px] justify-center">
        <div className="text-center font-semibold text-lg">
          <p>¡Confirma tu compra!</p>
        </div>
        <div className="mt-4">
          <Button className="w-full">¡Lo quiero!</Button>
        </div>
      </div>
    </div>
  );
};
