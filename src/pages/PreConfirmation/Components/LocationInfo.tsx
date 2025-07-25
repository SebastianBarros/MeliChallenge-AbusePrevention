import React from "react";
import { usePreConfirmationContext } from "../hooks/usePreConfirmationContext";
import { Input } from "../../../components/ui/Input";
import { useDebounceCallback } from "usehooks-ts";

export const LocationInfo = (): React.ReactElement => {
  const { address, country, updateContactData } = usePreConfirmationContext();
  const onAddressChange = (newAddress: string): void => {
    updateContactData("address", newAddress);
  };
  const onCountryChange = (newCountry: string): void => {
    updateContactData("country", newCountry);
  };

  const onAddressChangeDebounced = useDebounceCallback(onAddressChange);
  const onCountryChangeDebounced = useDebounceCallback(onCountryChange);

  return (
    <>
      <div className="mb-4">
        <label>Dirección</label>
        <Input
          defaultValue={address}
          onChange={(ev) => onAddressChangeDebounced(ev.target.value)}
        />
      </div>
      <div>
        <label>País</label>
        <Input
          defaultValue={country}
          onChange={(ev) => onCountryChangeDebounced(ev.target.value)}
        />
      </div>
    </>
  );
};
