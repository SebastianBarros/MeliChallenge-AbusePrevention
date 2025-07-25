/// <reference types="vite/client" />

declare type ContactData = {
  name: string;
  address: string;
  country: string;
};

interface Window {
  __CONTACT_DATA__: {
    referrer: string
    token: string
    user: {
      name: string;
      address: string;
      country: string;
    };
  };
}
