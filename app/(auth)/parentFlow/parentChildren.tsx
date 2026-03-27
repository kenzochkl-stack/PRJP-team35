import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { COLORS } from "../../../src/styles/colors";

export default function ParentChildren() {
  const router = useRouter();

  const { email, phone, signupToken, nom, prenom, postal, role } =
    useLocalSearchParams();

  // start with NO children
  const [children, setChildren] = useState<{ nom: string; prenom: string }[]>(
    [],
  );

  const addChild = () => {
    setChildren([...children, { nom: "", prenom: "" }]);
  };

  const removeChild = (index: number) => {
    const updated = children.filter((_, i) => i !== index);
    setChildren(updated);
  };

  const updateChild = (index: number, field: any, value: any) => {
    const updated = [...children];
    // @ts-ignore
    updated[index][field] = value;
    setChildren(updated);
  };

  const handleContinue = () => {
    router.push({
      pathname: "/(auth)/create-password",
      params: {
        email,
        phone,
        signupToken,
        nom,
        prenom,
        postal,
        role,
        children: JSON.stringify(children),
      },
    });
  };

  return (
    <View
      style={{
        height: "100%",
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingBottom: 60,
      }}
    >
      <Text style={styles.title}>
        Remplir les informations de vos{" "}
        <Text style={styles.purple}>enfants</Text>
      </Text>
      <ScrollView style={styles.container}>
        {/* CHILDREN LIST */}

        {children.map((child, index) => (
          <View key={index} style={styles.childBlock}>
            <View style={styles.childHeader}>
              <Text style={styles.childTitle}>Enfant {index + 1}</Text>

              <TouchableOpacity onPress={() => removeChild(index)}>
                <Text style={styles.delete}>Supprimer</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              value={child.nom}
              onChangeText={(text) => updateChild(index, "nom", text)}
            />

            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={styles.input}
              value={child.prenom}
              onChangeText={(text) => updateChild(index, "prenom", text)}
            />
          </View>
        ))}
      </ScrollView>
      <View style={{ paddingHorizontal: 24 }}>
        {/* ADD CHILD BUTTON */}

        <TouchableOpacity style={styles.addButton} onPress={addChild}>
          <Text style={styles.addText}>Ajouter un enfant</Text>
        </TouchableOpacity>

        {/* CONTINUE BUTTON ONLY IF CHILD EXISTS */}

        {children.length > 0 && (
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continuer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 80,
    marginBottom: 40,
    fontWeight: "600",
    paddingHorizontal: 24,
  },

  purple: {
    color: COLORS.primary,
  },

  childBlock: {
    marginBottom: 20,
  },

  childHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  childTitle: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 10,
  },

  delete: {
    color: "#E53935",
    fontWeight: "500",
  },

  label: {
    marginBottom: 6,
    color: "#555",
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  addButton: {
    marginTop: 10,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },

  addText: {
    color: "#fff",
    fontWeight: "600",
  },

  button: {
    marginTop: 20,
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
