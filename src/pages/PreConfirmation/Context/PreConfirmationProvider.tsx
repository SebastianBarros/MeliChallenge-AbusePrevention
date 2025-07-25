import React, { useMemo, useState } from "react";
import { PreConfirmationContext } from "./PreConfirmationContext";
import { useMutation } from "@tanstack/react-query";
import { preConfirmationSubmit } from "../../../services/preConfirmationSubmit";
import { useNavigate } from "react-router";

type Props = {
  children: React.ReactElement;
};

export const PreConfirmationProvider = (props: Props): React.ReactElement => {
  const { children } = props;
  const navigate = useNavigate();
  const [contactData, setContactData] = useState(
    window.__CONTACT_DATA__?.user || {}
  );
  const [captcha, setCaptcha] = useState<string | null>(null);

  const submitPreConfirmation = useMutation({
    mutationFn: preConfirmationSubmit,
  });

  const updateContactData = (field: keyof ContactData, value: string): void => {
    setContactData((prev) => ({ ...prev, [field]: value }));
  };

  const updateCaptcha = (token: string | null): void => {
    setCaptcha(token);
  };

  const submitContactData = async (): Promise<void> => {
    if (!contactData || !captcha) return;
    submitPreConfirmation.mutate(
      {
        captcha,
        contactData,
        referrer: window.__CONTACT_DATA__.referrer,
        token: window.__CONTACT_DATA__.token,
      },
      {
        onSuccess: (redirectTo) => {
          if (redirectTo) navigate(redirectTo);
        },
      }
    );
  };

  const isValidForm = useMemo(() => {
    return !!captcha && Object.entries(contactData).every(Boolean);
  }, [captcha, contactData]);

  return (
    <PreConfirmationContext.Provider
      value={{
        ...contactData,
        isValidForm,
        captcha,
        loading: submitPreConfirmation.isPending,
        error: submitPreConfirmation.isError,
        updateContactData,
        updateCaptcha,
        submitContactData,
      }}
    >
      {children}
    </PreConfirmationContext.Provider>
  );
};
