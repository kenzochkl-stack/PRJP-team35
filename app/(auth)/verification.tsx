import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../../src/styles/colors";

export default function Verification() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", ""]);

  const inputs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && code[index] === "" && index > 0) {
      inputs[index - 1].current?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      {/* Title */}
      <View style={styles.secondaryContainer}>
        <Text style={styles.title}>Vérification</Text>

      <Text style={styles.desc}>
        Nous avons envoyé un code à 4 chiffres. Veuillez le saisir ci-dessous.
      </Text>

      {/* OTP inputs */}
      <View style={styles.otpRow}>
        {code.map((value, index) => (
          <TextInput
            key={index}
            ref={inputs[index]}
            value={value}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(nativeEvent.key, index)
            }
            keyboardType="number-pad"
            maxLength={1}
            style={[
              styles.otpBox,
              value ? styles.otpFilled : null,
            ]}
            autoFocus={index === 0}
          />
        ))}
      </View>

      {/* Resend */}
      <TouchableOpacity>
        <Text style={styles.resend}>
          Je n’ai pas reçu le code. Renvoyer
        </Text>
      </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    
    backgroundColor: "#fff",
  },

  secondaryContainer: {
    flex: 1,
   paddingTop: 75,
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
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 40,

    marginBottom: 40,
  },

  desc: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },

  otpBox: {
    width: 56,
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginHorizontal: 7,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
  },

  otpFilled: {
    borderColor: COLORS.primary,
  },

  resend: {
    marginTop: 32,
    textAlign: "center",
    color: COLORS.primary,
    textDecorationLine: "underline",
  },

 
});