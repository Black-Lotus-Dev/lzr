import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "reactfire";
import { useDispatch, useStore } from "react-redux";
import { ReduxDispatch, ReduxStore } from "../redux/store";
import storeWatch from "../utils/store-watch";
import { UserState } from "../redux/slices/user";
import { joinLzrRoom } from "ggpo";
import { runUserAuthSubscribers } from "@utils/user";

interface ProtectedRouteProps {
  children: ReactNode;
  isProtectedRoute: boolean;
}

const RouteAuth = ({ children, isProtectedRoute }: ProtectedRouteProps) => {
  const store = useStore<ReduxStore>();
  const dispatch = useDispatch<ReduxDispatch>();
  const auth = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const loadingTimerRef = useRef<NodeJS.Timeout>();

  const attemptedRoute = router.pathname;

  useEffect(() => {
    if (!isProtectedRoute) return;
    const unsubscribe = storeWatch<UserState>((newVal, oldVal) => {
      setIsAuthenticated(!!newVal.authUser);
      if (newVal.authUser !== null) {
        joinLzrRoom(attemptedRoute, newVal.authUser?.uid!);
        runUserAuthSubscribers();
      }
    }, "user");

    auth.onAuthStateChanged((user) => {
      if (user === null) {
        loadingTimerRef.current = setTimeout(() => {
          router.push("/login");
          dispatch.router.setAttemptedRoute(attemptedRoute);
        }, 2000);
      } else {
        clearTimeout(loadingTimerRef.current);
        dispatch.user.startUp(user);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  //user loader
  if (!isAuthenticated && isProtectedRoute)
    return <div className="h-screen w-screen" />;

  return <div className="h-full w-full bg-transparent">{children}</div>;
};

export default RouteAuth;
