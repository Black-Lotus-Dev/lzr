import { FirebaseAppProvider } from "reactfire";
import { ReactElement, ReactNode, useEffect } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { firebaseConfig } from "@configs/firebase";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { reduxStore } from "@redux/store";
import protectedRoutes from "@constants/protected-routes";
import RouteAuth from "@components/route-auth";
import "@styles/index.css";
import { useRouter } from "next/router";

import localFont from "next/font/local";
import { FireWrapper } from "@components/fire-wrapper";
const ethno = localFont({
  src: [
    {
      path: "../../public/assets/fonts/ethno.otf",
    },
  ],
  variable: "--font-ethno",
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  //parse the route path and see if the first node is a protected route
  //if it is, then wrap the component in the protected route component
  //otherwise, just return the component
  const rootNode = router.pathname.split("/")[1];
  const isProtectedRoute = protectedRoutes.includes(rootNode);

  // Use the layout defined at the page level, if available
  return (
    <main className={`${ethno.variable} font-sans h-full w-full`}>
      <Provider store={reduxStore}>
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
          <FireWrapper>
            <RouteAuth isProtectedRoute={isProtectedRoute}>
              <Component {...pageProps} />
            </RouteAuth>
            <Toaster position="bottom-right" />
          </FireWrapper>
        </FirebaseAppProvider>
      </Provider>
    </main>
  );
}
