import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../src/styles/colors";

type SelectedFile={
    name : string,
    size : number,
    uri : string,

};


export default function ProfCv() {
const router = useRouter();

const [selectedFiles , setSelectedFiles] = useState<SelectedFile[]>([]);// liste pour stocker les fichiers
const params = useLocalSearchParams();// recuperer les donnees envoyées

 useEffect(()=>{
     if(params.externalFileUri){
        const newFile:SelectedFile = {
            name:(params.externalFileName as string) || "Documents",
            size:Number(params.externalFileSize)|| 0,
            uri:params.externalFileUri as string,
        };
        setSelectedFiles(prev => {
            const exists=prev.find(f => f.uri === newFile.uri);
            if(exists) return prev;
            return [...prev,newFile];

        });
        
     }



 },[params.externalFileUti]);




const handlePickDocument = async () =>{
 try{
    const result = await DocumentPicker.getDocumentAsync({
  type : 'application/pdf',
  copyToCacheDirectory:true,

    });
    if(!result.canceled && result.assets && result.assets.length > 0){
        const file = result.assets[0];
        const newFile:SelectedFile={
            name : file.name,
            size : file.size || 0,
            uri : file.uri ,

        };
        setSelectedFiles(prev => [...prev,newFile]);
    }

 }catch (err){
    console.error("error lors de la sélection du document: ", err);
    Alert.alert("Erreur","Impossible de sélectionner le document.");
 }

};

// supprimer un document
const removeFile = (uriToRemove:string)=>{
    setSelectedFiles(prev=>prev.filter(file => file.uri !== uriToRemove));
};

const formatFileSize = (size : number): string =>{
if(size===0) return '0 B';
const K=1024;
const sizes = ['B' , 'KB' , 'MB' , 'GB'];
const i = Math.floor(Math.log(size)/Math.log(K));
return parseFloat((size / Math.pow(K, i)).toFixed(1)) + ' ' + sizes[i];

};

return(
         <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.back}>
                          <Image style={styles.backIcon} source={require('../../assets/icons/chevron_backward2.png')} />  
                        </TouchableOpacity>
              <Text style={styles.headerTitle}>Cv et diplômes</Text>
              <View style={styles.uploadContainer}>
                <View style={styles.topSection}>
                    <Text style={styles.instructionText}>Téléversez votre CV ou  votre résumé/diplôme</Text>
                </View>
                <View style={styles.middleSection}>
                    {selectedFiles.length>0 && (
                   <FlatList
                    data={selectedFiles}
                    keyExtractor={(item)=> item.uri}
                    renderItem={({item})=>(
                        <View style={styles.fileCard}>
                        <Image 
                        source={require("../../assets/images/pdf.png")}
                        style={styles.pdfIcon}
                        />
                        <View style={styles.fileInfo}>
                        <Text style={styles.fileName} numberOfLines={1}>
                        {item.name}
                        </Text>
                        <Text style={styles.fileSize}>
                        {formatFileSize(item.size)}
                        </Text>
                        </View>
                        <TouchableOpacity onPress={()=> removeFile(item.uri)}
                            style={styles.deleteButton}
                            >
                        <Ionicons name="close-circle" size={22} color="#888"/>
                        </TouchableOpacity>
                        </View>
 
                    )}
                   showsVerticalScrollIndicator={false}
                    />

                )}
                    </View>
                <TouchableOpacity
                style={styles.addButton}
                onPress={handlePickDocument}
                >
                    <Text style={styles.addText}>Ajouter</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
               style={styles.continueButton}
               onPress={()=>{
                router.push("/(teacher)/dashboard" as any );

               }}
               >
                <Text style={styles.continueButtonText}>Continuer</Text>          
                  </TouchableOpacity>
                  </View>
                  );
                }

                 const styles = StyleSheet.create ({
                    container:{
                     flex:1,
                     backgroundColor:'#FFFFFF',
                     paddingHorizontal:25,
                     paddingTop:80,
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
              
                 headerTitle:{
                    fontSize:25,
                    fontWeight:700,
                    color:COLORS.text,
                    marginBottom:40,
                    marginTop:50,
                    textAlign: 'center',

                 },
                 uploadContainer:{
                     width: 327,
                     height: 315, 
                     borderWidth: 2,            
                     borderColor: COLORS.gray,    
                     borderStyle: 'dashed',     
                     borderRadius: 20,          
                     padding: 25,            
                     alignItems: 'center',
                      backgroundColor: COLORS.background,
                      marginTop:50,
                      alignSelf: 'center',
                      justifyContent: 'space-between',
                      

                 },
                 topSection: {
                    height: 60, 
                     justifyContent: 'center',
                      alignItems: 'center',
                     },

                middleSection: {
                   flex: 1, 
                    width: '100%',
                    marginVertical: 10, 
                   },

                 bottomSection: {
                height: 50, 
                  justifyContent: 'center',
                   alignItems: 'center',
                    },
                 instructionText:{
                    fontSize:16,
                    color: '#A0A0A0',          
                    textAlign: 'center',       
                   marginBottom: 10,
                  lineHeight: 20,
                 },
                fileCard: {
                flexDirection: 'row',
                  alignItems: 'center',
                 backgroundColor: '#F1F5F9', 
                  borderRadius: 16,         
                  padding: 12,              
                   marginBottom: 15,
                   width: '100%',
                   height:60,
                   borderWidth: 1,
                      borderColor: '#E2E8F0',
                },
                 pdfIcon: {
                   width: 32,                 
                    height: 32,                
                     marginRight: 12, 
                     resizeMode: 'contain',          
                 },
                fileName: {
                    fontWeight: '600',         
                    color: '#333',
                },
                addText: {
                      color: COLORS.primary,     
                       fontSize: 18,             
                        fontWeight: '600',
                 },
                continueButton: {
                     backgroundColor: COLORS.primary, 
                     width: '100%',
                    height: 60,               
                      borderRadius: 15,          
                      justifyContent: 'center',
                       alignItems: 'center',
                       marginTop: 60, 
                       marginBottom:20,        
                    },
               continueButtonText: {
                      color: '#FFFFFF',        
                      fontSize: 18,
                       fontWeight: '600',
                         },
            fileInfo: {
                           flex: 1,               
                           justifyContent: 'center',
                           marginLeft: 10, 
                           marginRight:10,  
            },     
                 fileSize: {
                     fontSize: 12,          
                     color: '#888888',      
                     marginTop: 2,         
                 },
                 addButton: {
            
                   paddingVertical: 10,    
                   alignItems: 'center',
                   justifyContent: 'center',
                 },
                 deleteButton:{
                    width:45,
                    height:45,
                    justifyContent:'center',
                    borderRadius:16,
                     marginLeft:20,
                     padding:8,
                 }

        });



                 

                









