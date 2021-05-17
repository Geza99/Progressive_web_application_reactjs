console.log('Service worker script running!');

async function putInCache(req, resp) {
    const cache = await caches.open('my-cache');
    await cache.put(req, resp.clone());
    return resp;
}

async function handleFetchEvent(event, strategy = 'network-first') {
    const req = event.request;

    if (strategy === 'cache-first') {
        const resp = await caches.match(req);
        if (resp) {
            console.log('responding with cache object immidiately');
            return resp;
        } else {
            console.log('item not found in cache, fetching');
            const resp = await fetch(req);
            await putInCache(req, resp);
            return resp;
        }
    } else {
        try {
            // console.log('fetching immidiately');
            const resp = await fetch(req);
            await putInCache(req, resp);
            return resp;
        } catch (error) {
            console.log('responding with cache object, as the network was unable to serve the request');
            return await caches.match(req);
        }
    }
}

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('I was activated! Claiming all clients');

    event.waitUntil(
        clients.claim().then(() => {
            console.log('All clients claimed');
        })
    );
});

self.addEventListener('fetch', event => {
    // console.log(`Intercepted fetch call for ${event.request.url}`);

    if (!event.request.url.includes('/api/to-do')) {
        event.respondWith(
            handleFetchEvent(event)
        );
    }
});

self.addEventListener('notificationclick', function (e) {
    const {notification,action}=e;
    switch(action){
        case 'close':
            notification.close();
            break;
        case 'delete':
            e.waitUntil(sendDeleteRequest(notification.data.todo.id));
            break;
        default: 
            clients.openWindow('http://localhost:3000');
            break;


    }
});

self.addEventListener('push', function (e) {

});


/**
 * Send a message to the app, that the todo with the given id should be deleted
 */
async function sendDeleteRequest(id) {
    // TO DO :)
    const clientList= await clients.matchAll({includeUntracked: true});
    if(clientList.length>0){
        clientList[0].postMessage({
            deleteId: id,
        });
    }
}

console.log('Service worker script end!!');
