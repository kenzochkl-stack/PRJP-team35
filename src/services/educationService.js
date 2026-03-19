import { API_BASE_URL } from "../api/config";
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