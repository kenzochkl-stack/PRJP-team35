import { useRouter } from "expo-router";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../src/styles/colors";
const { width } = Dimensions.get("window");
export default function AuthLanding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(auth)/signup-slides")}
      >
        <Text style={styles.buttonText}>S’inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: COLORS.background,
  },
  button: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    
  
  },
  buttonText: {
    color: "#ffffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  appLogo : {
    height: 210,
    width: width,
    
  }
});