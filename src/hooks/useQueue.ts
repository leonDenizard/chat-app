import { supabase } from "@/lib/supabse";

export default function useQueue(){

    const loadQueue = async(setList) => {
        
        const { data, error } = await supabase
            .from("queue")
            .select("*")
            .order("joined_at", { ascending: true });

        
        if(error){
            console.log("erro ao carregar fila", error)
        }

        setList(data || []);
        console.log(setList)
    }

    

    return { loadQueue }
}