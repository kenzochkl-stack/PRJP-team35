import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../../src/styles/colors";
import { useLocalSearchParams } from "expo-router";

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { email } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!password || !confirm) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://your-backend.com/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            newPassword: password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erreur lors de la réinitialisation");
        return;
      }

      router.replace("/login");
    } catch (err) {
      console.log(err);
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Image source={require("../../assets/icons/chevron_backward2.png")} />
      </TouchableOpacity>

      <View style={styles.secondaryContainer}>
        {/* Title */}
        <Text style={styles.title}>Nouveau mot de passe</Text>

        <Text style={styles.desc}>
          Veuillez définir un nouveau mot de passe sécurisé pour votre compte.
        </Text>

        {/* Password */}
        <View style={styles.field}>
          <Text style={styles.label}>Mot de passe</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.eye}>
                {showPassword ? (
                  <Image
                    source={require("../../assets/icons/visibility_off_gray.png")}
                    style={{ width: 20, height: 20 }}
                  />
                ) : (
                  <Image
                    source={require("../../assets/icons/visibility_gray.png")}
                    style={{ width: 20, height: 20 }}
                  />
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm */}
        <View style={styles.field}>
          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showPassword}
            />
          </View>
        </View>

        {/* Submit */}
        {error ? (
          <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
        ) : null}
        <TouchableOpacity
          style={styles.button}
          onPress={handleReset}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "..." : "CONFIRMER"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,

    backgroundColor: "#fff",
  },

  secondaryContainer: {
    flex: 1,
    paddingTop: 45,
  },

  back: {
    marginTop: 10,
    width: 40,
    height: 40,
    borderWidth: 2,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#828282ff",
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 40,
  },

  desc: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
    marginBottom: 32,
  },

  field: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  eye: {
    fontSize: 18,
  },

  button: {
    marginTop: 32,
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
