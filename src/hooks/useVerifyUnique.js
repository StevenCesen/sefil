export default function useVerifyUnique({id_credit,agent_id,data_self,mode}){
    if(mode===1){
        let count=0;

        data_self.map((credito)=>{
            if(credito.id===id_credit){
                count++;
            }
        });

        if(count===0){
            return [true,"No esta asignado"];
        }else{
            return [false,"Ya se encuentra asignado"];
        }

    }else{
        let count=0;

        data_self.map((data_agent)=>{
            data_agent.map((credito)=>{
                if(credito.id===id_credit){
                    count++;
                }
            });
        });

        if(count===0){
            return [true,"No esta asignado"];
        }else{
            return [false,"Ya se encuentra asignado a otro agente"];
        }
    }
}