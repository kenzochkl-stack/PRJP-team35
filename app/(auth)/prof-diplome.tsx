import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from "expo-router";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../src/styles/colors";
export default function ProfDiplome() {
const router = useRouter();
  const handlePickDocument = async () => {
    try{
        const result = await DocumentPicker.getDocumentAsync({
            type :"application/pdf",
            copyToCacheDirectory: true,
        }) ;
       
       if(! result.canceled && result.assets && result.assets.length>0){
        const file =result.assets[0];
        console.log("fichier sélectionné: " , file.name);
       router.push({
         pathname: "/(auth)/prof-cv" as any,
         params: {
            fileName:file.name,
             externalFileUri:file.uri,
             externalFileName:file.name,
             externalFileSize:file.size || 0 , 

          }
        });
       }
    
    } catch (error){
      Alert.alert("Error","Impossible de récupérer le document.");
      console.error(error);

  } 
};

return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.back}>
                  <Image style={styles.backIcon} source={require('../../assets/icons/chevron_backward2.png')} />  
            </TouchableOpacity>
           <View style= {styles.content}>
            <TouchableOpacity style={styles.imageClickableZone}
              onPress={handlePickDocument}  
              >
                 <Image 
                             source={require("../../assets/images/ajouter-doc.png")}
                             style={styles.fullFigmaImage}
                             resizeMode="contain"
                            
                             />
             </TouchableOpacity>
             <Text style={styles.title}>Ajouter un diplome</Text>
            </View>
            </View>
            );
        
    }


        const styles = StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: "#fff",
                justifyContent: "center", 
                alignItems: "center",     
            },
             back: {
                position:'absolute',
                   top: 50,
                   left:25,
                   width: 45,
                   height:45,
                   borderWidth: 1,
                    borderStyle: "solid",
                   justifyContent: "center",
                  alignItems:"center",
                  borderRadius: 10,
                   borderColor: "#D8DADC",
                   zIndex:10,
                     },

               backIcon: {
                width:20,
               height:30
                },
            content :{
                alignItems:"center",
                width:"100%",
                paddingHorizontal:20,
            },
             imageClickableZone:{
                
                marginTop:130,
               marginBottom:40,

            },
            fullFigmaImage:{
                width:270,
                height:270,
            },
            title:{
            fontSize:26,
            fontWeight:"semibold",
            color:COLORS.text,
            marginBottom:181,
            },
            ignoreButton:{
                position: "absolute",
                bottom:95,
                marginTop:0,
            },
            ignoreText:{
                color:COLORS.primary,
                fontSize:20,
               fontWeight: "500",
            },
        });


            


        

