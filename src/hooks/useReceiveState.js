export default function useReceiveState(update){
    // Pusher.logToConsole = true;

    // let pusher = new Pusher('72f41397173889c67e4e', {
    //     cluster: 'us2'
    // });

    // let channel = pusher.subscribe('state');

    // channel.bind('state', async function(data) {
    //     update(data.message.data);
    // });

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