window.addEventListener('load', function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').then(
            function (registration) {
                console.log(
                    'ServiceWorker registered with scope: ',
                    registration.scope
                );
            },
            function (err) {
                console.log('ServiceWorker failed: ', err);
            }
        );
    }
});
