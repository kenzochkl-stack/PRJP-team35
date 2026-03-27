import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { COLORS } from "../../src/styles/colors";

export default function Login() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- LOGIN ---------------- */

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Detect whether the identifier is an email or phone number
      const isEmail = identifier.includes("@");
      const payload = isEmail
        ? { email: identifier, password }
        : { phone: identifier, password };

      const response = await fetch(
        "http://192.168.100.15:3000/api/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Email ou mot de passe incorrect");
        return;
      }

      /* SUCCESS */
      const {
        token,
        data: { user, details },
      } = data;

      // Store token
      await AsyncStorage.setItem("token", token);

      // Store user info if needed
      await AsyncStorage.setItem("user", JSON.stringify(user));

      // Route based on role
      switch (user.role) {
        case "student":
          router.replace("/(student)/dashboard");
          break;
        case "parent":
          router.replace("/(parent)/dashboard");
          break;
        case "teacher":
          router.replace("/(teacher)/dashboard");
          break;
      }
    } catch (err) {
      console.log(err);
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email / numéro de téléphone</Text>

      <TextInput
        style={styles.input}
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Mot de passe</Text>

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* ERROR MESSAGE */}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* LOGIN BUTTON */}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/forgot-password")}>
        <Text style={styles.link}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      {/* DIVIDER */}

      <View style={styles.divider}>
        <View style={styles.line} />

        <Text style={styles.or}>OR</Text>

        <View style={styles.line} />
      </View>

      {/* GOOGLE BUTTON */}

      <TouchableOpacity style={styles.googleBtn}>
        <Image
          source={require("../../assets/icons/Google.png")}
          style={styles.googleIcon}
        />
        <Text>Continue avec Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 175,
    padding: 24,
    backgroundColor: "#fff",
  },

  label: {
    marginTop: 20,
    marginBottom: 6,
    color: COLORS.text,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 6,
  },

  button: {
    marginTop: 40,
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  error: {
    color: "red",
    marginTop: 8,
  },

  link: {
    textAlign: "center",
    marginTop: 16,
    color: COLORS.gray,
    marginBottom: 24,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  or: {
    marginHorizontal: 10,
    color: COLORS.gray,
  },

  googleBtn: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  googleIcon: {
    height: 20,
    width: 20,
  },
});
