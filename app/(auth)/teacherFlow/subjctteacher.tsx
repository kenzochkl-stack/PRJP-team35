import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { COLORS } from "../../../src/styles/colors";

const { width } = Dimensions.get("window");
const scale = (size: number) => (width / 412) * size;

export default function SelectSubjects() {
  const router = useRouter();
  const { levels } = useLocalSearchParams();
  const serverIP = "192.168.100.5";

  const cyclesArray = levels ? (levels as string).split(",") : [];

  const [activeTab, setActiveTab] = useState(cyclesArray[0] || "");
  const [activeFilter, setActiveFilter] = useState("");
  const [activeSpe, setActiveSpe] = useState("");

  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectionsByCycle, setSelectionsByCycle] = useState<
    Record<string, string[]>
  >({});

  const isAllCyclesFilled = cyclesArray.every(
    (cycle) => selectionsByCycle[cycle] && selectionsByCycle[cycle].length > 0,
  );

  useEffect(() => {
    const loadData = async () => {
      if (!activeTab) return;
      try {
        setLoading(true);
        let url = `http://${serverIP}:3000/api/specialties/subjects?cycleChoisi=${activeTab}`;

        // 1. CAS LYCÉE (Secondaire)
        if (activeTab === "Secondaire" && activeFilter) {
          url = `http://${serverIP}:3000/api/specialties/nature?cycle=secondaire&nature=${activeFilter.toLowerCase()}`;
        }

        // 2. CAS ESI (Exactement comme ton test Chrome qui marche)
        else if (activeTab === "ESI") {
          // On garde la base : ?cycleChoisi=ESI
          if (activeFilter) {
            url += `&niveau=${activeFilter}`;
          }
          if (activeFilter === "2CS" && activeSpe) {
            // Utilisation de encodeURIComponent pour l'accent "specialité"
            url += `&${encodeURIComponent("specialité")}=${activeSpe}`;
          }
        }

        console.log("Appel API :", url);

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data.subjects) {
          setSubjects(data.subjects);
        } else {
          setSubjects([]);
        }
      } catch (error) {
        console.error("Erreur Fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeTab, activeFilter, activeSpe]);

  const toggleSubject = (name: string) => {
    setSelectionsByCycle((prev) => {
      const currentSelections = prev[activeTab] || [];
      const isAlreadySelected = currentSelections.includes(name);
      const newSelections = isAlreadySelected
        ? currentSelections.filter((i) => i !== name)
        : [...currentSelections, name];
      return { ...prev, [activeTab]: newSelections };
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Image
          style={styles.backIcon}
          source={require("../../../assets/icons/chevron_backward2.png")}
        />
      </TouchableOpacity>

      <Text style={styles.mainTitle}>Quelle matière enseignez-vous ?</Text>

      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.centerScroll}
        >
          {cyclesArray.map((cycle) => (
            <TouchableOpacity
              key={cycle}
              onPress={() => {
                setActiveTab(cycle);
                setActiveFilter("");
                setActiveSpe("");
              }}
              style={styles.tabItem}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === cycle && styles.activeTabText,
                ]}
              >
                {cycle === "Secondaire"
                  ? "Lycée"
                  : cycle === "Moyen"
                    ? "Collège"
                    : cycle}
              </Text>
              {activeTab === cycle && (
                <View
                  style={[
                    styles.underline,
                    { backgroundColor: COLORS.primary },
                  ]}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {(activeTab === "Secondaire" || activeTab === "ESI") && (
        <View style={styles.subFilterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.centerScroll}
          >
            {(activeTab === "Secondaire"
              ? ["TECHNIQUE", "LETTRE", "GESTION"]
              : ["1CP", "2CP", "1CS", "2CS"]
            ).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => {
                  setActiveFilter(f);
                  setActiveSpe("");
                }}
                style={styles.subFilterItem}
              >
                <Text
                  style={[
                    styles.subFilterText,
                    activeFilter === f && { color: COLORS.primary },
                  ]}
                >
                  {f}
                </Text>
                {activeFilter === f && (
                  <View
                    style={[
                      styles.subUnderline,
                      { backgroundColor: COLORS.primary },
                    ]}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {activeTab === "ESI" && activeFilter === "2CS" && (
        <View style={styles.speRow}>
          {["SIQ", "SIL", "SID", "SIT"].map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setActiveSpe(s)}
              style={[
                styles.speBtn,
                activeSpe === s && {
                  backgroundColor: COLORS.primary,
                  borderColor: COLORS.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.speBtnText,
                  activeSpe === s && { color: "#FFF" },
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 50 }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {subjects.map((item) => {
            const isSelected = selectionsByCycle[activeTab]?.includes(item);
            return (
              <TouchableOpacity
                key={item}
                onPress={() => toggleSubject(item)}
                style={[
                  styles.subjectButton,
                  {
                    backgroundColor: isSelected ? COLORS.secondary : "#FFF",
                    borderColor: COLORS.primary,
                  },
                ]}
              >
                <Text style={styles.subjectText}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {isAllCyclesFilled && (
        <TouchableOpacity
          style={styles.nextArrow}
          onPress={() => {
            router.push({
              pathname: "/(auth)/teacherFlow/infoteacher" as any,
              params: {
                levels: levels,
                selectedSubjects: JSON.stringify(selectionsByCycle),
              },
            });
          }}
        >
          <Image
            style={styles.nextIcon}
            source={require("../../../assets/images/arrow.png")}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  backBtn: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "#D8DADC",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  backIcon: { width: 18, height: 25 },
  mainTitle: {
    fontSize: scale(26),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#000",
  },
  tabsContainer: { marginBottom: 20 },
  centerScroll: { flexGrow: 1, justifyContent: "center" },
  tabItem: { marginHorizontal: 15, paddingBottom: 8, alignItems: "center" },
  tabText: { fontSize: 18, fontWeight: "bold", color: "#BDBDBD" },
  activeTabText: { color: "#000" },
  underline: { height: 3, width: "100%", marginTop: 2, borderRadius: 2 },
  subFilterContainer: { marginBottom: 20 },
  subFilterItem: {
    marginHorizontal: 12,
    paddingBottom: 5,
    alignItems: "center",
  },
  subFilterText: { fontSize: 14, fontWeight: "600", color: "#999" },
  subUnderline: { height: 2, width: "100%", marginTop: 2 },
  subjectButton: {
    width: "100%",
    height: 50,
    borderWidth: 1.5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  subjectText: { fontSize: 16, fontWeight: "500", color: "#000" },
  speRow: { flexDirection: "row", justifyContent: "center", marginBottom: 15 },
  speBtn: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEE",
    marginHorizontal: 5,
  },
  speBtnText: { fontSize: 12, fontWeight: "bold", color: "#666" },
  nextArrow: {
    position: "absolute",
    bottom: 40,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: "#9F54F8",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  nextIcon: { width: 30, height: 30, tintColor: "#fff" },
});
