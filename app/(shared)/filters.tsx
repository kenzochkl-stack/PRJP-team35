import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as Location from "expo-location";
import {
  Navigation,
  RotateCcw,
  Star,
  BookOpen,
  Users,
  Search,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

type Level = "Primaire" | "CEM" | "Lycée" | "ESI";
type ServiceType = "Individuel" | "Groupe";

interface FilterState {
  niveau: Level;
  annee: string;
  matiere: string;
  serviceType: ServiceType;
  rating: number;
  priceRange: [number, number];
  radius: number;
  city: string;
  lat: number | null;
  lng: number | null;
}

const defaultFilters: FilterState = {
  niveau: "Lycée",
  annee: "1AS",
  matiere: "",
  serviceType: "Individuel",
  rating: 4,
  priceRange: [1000, 3000],
  radius: 10,
  city: "",
  lat: null,
  lng: null,
};

const FilterScreen: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const [subjects, setSubjects] = useState<string[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const anneesParNiveau: Record<Level, string[]> = {
    Primaire: ["1AP", "2AP", "3AP", "4AP", "5AP"],
    CEM: ["1AM", "2AM", "3AM", "4AM"],
    Lycée: ["1AS", "2AS", "3AS"],
    ESI: ["1CP", "2CP", "1CS", "2CS", "3CS"],
  };

  // ✅ Fetch subjects safely
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);

        // Replace with real API later
        const data = [
          "Mathématiques",
          "Physique",
          "Sciences",
          "Anglais",
          "SFSD",
        ];

        setSubjects(data);

        // ✅ Safe update (no stale state)
        setFilters((prev) => {
          if (!data.includes(prev.matiere)) {
            return { ...prev, matiere: "" };
          }
          return prev;
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [filters.niveau, filters.annee]);

  // GPS
  const handleGetGPS = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "Active la localisation");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    setFilters((prev) => ({
      ...prev,
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      city: "Ma position actuelle",
    }));
  };

  const handleApply = () => {
    console.log("Filters:", filters);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Filtres</Text>

        {/* Niveau */}
        <Text style={styles.label}>Niveau d'étude</Text>
        <View style={styles.rowWrap}>
          {(Object.keys(anneesParNiveau) as Level[]).map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.chipBtn, filters.niveau === n && styles.activeBtn]}
              onPress={() =>
                setFilters((prev) => ({
                  ...prev,
                  niveau: n,
                  annee: anneesParNiveau[n][0],
                }))
              }
            >
              <Text
                style={[
                  styles.chipText,
                  filters.niveau === n && styles.activeText,
                ]}
              >
                {n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Année */}
        <Text style={styles.label}>Année d'étude</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {anneesParNiveau[filters.niveau].map((a) => (
            <TouchableOpacity
              key={a}
              onPress={() => setFilters((prev) => ({ ...prev, annee: a }))}
              style={[styles.yearChip, filters.annee === a && styles.activeBtn]}
            >
              <Text
                style={[
                  styles.yearText,
                  filters.annee === a && styles.activeText,
                ]}
              >
                {a}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Matière */}
        <Text style={styles.label}>Matière</Text>
        <View style={styles.inputBox}>
          <BookOpen size={20} color="#A855F7" style={{ marginRight: 10 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {loadingSubjects ? (
              <Text style={{ color: "#9CA3AF" }}>Chargement...</Text>
            ) : (
              subjects.map((subj) => (
                <TouchableOpacity
                  key={subj}
                  onPress={() =>
                    setFilters((prev) => ({ ...prev, matiere: subj }))
                  }
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor:
                      filters.matiere === subj ? "#A855F7" : "#F3E8FF",
                    borderRadius: 10,
                    marginRight: 8,
                  }}
                >
                  <Text
                    style={{
                      color: filters.matiere === subj ? "#FFF" : "#A855F7",
                      fontWeight: "600",
                    }}
                  >
                    {subj}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        {/* Service */}
        <Text style={styles.label}>Type de service</Text>
        <View style={styles.row}>
          {(["Individuel", "Groupe"] as ServiceType[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.typeBtn,
                filters.serviceType === t && styles.activeBtn,
              ]}
              onPress={() =>
                setFilters((prev) => ({ ...prev, serviceType: t }))
              }
            >
              <Users
                size={18}
                color={filters.serviceType === t ? "#FFF" : "#A855F7"}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.chipText,
                  filters.serviceType === t && styles.activeText,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location */}
        <Text style={styles.label}>Ville / Localisation</Text>
        <View style={styles.inputBox}>
          <Search size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
          <Text style={{ flex: 1 }}>{filters.city || "Alger, Oran..."}</Text>
          <TouchableOpacity onPress={handleGetGPS}>
            <Navigation
              size={22}
              color="#A855F7"
              fill={filters.lat ? "#A855F7" : "none"}
            />
          </TouchableOpacity>
        </View>

        {/* Radius */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 15,
          }}
        >
          <Text style={styles.labelSmall}>Rayon de recherche</Text>
          <Text style={[styles.labelSmall, { color: "#A855F7" }]}>
            {filters.radius} km
          </Text>
        </View>
        <View style={styles.sliderContainer}>
          <MultiSlider
            values={[filters.radius]}
            sliderLength={width - 50}
            onValuesChange={(v) =>
              setFilters((prev) => ({ ...prev, radius: v[0] }))
            }
            min={1}
            max={101}
            selectedStyle={{ backgroundColor: "#A855F7" }}
            markerStyle={styles.sliderMarker}
          />
        </View>

        {/* Rating */}
        <Text style={styles.label}>Évaluation minimale</Text>
        <View style={styles.ratingBox}>
          <View style={{ flexDirection: "row", gap: 5 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setFilters((prev) => ({ ...prev, rating: s }))}
              >
                <Star
                  size={24}
                  fill={s <= filters.rating ? "#FF9500" : "none"}
                  color={s <= filters.rating ? "#FF9500" : "#D1D5DB"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.subText}>Plus de {filters.rating} étoiles</Text>
        </View>

        {/* Budget */}
        <Text style={styles.label}>Budget (DA)</Text>
        <View style={styles.sliderContainer}>
          <MultiSlider
            values={filters.priceRange}
            sliderLength={width - 50}
            onValuesChange={(v) =>
              setFilters((prev) => ({
                ...prev,
                priceRange: v as [number, number],
              }))
            }
            min={500}
            max={10000}
            step={100}
            selectedStyle={{ backgroundColor: "#A855F7" }}
            markerStyle={styles.sliderMarker}
          />
          <View style={styles.priceLabels}>
            <Text style={styles.priceValue}>{filters.priceRange[0]} DA</Text>
            <Text style={styles.priceValue}>{filters.priceRange[1]} DA</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={() => setFilters(defaultFilters)}
          >
            <RotateCcw size={20} color="#A855F7" />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyText}>Apply Filter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 15,
    color: "#1F2937",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
    color: "#374151",
  },
  labelSmall: { fontSize: 14, fontWeight: "700", color: "#4B5563" },
  row: { flexDirection: "row", gap: 12 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  inputBox: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  flexInput: { flex: 1, fontSize: 15, color: "#000" },
  chipBtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#F3E8FF",
    borderRadius: 12,
    minWidth: 70,
    alignItems: "center",
  },
  yearChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    marginRight: 10,
  },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F3E8FF",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  activeBtn: { backgroundColor: "#A855F7" },
  activeText: { color: "#FFF", fontWeight: "bold" },
  chipText: { color: "#A855F7", fontWeight: "700" },
  yearText: { color: "#6B7280", fontWeight: "600" },
  ratingBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 15,
    borderRadius: 15,
  },
  subText: { color: "#9CA3AF", fontSize: 13, fontWeight: "600" },
  sliderContainer: { alignItems: "center" },
  sliderMarker: {
    backgroundColor: "#FFF",
    height: 26,
    width: 26,
    borderRadius: 13,
    borderWidth: 4,
    borderColor: "#A855F7",
    elevation: 3,
  },
  priceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
  },
  priceValue: { color: "#6B7280", fontWeight: "700" },
  footer: { flexDirection: "row", gap: 15, marginTop: 40 },
  applyBtn: {
    flex: 1.5,
    backgroundColor: "#A855F7",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    elevation: 6,
  },
  applyText: { color: "#FFF", fontWeight: "800", fontSize: 16 },
  resetBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#F3E8FF",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: { color: "#A855F7", fontWeight: "700" },
});

export default FilterScreen;
