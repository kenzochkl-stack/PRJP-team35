import { Redirect } from "expo-router";
import { useAuth } from "../src/context/AuthContext";

export default function Index() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/reset-password" />;
  }

  if (user.role === "teacher") {
    return <Redirect href="/(teacher)/dashboard" />;
  }

  if (user.role === "student") {
    return <Redirect href="/(student)/dashboard" />;
  }

  return <Redirect href="/(parent)/dashboard"/>
}