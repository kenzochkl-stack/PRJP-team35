import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../../src/styles/colors";
const { width } = Dimensions.get("window");

const slides = [
  { id: "1", image: require("../../assets/images/onboard1.png") },
  { id: "2", image: require("../../assets/images/onboard2.png") },
  { id: "3", image: require("../../assets/images/onboard3.png") },
];

export default function SignupSlides() {

  const router = useRouter();
  const flatRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    if (index < slides.length - 1) {
      flatRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      router.replace("/(auth)/signup-contact");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

      <FlatList
        
        ref={flatRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <View
            style={{
              width:width,
              paddingTop:130,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={item.image}
              style={{ width: width, height: 300 }}
              resizeMode="contain"
            />

           


          </View>
        )}
      />

{/* dots */}
      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              margin: 5,
              marginTop: 40,
              backgroundColor: i === index ? "#8B5CF6" : "#D1D5DB",
            }}
          />
        ))}
      </View>


<Text style={{ marginTop: 40, fontSize: 24 ,textAlign: "center",fontWeight: "800", width: width, textOverflow: "wrap", paddingHorizontal: 30, marginBottom: 60}}>
              trouvez le prof qui vous{" "}
              <Text style={{ color: "#8B5CF6", fontWeight: "800" }}>
                match!
              </Text>
            </Text>
      
 
      
      <TouchableOpacity
        onPress={nextSlide}
        style={{
          marginHorizontal: 40,
          marginBottom: 40,
          backgroundColor: "#E9D5FF",
          padding: 16,
          borderRadius: 12,
          alignItems: "center",
          borderColor: COLORS.primary,
          borderWidth: 1
        }}
      >
        <Image source={require("../../assets/icons/swipe-arrow.png")} style={{height:21,width:25}}/>
      </TouchableOpacity>

    </View>
  );
}