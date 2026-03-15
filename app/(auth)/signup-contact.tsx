
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from "react-native";

import { useRouter } from "expo-router";
import { useState } from "react";

export default function SignupContact() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- SEND OTP ---------------- */

  const handleSignup = async () => {

    if (!email) {
      setError("Veuillez entrer votre email");
      return;
    }

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        "https://your-backend.com/api/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            phone: phone
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erreur lors de l'envoi du code");
        return;
      }

      /* SUCCESS → go to verification */

      router.push({
        pathname: "/(auth)/verification",
        params: {
          email: email,
          mode: "signup"
        }
      });

    } catch (err) {

      console.log(err);
      setError("Erreur réseau");

    } finally {

      setLoading(false);

    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Bienvenue a <Text style={styles.purple}>Proffind!</Text>
      </Text>

      <Text style={styles.subtitle}>
        Rejoignez <Text style={styles.purple}>nous</Text> et débloquez
        votre potentiel !
      </Text>

      {/* EMAIL */}

      <Text style={styles.label}>Email</Text>

      <TextInput
        placeholder="example@email.com"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* PHONE */}

      <Text style={styles.label}>Phone Number</Text>

      <TextInput
        placeholder="+213XXXXXXXXX"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* ERROR */}

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      {/* BUTTON */}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}
      >

        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Create an account
          </Text>
        )}

      </TouchableOpacity>

      {/* LOGIN */}

      <Text
        style={styles.loginText}
        onPress={() => router.replace("/login")}
      >
        Already have an account?{" "}
        <Text style={styles.login}>Login</Text>
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingTop: 130
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 30
  },

  purple: {
    color: "#8B5CF6"
  },

  subtitle: {
    fontSize: 22,
    marginTop: 10,
    fontWeight: "600",
    textAlign: "center"
  },

  label: {
    marginTop: 30,
    marginBottom: 6,
    fontSize: 14
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    padding: 14,
    fontSize: 14
  },

  button: {
    marginTop: 40,
    backgroundColor: "#8B5CF6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center"
  },

  buttonText: {
    color: "white",
    fontWeight: "600"
  },

  error: {
    color: "red",
    marginTop: 10
  },

  loginText: {
    marginTop: 25,
    textAlign: "center",
    color: "#777"
  },

  login: {
    color: "#8B5CF6",
    fontWeight: "600"
  }

});

