import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../../src/styles/colors";
import {FaEye} from "react-icons/fa6";


export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Image src=""/>
      </TouchableOpacity>

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
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eye}>
              {showPassword ? <FaEye/> : "👁️"}
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
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>CONFIRMER</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 75,
    backgroundColor: "#fff",
  },

  back: {
    marginTop: 10,
    width: 40,
  },

  backText: {
    fontSize: 28,
    color: COLORS.text,
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