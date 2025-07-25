import axios from "axios";

const PRE_CONFIRMATION_URL = `${
  import.meta.env.VITE_BACKEND_BASE_URL
}/submit-pre-confirmation`;

export const preConfirmationSubmit = async (params: {
  contactData: ContactData;
  captcha: string;
  referrer: string;
  token: string;
}): Promise<void | string> => {
  const { captcha, contactData, referrer, token } = params;

  if (!contactData || !captcha || !referrer || !token) throw new Error("Hubo un error validando la información");

try {
  const response = await axios.post(PRE_CONFIRMATION_URL, {
    contactData,
    captcha,
    referrer,
    token,
  });

  const result = response.data;

  if (result?.redirectTo) return result.redirectTo;
  throw new Error();
} catch {
  // log error to sentry
  throw new Error("Hubo un error validando la información");
}
};
