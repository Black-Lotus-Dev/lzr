import { useAuth } from "reactfire";

export default function IndexPage() {
  const auth = useAuth();

  function login() {
    console.log(auth.currentUser);
  }

  return (
    <div>
      Hello World. <button onClick={login}>About</button>
    </div>
  );
}
