import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { COLORS } from "../../src/styles/colors";

export default function SignupProfile() {
  const router = useRouter();

  const { email, phone, signupToken } = useLocalSearchParams();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [postal, setPostal] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

  const statusOptions = ["Professeur", "Etudiant", "parent"];

  const handleSubmit = () => {
    if (!nom || !prenom || !postal || !status) return;
    const statusRoutes = {
      Etudiant: "/(student)/dashboard",
      parent: "/(auth)/parentFlow/parentChildren",
      Professeur: "/(teacher)/dashboard",
    } as const;

    const path = statusRoutes[status as keyof typeof statusRoutes];

    if (!path) return;

    router.push({
      pathname: path,
      params: {
        email,
        phone,
        signupToken,
        nom,
        prenom,
        postal,
        role: status,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Image
          style={styles.backIcon}
          source={require("../../assets/icons/chevron_backward2.png")}
        />
      </TouchableOpacity>

      {/* FORM */}
      <View style={styles.form}>
        <Text style={styles.label}>Nom</Text>
        <TextInput style={styles.input} value={nom} onChangeText={setNom} />

        <Text style={styles.label}>Prenom</Text>
        <TextInput
          style={styles.input}
          value={prenom}
          onChangeText={setPrenom}
        />

        <Text style={styles.label}>Code Postal</Text>
        <TextInput
          style={styles.input}
          value={postal}
          onChangeText={setPostal}
          keyboardType="number-pad"
        />

        {/* STATUS */}
        <Text style={styles.label}>Status</Text>
        <TouchableOpacity style={styles.input} onPress={() => setOpen(!open)}>
          <Text style={{ color: status ? "#000" : "#999" }}>
            {status || "Choisir"}
          </Text>
        </TouchableOpacity>

        {open && (
          <View style={styles.dropdown}>
            {statusOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.option}
                onPress={() => {
                  setStatus(item);
                  setOpen(false);
                }}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}> Continuer </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, backgroundColor: "#fff" },
  form: { marginTop: 80 },
  back: {
    marginTop: 50,
    width: 45,
    height: 45,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#D8DADC",
  },
  backIcon: { width: 20, height: 30 },
  label: { marginTop: 20, marginBottom: 6, fontSize: 14, color: COLORS.text },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  option: { padding: 14, borderBottomWidth: 1, borderColor: "#eee" },
  optionText: { color: COLORS.primary },
  button: {
    marginTop: 40,
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
