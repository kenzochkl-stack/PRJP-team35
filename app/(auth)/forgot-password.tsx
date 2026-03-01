import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../../src/styles/colors";

export default function ForgotPassword() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mot de passe oublié</Text>

      <Text style={styles.desc}>
        Veuillez fournir l’adresse e-mail utilisée lors de votre inscription.
      </Text>

      <TextInput style={styles.input} placeholder="Email" />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/verification")}
      >
        <Text style={styles.buttonText}>ENVOYER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 175 },
  title: { fontSize: 28, color: COLORS.primary, marginBottom: 12, fontWeight: "600" , textAlign: "center"},
  desc: { color: COLORS.text, marginBottom: 24 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  button: {
    marginTop: 24,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});