import React from "react";

import ReCAPTCHA from "react-google-recaptcha";

type Props = {
  className?: string;
  onChange: (value: string | null) => void;
};

export const Captcha = (props: Props): React.ReactElement => {
  const { onChange, className } = props;
  return (
    <div className={className}>
      <ReCAPTCHA onChange={onChange} sitekey={import.meta.env.VITE_PUBLIC_CAPTCHA_KEY!} />
    </div>
  );
};
