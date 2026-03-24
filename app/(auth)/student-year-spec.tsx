import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../src/styles/colors";

export default function StudentSelection(){

const router=useRouter();
         // les états
     const [step, setStep] =useState<'YEAR' | 'SPECIALITY' >('YEAR');
     const [items, setItems] = useState<string []>([]);
     const [loading, setLoading]=useState(true);
     const [selection, setSelection]=useState({year:'',speciality:''});
      

     useEffect(()=>{

        if(step== 'YEAR' && selection.year !== '' && selection.year !== '2CS'){
            return;
        }

         const fetchLevelData = async ()=> {
            setLoading(true);
            try{
                const testIP='192.168.43.108';
                let url="";
                if(step==='YEAR'){
                    //Récuperer les années
                    url=`http://${testIP}:3000/api/specialties/levels?cycle=ESI`;
                }else{
                    url=`http://${testIP}:3000/api/specialties/list?year=${selection.year}`;
                }
                if(url){
                    const response =await fetch(url);
                    const json= await response.json();
            
                   let dataToSet=step === 'YEAR' ? json.years : (json.specialties || json.speciality || json.data);
                   if(dataToSet && Array.isArray(dataToSet)){
                    if(step==='YEAR'){
                        const customOrder = ["1CP", "2CP", "1CS", "2CS"];
                        //le trie des années par ordre
                        const sortedYears=[...dataToSet].sort((a, b)=>{
                            return customOrder.indexOf(a)- customOrder.indexOf(b);
                        });
                        setItems(sortedYears);
                    }else{
                        //le trie alphabetique des specialities
                        setItems([...dataToSet].sort());
                    }
                   } else{
                    setItems([]);
                   }
                }

        
            }catch(error){
                console.error("Erreur lors de la récupération : ",error);
                
            }finally{
                setLoading(false);
            }
         };
           fetchLevelData();
     },[step,selection.year]);
      

    // Gestion de click

                const handlePress = (value:string)=>{
                   if(step ==='YEAR'){
                        setSelection(prev=>({...prev,year:value}));
                        setTimeout(() => { 
                        if(value==='2CS'){
                            setStep('SPECIALITY');
                        }else{
                            router.push({pathname:"/(auth)/student-image", params :{year:value}})
                        }
                        }, 100);

                   }else{
                    setSelection(prev=>({...prev,speciality:value}));
                    setTimeout(() => {
                    router.push({
                        pathname :"/(auth)/student-image",
                        params :{year:selection.year,speciality:value}
                    });
                    }, 100);
                   }

                };


          return(

               <View style={styles.container}>
                      {/* BOUTON BACK */}
                        <TouchableOpacity onPress={() => step === 'SPECIALITY' ? setStep('YEAR') : router.back()}
                         style={styles.backButton}>  
                        <Text style={styles.backText}>← Retour</Text>
                        </TouchableOpacity>

                         <View style={styles.content}>
                                 <Text style={styles.title}>
                                    {step=== 'YEAR' ? "Vous êtes en quelle année ?" : "Quelle est votre spécialité?"}</Text>

                           { loading ?(
                            <ActivityIndicator size="large" color={COLORS.primary}/>
                           ):(
                            <View style={styles.list}>
                                {items.map((item)=>{
                                    const isSelected = step ==='YEAR' ? selection.year === item :selection.speciality===item;
                                    return(
                                    <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.card,
                                        isSelected && {backgroundColor : '#D785FF' , borderColor : '#D785FF'}
                                    ]}

                                    
                                    onPress={()=> handlePress(item)}
                                    activeOpacity={0.7}
                                    >
                                        <Text style={styles.cardText}>{item}</Text>
                                    </TouchableOpacity>

                                );
                            })}
                            </View>
                          )} 
                           </View>
                           </View>         
          );   
  }
 

  // ******************+++STYLES+++*************
    const styles = StyleSheet.create ({
         container:{
                 flex: 1,
                 backgroundColor: "#fff",
                 paddingHorizontal: 34,
                 paddingTop: 20,
         } ,

         backButton:{
                 marginBottom: 20,
          },

         backText:{ 
              color: COLORS.background,
             fontSize:16,
            fontWeight: "500",

         },

         content:{
            flex:1,
           justifyContent:"center",
          marginTop:-80,

         },
         title:{
               fontSize: 25,
               fontWeight: "bold",
                textAlign: "center",
                marginBottom: 104,
                color: COLORS.text, 

         },
         list:{
             gap:37,

         },
         card:{
             height:60,
             borderRadius:12,
            borderWidth:1,
            borderColor: COLORS.border,
            justifyContent: "center",
           alignItems: "center",
           backgroundColor:COLORS.primary,
        

         },
         cardText:{
            fontSize: 16,
            color: COLORS.background,

         }, 

    });