let installPrompt; // the event object which prompts the user to install
const TODO_LIST = 'TODO_LIST';

let onInstallAvailable;


export function getTodoList() {
    return JSON.parse(localStorage.getItem(TODO_LIST)) ?? [];
}

export function saveToDoList(list) {
    localStorage.setItem(TODO_LIST, JSON.stringify(list))
}

export async function syncTodos(afterSync) {
    try {
        await fetch('http://localhost/api/to-dos', {
            method: 'PUT',
            body: getTodoList(),
        });

        afterSync();
    } catch (error) {
        console.error('Unable to sync todos!');
    }
}

export async function installPwa() {
    installPrompt?.prompt();
}

export function setupPwaInstallation() {
    // TO DO :)
    // hint: you are looking for the 'beforeinstallprompt' event
    window.addEventListener("beforeinstallprompt",(e)=>{
        e.preventDefault()
        installPrompt=e
        if(e && onInstallAvailable){
           onInstallAvailable()
        }
    })
}

export function onPwaInstallAvailable(func) {
    onInstallAvailable = func;
}

export function onServiceWorkerMessage(handler) {
    navigator.serviceWorker.onmessage=handler;

}

export function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


export async function initPushNotifications() {
    await navigator.serviceWorker.ready;

    const reg = await navigator.serviceWorker.getRegistration();
    const existingSubs = await reg.pushManager.getSubscription();
    
    if (existingSubs === null) {
        console.log('Not subscribed to push service!');
        await subscribeToBrowsersPushService(reg);
    } else {
        console.log('Subscription object already exists, unsubscribing');
        await existingSubs.unsubscribe();
        await subscribeToBrowsersPushService(reg);
    }
}

async function subscribeToBrowsersPushService(serviceWorkerRegistration) {
    const publicKey = 'BDG1tOzmAsSP6FVq4s_qEjnT0LkfN64MXgnWxHDYLQ713r7TkcyOHMkPNMPSnm-H3vYntZbG27PV0IInp1sHbZQ';
    const applicationServerKey = urlB64ToUint8Array(publicKey);
    const subscription = await serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });
    console.log('subscription:', subscription);
}

