import axios from "axios";

export const validateCaptcha = async (captcha: string) => {
  const params = new URLSearchParams();
  params.append("secret", process.env.SECRET_CAPTCHA_KEY!);
  params.append("response", captcha);
  try {
    const res = await axios.post(
      process.env.CAPTCHA_VALIDATION_URL!,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return !!res?.data?.success;
  } catch {
    // log error
    return false;
  }
};
