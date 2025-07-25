import React from "react";
import { usePreConfirmationContext } from "../hooks/usePreConfirmationContext";
import { Input } from "../../../components/ui/Input";
import { useDebounceCallback } from "usehooks-ts";

export const UserInfo = (): React.ReactElement => {
  const { name, updateContactData } = usePreConfirmationContext();
  const onChange = (newName: string): void => {
    updateContactData("name", newName);
  };

  const onChangeDebounced = useDebounceCallback(onChange);

  return (
    <>
      <label>Nombre</label>
      <Input
        defaultValue={name}
        onChange={(ev) => onChangeDebounced(ev.target.value)}
      />
    </>
  );
};
