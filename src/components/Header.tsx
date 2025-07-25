import React from "react";

import logo from '../assets/ml-logo.svg'

export const Header = (): React.ReactElement => {
  return (
    <div className="h-16 bg-[#ffe600] flex items-center">
      <img src={logo} alt="ml-logo" height={54} width={54} className="ml-4" />
    </div>
  );
};
