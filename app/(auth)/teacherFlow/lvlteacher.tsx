import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../../../src/styles/colors";

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 412;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

export default function Explore() {
  const router = useRouter();

  // On stocke les "values" (Primaire, Moyen, Secondaire, ESI)
  const [selected, setSelected] = useState<string[]>([]);

  const levelsMap = [
    { label: "Primaire", value: "Primaire" },
    { label: "Collège", value: "Moyen" },
    { label: "Lycée", value: "Secondaire" },
    { label: "Université", value: "ESI" },
  ];

  const toggleSelection = (val: string) => {
    if (selected.includes(val)) {
      setSelected(selected.filter((i) => i !== val));
    } else {
      setSelected([...selected, val]);
    }
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

      <Text style={styles.title}>Quel(s) niveau(x) enseignez-vous ?</Text>

      {/* Utilisation de levelsMap pour afficher le label mais stocker la value */}
      {levelsMap.map((item) => (
        <Pressable
          key={item.value}
          onPress={() => toggleSelection(item.value)}
          style={[
            styles.button,
            {
              backgroundColor: selected.includes(item.value)
                ? "#D785FF"
                : COLORS.primary,
            },
          ]}
        >
          <Text style={styles.buttontext}>{item.label}</Text>
        </Pressable>
      ))}

      {/* NEXT */}
      {selected.length > 0 && (
        <Pressable
          style={styles.nextArrow}
          onPress={() => {
            router.push({
              // @ts-ignore
              pathname: "/(auth)/teacherFlow/subjctteacher",
              params: { levels: selected.join(",") }, // Envoie les valeurs techniques (ex: "Secondaire,ESI")
            });
          }}
        >
          <Image
            style={styles.nextIcon}
            source={require("../../assets/images/arrow.png")}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 34,
    backgroundColor: "#fff",
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
    fontFamily: "SchibstedGrotesk",
    fontWeight: "bold",
    fontSize: scale(27),
    color: "black",
    textAlign: "center",
    marginTop: scale(60),
    marginBottom: scale(100),
  },

  button: {
    borderRadius: scale(12),
    width: scale(344),
    height: scale(60),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: scale(35),
  },

  buttontext: {
    color: "white",
    fontFamily: "SchibstedGrotesk",
    fontWeight: "bold",
    fontSize: scale(18),
    padding: 0,
  },

  nextArrow: {
    position: "absolute",
    bottom: scale(40),
    right: scale(30),
    width: scale(60),
    height: scale(60),
    backgroundColor: "#9F54F8",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  nextIcon: {
    width: scale(30),
    height: scale(30),
    tintColor: "#fff",
  },
});
