import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Stack } from "expo-router/stack";

export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
