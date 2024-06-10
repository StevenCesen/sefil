export default function useReceiveState(){
    Pusher.logToConsole = true;

    let pusher = new Pusher('72f41397173889c67e4e', {
        cluster: 'us2'
    });

    let channel = pusher.subscribe('state');

    channel.bind('state', async function(data) {
        const options = {
            body: data.message.message,
            icon: "./icons/logo.png",
            vibrate: [200, 100, 200],
        };
        
        //Muestro la notificación con el mensaje
        const notification = new Notification('Actividad agentes',options);
        console.log(data);
    });
}