async function initializeNotifications() {
    await Notification.requestPermission()
}

async function displayNotification(todo) {
   if(Notification.permission==="granted"){
      const registration= await navigator.serviceWorker.getRegistration()
      const options={
          body:"You have completed the todo"+todo.text,
          icon: './summary-icon.png',
          vibrate: [100,100,100], //mobile vibration
          data: {todo},
          actions:[{action:'Close',title:'Close'},
                   {action:'delete',title:'remove from list'}]
      }
      registration.showNotification('You have completed the todo',options)
   }
  
}

export { displayNotification, initializeNotifications };
