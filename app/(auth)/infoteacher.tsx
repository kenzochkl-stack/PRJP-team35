import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; 
import { COLORS } from '@/src/styles/colors';

const { width } = Dimensions.get('window');
const scale = (size: number) => (width / 412) * size;

export default function InfoTeacher() {
  const router = useRouter();
  const previousParams = useLocalSearchParams(); 
  const serverIP = "192.168.100.5"; 

  const [selectedNature, setSelectedNature] = useState<string | null>(null);
  const [selectedModalite, setSelectedModalite] = useState<string | null>(null);
  const [selectedDeplacement, setSelectedDeplacement] = useState<string | null>(null);

  const [wilayas, setWilayas] = useState<string[]>([]);
  const [communes, setCommunes] = useState<string[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState<string | null>(null);
  const [selectedCommune, setSelectedCommune] = useState<string | null>(null);
  
  const [wilayaOpen, setWilayaOpen] = useState(false);
  const [communeOpen, setCommuneOpen] = useState(false);
  const [loadingLoc, setLoadingLoc] = useState(false);

  const groupNature = ["Independent", "Etablissement", "Centre"]; 
  const groupModalite = ["En ligne", "Présentiel", "Hybride"];
  const groupDeplacement = ["Oui", "Non"];

  useEffect(() => {
    fetch(`http://${serverIP}:3000/api/location/willaya`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.wilayas) setWilayas(data.wilayas);
      })
      .catch(err => console.log("Erreur Wilayas:", err));
  }, []);

  useEffect(() => {
    if (selectedWilaya) {
      setLoadingLoc(true);
      fetch(`http://${serverIP}:3000/api/location/commune?wilaya=${selectedWilaya}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success' && data.communes) setCommunes(data.communes);
          setLoadingLoc(false);
        })
        .catch(err => {
          console.log("Erreur Communes:", err);
          setLoadingLoc(false);
        });
    }
  }, [selectedWilaya]);

  const OptionButton = ({ label, selectedValue, onSelect }: any) => {
    const isSelected = selectedValue === label;
    return (
      <Pressable
        onPress={() => onSelect(label)}
        style={[styles.optionButton, { 
            backgroundColor: isSelected ? COLORS.secondary : '#FFF',
            borderColor: COLORS.primary 
        }]}
      >
        <Text style={[styles.optionText, { color: isSelected ? '#000' : COLORS.primary }]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="always"
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Image style={styles.backIcon} source={require("../../assets/icons/chevron_backward2.png")} />
        </TouchableOpacity>

        <Text style={styles.title}>Encore quelques informations...</Text>

        <Text style={styles.sectionTitle}>Nature</Text>
        <View style={styles.row}>
          {groupNature.map((item) => (
            <OptionButton key={item} label={item} selectedValue={selectedNature} onSelect={setSelectedNature} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Modalité enseignement</Text>
        <View style={styles.row}>
          {groupModalite.map((item) => (
            <OptionButton key={item} label={item} selectedValue={selectedModalite} onSelect={setSelectedModalite} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Déplacement</Text>
        <View style={[styles.row, { justifyContent: 'center', gap: scale(20) }]}>
          {groupDeplacement.map((item) => (
            <OptionButton key={item} label={item} selectedValue={selectedDeplacement} onSelect={setSelectedDeplacement} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Localisation</Text>

        {/* WILAYA */}
        <Text style={styles.inputLabel}>Wilaya</Text>
        <View style={{ zIndex: 5000 }}> 
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => { setWilayaOpen(!wilayaOpen); setCommuneOpen(false); }}
          >
            <View style={styles.innerInput}>
              <Text style={{ color: selectedWilaya ? '#000' : '#999' }}>
                {selectedWilaya || "Sélectionner..."}
              </Text>
              <Image source={require('../../assets/images/arrowbas.png')} style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>

          {wilayaOpen && (
            <View style={styles.dropdown}>
              <ScrollView style={{ maxHeight: scale(200) }} nestedScrollEnabled keyboardShouldPersistTaps="always">
                {wilayas.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.optionItem} 
                    onPress={() => {
                      setSelectedWilaya(item);
                      setSelectedCommune(null);
                      setWilayaOpen(false);
                    }}
                  >
                    <Text style={styles.optionTextDropdown}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* COMMUNE */}
        <Text style={styles.inputLabel}>Commune</Text>
        <View style={{ zIndex: 4000 }}> 
          <TouchableOpacity 
             style={[styles.input, !selectedWilaya && {backgroundColor: '#f5f5f5'}]} 
             onPress={() => selectedWilaya && setCommuneOpen(!communeOpen)}
             disabled={!selectedWilaya}
          >
            <View style={styles.innerInput}>
              {loadingLoc ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={{ color: selectedCommune ? '#000' : '#999' }}>{selectedCommune || "Sélectionner..."}</Text>
              )}
              <Image source={require('../../assets/images/arrowbas.png')} style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>

          {communeOpen && (
            <View style={styles.dropdown}>
              <ScrollView style={{ maxHeight: scale(200) }} nestedScrollEnabled keyboardShouldPersistTaps="always">
                {communes.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.optionItem} 
                    onPress={() => { 
                      setSelectedCommune(item); 
                      setCommuneOpen(false); 
                    }}
                  >
                    <Text style={styles.optionTextDropdown}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* NEXT*/}
        <View style={{ zIndex: 1000 }}>
            <TouchableOpacity 
            style={[
                styles.nextArrow, 
                (!selectedNature || !selectedModalite || !selectedDeplacement || !selectedWilaya || !selectedCommune) && { opacity: 0.5 }
            ]} 
            onPress={() => {
                if (!selectedNature || !selectedModalite || !selectedDeplacement || !selectedWilaya || !selectedCommune) {
                Alert.alert("Formulaire incomplet", "Veuillez remplir toutes les informations.");
                return;
                }
                router.push({
                pathname: "/(auth)/descteacher",
                params: { ...previousParams, nature: selectedNature, modalite: selectedModalite, deplacement: selectedDeplacement, wilaya: selectedWilaya, commune: selectedCommune }
                });
            }}
            >
            <Image style={styles.nextIcon} source={require("../../assets/images/arrow.png")} />
            </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: scale(20) 
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
    width: 18, 
    height: 25 
  },

  title: { 
    marginTop: scale(20), 
    fontWeight: 'bold', 
    fontSize: scale(24), 
    textAlign: 'center' 
  },

  sectionTitle: { 
    textAlign: 'center', 
    fontSize: scale(16), 
    marginBottom: scale(15), 
    marginTop: scale(25), 
    fontWeight: '600' 
  },

  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: scale(10) 
  },

  optionButton: { 
    height: scale(45), 
    width: scale(110), 
    borderRadius: scale(12), 
    borderWidth: 1.5, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  optionText: { 
    fontSize: scale(12), 
    fontWeight: '700' 
  },

  inputLabel: { 
    fontSize: scale(14), 
    fontWeight: '600', 
    marginBottom: scale(5), 
    marginTop: scale(15) 
  },

  input: { 
    borderWidth: 1, 
    borderColor: '#D8DADC', 
    borderRadius: 12, 
    height: scale(50), 
    paddingHorizontal: 15, 
    justifyContent: 'center', 
    backgroundColor: '#FFF' 
  },

  innerInput: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },

  arrowIcon: { 
    width: 15, 
    height: 15, 
    tintColor: '#999' 
  },

  dropdown: { 
    position: 'absolute', 
    top: scale(55), 
    left: 0, 
    right: 0, 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: '#D8DADC', 
    borderRadius: 12, 
    zIndex: 9999, 
    elevation: 5, 
    maxHeight: scale(200), 
    overflow: 'hidden' 
  },

  optionItem: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderColor: "#F0F0F0" 
  },

  optionTextDropdown: { 
    color: '#000', 
    fontSize: 14 
  },

  nextArrow: { 
    alignSelf: 'flex-end', 
    marginTop: scale(40), 
    width: scale(60), 
    height: scale(60), 
    backgroundColor: '#9F54F8', 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  nextIcon: { 
    width: 25, 
    height: 25, 
    tintColor: '#FFF' 
  },
});