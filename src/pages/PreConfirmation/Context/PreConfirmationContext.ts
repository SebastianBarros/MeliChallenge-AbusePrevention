import { createContext } from "react";

type tPreConfirmationContext = {
  name: string;
  address: string;
  country: string;
  captcha: string | null
  isValidForm: boolean
  loading: boolean
  error: boolean
  updateContactData: (field: keyof ContactData, value: string) => void
  updateCaptcha: (token: string | null) => void
  submitContactData: () => void
};

export const PreConfirmationContext = createContext<
  tPreConfirmationContext | undefined
>(undefined);
