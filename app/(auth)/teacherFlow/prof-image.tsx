import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../../src/styles/colors";
export default function ProfImage() {
  const router = useRouter();
  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission", "Accès refusé ");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //que des images
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Image
          style={styles.backIcon}
          source={require("../../../assets/icons/chevron_backward2.png")}
        />
      </TouchableOpacity>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.imageClickableZone}
          onPress={handlePickImage}
        >
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../../assets/images/ajouter-photo.png")
            }
            style={profileImage ? styles.previewImage : styles.fullFigmaImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Ajouter une photo</Text>
        {/* Ignorer */}
        {profileImage ? (
          <TouchableOpacity
            style={styles.nextArrowButton}
            onPress={() =>
              router.push("/(auth)/teacherFlow/prof-diplome" as any)
            }
          >
            <Image
              source={require("../../../assets/icons/chevron_forward.png")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.ignoreButtonInPlace}
            onPress={() =>
              router.push("/(auth)/teacherFlow/prof-diplome" as any)
            }
          >
            <Text style={styles.ignoreText}>Ignorer</Text>
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
    //justifyContent: "center",
    //alignItems: "center",
  },
  back: {
    position: "absolute",
    top: 50,
    left: 25,
    width: 45,
    height: 45,
    borderWidth: 1,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#D8DADC",
    zIndex: 10,
  },

  backIcon: {
    width: 20,
    height: 30,
  },
  content: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 100,
  },
  imageClickableZone: {
    marginTop: 130,
    marginBottom: 40,
  },
  fullFigmaImage: {
    width: 270,
    height: 270,
  },
  previewImage: {
    width: 270,
    height: 270,
    borderRadius: 135,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    color: COLORS.text,
    marginBottom: 40,
  },

  ignoreButton: {
    position: "absolute",
    bottom: 170,
    marginTop: -40,
    width: "100%",
    alignItems: "center",
  },

  nextArrowButton: {
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
  },
  arrowIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF", // Rend l'icône blanche
  },
  ignoreText: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "500",
  },
  ignoreButtonInPlace: {
    marginTop: 20,
    padding: 15,
    width: "100%",
    alignItems: "center",
  },
});
