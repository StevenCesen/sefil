export default function useReceiveState(update){
    try {
        const conn = new WebSocket('wss://check.sefil.com.ec/ws');
    
        conn.onopen = function(e) {
            console.log("Connection established!");
        };
        
        conn.onmessage = function(e) {
            const data=JSON.parse(e.data);
            update(data.data);
        };

        

    } catch (error) {
        console.log(error);
    }
}