// pages/_app.js
import GlobalModalProvider from "@/components/GlobalModalProvider";
import "../styles/globals.css"; 

function MyApp({ Component, pageProps }) {
  return (
    <GlobalModalProvider>
      <Component {...pageProps} />
    </GlobalModalProvider>
  );
}

export default MyApp;
