import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";

import { useRef, useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { COLORS } from "../../src/styles/colors";

const RESEND_TIME = 30;

export default function Verification() {

  const router = useRouter();
  const { mode, email } = useLocalSearchParams();

  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(RESEND_TIME);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  /* ---------------- TIMER ---------------- */

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ---------------- OTP INPUT ---------------- */

  const handleChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs[index + 1].current?.focus();
    }

    if (index === 3 && text) {
      verifyOtp(newCode.join(""));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && code[index] === "" && index > 0) {
      inputs[index - 1].current?.focus();
    }
  };

  /* ---------------- VERIFY OTP ---------------- */

  const verifyOtp = async (otp: string) => {

    if (otp.length !== 4) return;

    try {

      setLoading(true);
      setError(false);

      const response = await fetch(
        "https://your-backend.com/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(true);
        return;
      }

      /* SUCCESS */

      if (mode === "signup") {
        router.push("/(auth)/signup-profile");
      } else {
       router.push({
  pathname: "/(auth)/reset-password",
  params: { email }
});
      }

    } catch (err) {

      console.log(err);
      setError(true);

    } finally {

      setLoading(false);

    }

  };

  /* ---------------- RESEND ---------------- */

  const handleResend = async () => {

    if (timer > 0) return;

    try {

      await fetch(
        "https://your-backend.com/api/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      setTimer(RESEND_TIME);

    } catch (err) {
      console.log(err);
    }

  };

  return (

    <View style={styles.container}>

      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.back}
      >
        <Image
          style={styles.backIcon}
          source={require("../../assets/icons/chevron_backward2.png")}
        />
      </TouchableOpacity>

      <View style={styles.secondaryContainer}>

        <Text style={styles.title}>Vérification</Text>

        <Text style={styles.desc}>
          Nous avons envoyé un code à 4 chiffres à votre email
        </Text>

        {/* OTP */}

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
              autoFocus={index === 0}
              selectionColor={COLORS.primary}
              style={[
                styles.otpBox,
                value ? styles.otpFilled : null,
                error ? styles.otpError : null,
              ]}
            />

          ))}

        </View>

        {error && (
          <Text style={styles.errorText}>
            Code invalide, veuillez réessayer
          </Text>
        )}

        {/* RESEND */}

        <TouchableOpacity
          disabled={timer > 0}
          onPress={handleResend}
        >

          <Text
            style={[
              styles.resend,
              { opacity: timer > 0 ? 0.5 : 1 },
            ]}
          >

            {timer > 0
              ? `Renvoyer un code 00:${timer
                  .toString()
                  .padStart(2, "0")}`
              : "Renvoyer un code"}

          </Text>

        </TouchableOpacity>

        {/* VERIFY BUTTON */}

        <TouchableOpacity
          style={styles.button}
          onPress={() => verifyOtp(code.join(""))}
        >

          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Vérifier</Text>
          )}

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
    marginTop: 50,
    width: 45,
    height: 45,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#D8DADC",
  },

  backIcon: {
    width: 20,
    height: 30,
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

  otpError: {
    borderColor: "red",
  },

  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
    fontSize: 13,
  },

  resend: {
    marginTop: 32,
    textAlign: "center",
    color: COLORS.primary,
    textDecorationLine: "underline",
  },

  button: {
    marginTop: 50,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

});