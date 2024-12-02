export default function useReceiveState(update){
    Pusher.logToConsole = true;

    let pusher = new Pusher('72f41397173889c67e4e', {
        cluster: 'us2'
    });

    let channel = pusher.subscribe('state');

    channel.bind('state', async function(data) {
        update(data.message.data);
        console.log(data.message.data);
    });
}