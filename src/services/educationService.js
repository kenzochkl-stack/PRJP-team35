import { API_BASE_URL } from "../api/config";

// Récuperer les années 
 export const fetchLevels = async ()=> {
   
         const response = await fetch (`${API_BASE_URL}/specialities/levels?cycle=ESI`);
         const json=await response.json();
         return json.years;
          
    };
// Récuperer les spécialities de 2CS 
 export const fetchSpecialitiesByLevel = async ()=>{
        const response = await fetch (`${API_BASE_URL}/specialities/list?year=2CS`);
         const json=await response.json();
         return json.specialities;


 }

 





export const fetchEducationData = async () => {
    try{
  const response = await fetch(`${API_BASE_URL}/education`); // Route Get /api/education
  if(!response.ok) throw new Error ("Erreur de connexion au serveur");
  return await response.json();
      }catch (error){
        console.error("Erreur:",error);
        return [];
      }
};