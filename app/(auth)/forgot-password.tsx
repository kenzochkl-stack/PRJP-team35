import { View, Text, TextInput, TouchableOpacity, StyleSheet ,Image} from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../../src/styles/colors";
import { useState } from "react";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
              <Image style={styles.backIcon} source={require('../../assets/icons/chevron_backward2.png')} />  
            </TouchableOpacity>
       <View style={styles.secondaryContainer}>
      <Text style={styles.title}>Mot de passe oublié</Text>

      <Text style={styles.desc}>
        Veuillez fournir l’adresse e-mail utilisée lors de votre inscription.
      </Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          value={email}
          onChangeText={setEmail}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder=""
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({
  pathname: "/(auth)/verification",
  params: { email , mode: "signin" }
})}
      >
        <Text style={styles.buttonText}>ENVOYER</Text>
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
   paddingTop: 120,
  },
  
   back: {
    marginTop: 50,
    width: 45,
    height:45,
    borderWidth: 1,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems:"center",
    borderRadius: 10,
    borderColor: "#D8DADC"
  },

  backIcon: {
    width:20,
    height:30
  },
  title: { fontSize: 28, color: COLORS.primary, marginBottom: 40, fontWeight: "600" , textAlign: "center"},
  desc: { color: COLORS.text, marginBottom: 24 , width: "100%" , textAlign: "center" , paddingHorizontal: 20},
  inputWrapper: {
    marginTop: 40,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
   inputFocused: {
    borderBottomColor: "#9B5CF6",  // highlights purple when focused
  },
 input: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
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