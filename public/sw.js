this.addEventListener('activate', function (event) {
});

self.addEventListener('push', async (event) => {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }
    const message = await event.data.json();
    let { title, description, icon } = message;

    const isVisible = await checkClientIsVisible();
    if(!isVisible){
    event.waitUntil(
        self.registration.showNotification(title, {
            body: description,
            icon,
        })
    )
    }

    async function checkClientIsVisible() {
        const windowClients = await clients.matchAll({
            type: "window",
            includeUncontrolled: true,
        });

        for (var i = 0; i < windowClients.length; i++) {
            if (windowClients[i].visibilityState === "visible") {
                return true;
            }
        }

        return false;
    }

    self.addEventListener('notificationclick', function (event) {
        event.notification.close();
        if (event.action === 'archive') {
        } else {
            clients.openWindow("http://localhost:3000/messenger");
        }
    }, false);

});
