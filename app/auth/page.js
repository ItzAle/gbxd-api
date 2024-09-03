"use client";

import { useState } from "react";
import { auth, signInWithGoogle } from "../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});
export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    if (isRegister) {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: username,
      });
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
    router.push("/add-game");
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    router.push("/add-game");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
          <button
            onClick={handleGoogleLogin}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Sign in with Google
          </button>
        </div>
      </>
    </ThemeProvider>
  );
}
