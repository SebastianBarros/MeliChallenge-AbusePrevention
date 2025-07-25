import { Button } from "../../..//components/ui/button";
import React from "react";
import { usePreConfirmationContext } from "../hooks/usePreConfirmationContext";

type Props = {
  onSubmit: () => void;
};

export const CTAs = (props: Props): React.ReactElement => {
  const { onSubmit } = props;
  const { isValidForm, loading } = usePreConfirmationContext();
  return (
    <div className="flex justify-between">
      <Button variant="outline">Volver</Button>
      <Button disabled={!isValidForm || loading} onClick={onSubmit}>
        Continuar
      </Button>
    </div>
  );
};
