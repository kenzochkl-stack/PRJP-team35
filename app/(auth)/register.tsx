import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher" | "parent">("student");

  const handleRegister = async () => {
    // 🔴 TEMP — later send to backend
    console.log({
      email,
      password,
      role,
    });

    // After successful signup → go to login
    router.replace("/login");
  };

  return (
    <View>
      <Text>Sign Up</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text>Select Role</Text>

      <Button title="Student" onPress={() => setRole("student")} />
      <Button title="Teacher" onPress={() => setRole("teacher")} />
      <Button title="Parent" onPress={() => setRole("parent")} />

      <Text>Selected: {role}</Text>

      <Button title="Create Account" onPress={handleRegister} />

      <Text onPress={() => router.replace("/login")}>
        Already have an account? Sign In
      </Text>
    </View>
  );
}