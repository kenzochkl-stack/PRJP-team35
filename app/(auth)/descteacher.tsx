import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 412;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

export default function Salut() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [description, setDescription] = useState('');
  const [isPressed, setIsPressed] = useState(false); 

  const handleFinish = async () => {
    try {
      const finalData = {
        ...params,
        description: description,
      };

      console.log("Données envoyées :", finalData);

      const response = await fetch('http://192.168.100.5:3000/api/teachers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        Alert.alert("Succès", "Votre profil a été créé !");
        router.push("/(auth)/login");
      } else {
        throw new Error("Erreur");
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de contacter le serveur.");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Image
            style={styles.backIcon}
            source={require("../../assets/icons/chevron_backward2.png")}
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Parlez-nous un peu{"\n"}de <Text style={{ color: '#9F54F8' }}>vous !</Text>
        </Text>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Ecrivez ici..."
            placeholderTextColor="#A9A9A9"
            multiline={true}
            numberOfLines={10}
            textAlignVertical="top" 
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            activeOpacity={1} 
            onPressIn={() => setIsPressed(true)}   
            onPressOut={() => setIsPressed(false)} 
            onPress={handleFinish}
            style={[
              styles.continueButton, 
              { backgroundColor: isPressed ? '#7B39D1' : '#9F54F8' } 
            ]} 
          >
            <Text style={styles.buttonText}>Continuer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 34, 
    backgroundColor: "#fff" 
  },

  back: { 
    marginTop: 50, 
    width: 45, 
    height: 45, 
    borderWidth: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    borderRadius: 10, 
    borderColor: "#D8DADC" 
  },

  backIcon: { 
    width: scale(15), 
    height: scale(25) 
  },

  title: { 
    fontWeight: 'bold', 
    fontSize: scale(27), 
    color: 'black', 
    textAlign: 'center', 
    marginTop: scale(40), 
    marginBottom: scale(60) 
  },

  inputSection: { 
    width: '100%' 
  },

  label: { 
    fontSize: scale(16), 
    color: '#333', 
    marginBottom: 8, 
    fontWeight: '600' 
  },

  textArea: { 
    width: '100%', 
    height: scale(200), 
    borderWidth: 1, 
    borderColor: '#C0C0C0', 
    borderRadius: 10, 
    padding: 15, 
    fontSize: scale(16), 
    backgroundColor: '#fff' 
  },

  footer: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    marginBottom: scale(40), 
    marginTop: 20 
  },

  continueButton: { 
    width: '100%', 
    height: scale(60), 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 3 
  },

  buttonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: scale(18) 
  },
});