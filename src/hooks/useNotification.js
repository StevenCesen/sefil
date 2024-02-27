export default function useNotification(){
    Pusher.logToConsole = false;

    let pusher = new Pusher('72f41397173889c67e4e', {
        cluster: 'us2'
    });

    let channel = pusher.subscribe('notification');

    channel.bind('notification', async function(data) {
        console.log(data)
        const options = {
            body: data.message.message,
            icon: "./icons/logo.png",
            vibrate: [200, 100, 200],
        };
        const notification = new Notification('Cobranza',options);
        // // new Audio("./notification.mp3").play();
        if(localStorage.getItem('pusher')!==null){
            let prev_data=JSON.parse(localStorage.getItem('pusher'));
            prev_data.push(data);
            localStorage.setItem('pusher',JSON.stringify(prev_data));
        }else{
            localStorage.setItem('pusher',JSON.stringify([data]));
        }

    });
}