export default function useNotification(setNewPush){
    Pusher.logToConsole = false;

    let pusher = new Pusher('72f41397173889c67e4e', {
        cluster: 'us2'
    });

    let channel = pusher.subscribe('notification');

    channel.bind('notification', async function(data) {
        const options = {
            body: data.message.message,
            icon: "./icons/logo.png",
            vibrate: [200, 100, 200],
        };
        
        //Muestro la notificación con el mensaje
        const notification = new Notification('Cobranza',options);
        
        if(localStorage.getItem('pusher')!==null){
            let prev_data=JSON.parse(localStorage.getItem('pusher'));
            prev_data.push(data);
            localStorage.setItem('pusher',JSON.stringify(prev_data));
            setNewPush(JSON.parse(localStorage.getItem('pusher')));
        }else{
            localStorage.setItem('pusher',JSON.stringify([data]));
            setNewPush(JSON.parse(localStorage.getItem('pusher')));
        }

    });
}