import React from "react";
import { PreConfirmationProvider } from "./Context/PreConfirmationProvider";

import { UserInfo } from "./Components/UserInfo";
import { LocationInfo } from "./Components/LocationInfo";
import { Captcha } from "../../components/Captcha";
import { CTAs } from "./Components/CTAs";
import { usePreConfirmationContext } from "./hooks/usePreConfirmationContext";

const PreConfirmation = (): React.ReactElement => {
  const { updateCaptcha, submitContactData } = usePreConfirmationContext();
  return (
    <>
      <div className="flex justify-center mt-6">
        <div className="flex flex-col max-w-[400px] min-w-[300px] justify-center">
          <div className="text-center font-semibold text-lg">
            <p>¡Ya casi es tuyo!</p>
            <p>Revisa y actualiza tu información de contacto</p>
          </div>
          <div className="mt-4">
            <UserInfo />
          </div>
          <div className="mt-4">
            <LocationInfo />
          </div>
          <div className="mt-4">
            <Captcha onChange={updateCaptcha} />
          </div>
          <div className="mt-4">
            <CTAs onSubmit={submitContactData}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default () => (
  <PreConfirmationProvider>
    <PreConfirmation />
  </PreConfirmationProvider>
);
