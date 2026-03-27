import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { COLORS } from "../../src/styles/colors";

export default function ResetPassword() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showError, setShowError] = useState(false);

  const minLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const passwordsMatch = password === confirm;

  const passwordStrength =
    (minLength ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSymbol ? 1 : 0);

  const handleSubmit = async () => {
    if (!passwordsMatch) {
      setShowError(true);
      return;
    }

    setShowError(false);

    try {
      /* ---------------- BUILD PAYLOAD ---------------- */

      const payload: any = {
        signupToken: params.signupToken,
        password,
        role: params.role,
        firstname: params.prenom,
        familyname: params.nom,
        postaladr: params.postal,
        enfants: params.children,
      };

      // 🔥 Handle children ONLY if exists (parent case)
      if (payload.children && typeof payload.children === "string") {
        try {
          payload.children = JSON.parse(payload.children);
        } catch {
          console.log("children parse error");
        }
      }

      /* ---------------- MEMBER CALL ---------------- */

      const memberResponse = await fetch(
        "http://192.168.100.15:3000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const memberData = await memberResponse.json();

      if (!memberResponse.ok) return;

      /* ---------------- OPTIONAL PARENT CALL ---------------- */

      if (payload.role === "parent" && payload.children) {
        await fetch("https://your-api/parent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            member_id: memberData.id,
            children: payload.children,
          }),
        });
      }

      /* ---------------- NAVIGATION ---------------- */

      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Image source={require("../../assets/icons/chevron_backward2.png")} />
      </TouchableOpacity>

      {/* PASSWORD */}
      <Text style={styles.label}>Mot de passe</Text>

      <View
        style={[
          styles.inputWrapper,
          confirm && showError && styles.errorBorder,
        ]}
      >
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={
              showPassword
                ? require("../../assets/icons/visibility_off_gray.png")
                : require("../../assets/icons/visibility_gray.png")
            }
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
      </View>

      {/* CONFIRM */}
      <Text style={styles.label}>Confirmation du mot de passe</Text>

      <View
        style={[
          styles.inputWrapper,
          confirm && showError && styles.errorBorder,
        ]}
      >
        <TextInput
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry={!showPasswordConfirm}
          style={styles.input}
        />

        <TouchableOpacity
          onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
        >
          <Image
            source={
              showPasswordConfirm
                ? require("../../assets/icons/visibility_off_gray.png")
                : require("../../assets/icons/visibility_gray.png")
            }
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
      </View>

      {/* ERROR */}
      {confirm && showError && (
        <Text style={styles.error}>
          Le mot de passe et la confirmation ne correspondent pas
        </Text>
      )}

      {/* RULES */}
      <View style={styles.rules}>
        <View style={styles.rule}>
          <View style={[styles.circle, minLength && styles.valid]} />
          <Text>8 caractères minimum</Text>
        </View>

        <View style={styles.rule}>
          <View style={[styles.circle, hasNumber && styles.valid]} />
          <Text>un chiffre</Text>
        </View>

        <View style={styles.rule}>
          <View style={[styles.circle, hasSymbol && styles.valid]} />
          <Text>un symbole</Text>
        </View>
      </View>

      {/* STRENGTH */}
      <View style={styles.strengthBar}>
        <View
          style={[styles.strengthFill, { width: `${passwordStrength * 33}%` }]}
        />
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.button}
        disabled={passwordStrength < 1}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 80,
  },

  back: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  label: {
    marginBottom: 6,
    marginTop: 16,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },

  input: {
    flex: 1,
  },

  errorBorder: {
    borderColor: "red",
  },

  error: {
    color: "red",
    marginTop: 6,
  },

  rules: {
    marginTop: 20,
  },

  rule: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 10,
  },

  valid: {
    backgroundColor: "green",
    borderColor: "green",
  },

  strengthBar: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 6,
    marginTop: 10,
  },

  strengthFill: {
    height: 6,
    backgroundColor: "#8B5CF6",
    borderRadius: 6,
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
});
