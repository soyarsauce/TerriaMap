self.addEventListener("fetch", event => {
  console.log("got fetch url to", event.request.url, event.request);
  // Cache API responses
  if (
    event.request.method === "GET" &&
    // && event.request.headers.get("accept").indexOf("application/json") !== -1

    (event.request.url.indexOf("light_all") !== -1 ||
      event.request.url.indexOf("v1/assets/1/endpoint") !== -1 ||
      event.request.url.indexOf("csv") !== -1 ||
      event.request.url.indexOf("czml") !== -1 ||
      event.request.url.indexOf("serverconfig") !== -1 ||
      event.request.url.indexOf("proxyabledomains") !== -1 ||
      event.request.url.indexOf("svg") !== -1 ||
      event.request.url.indexOf("json") !== -1)
  ) {
    event.respondWith(
      caches.open("terria-ui-cache").then(cache => {
        // Use stale-while-revalidate fetch pattern (cache first, refetch fresh data)
        return cache.match(event.request).then(response => {
          const fetchPromise = fetch(event.request).then(networkRes => {
            if (!networkRes.status >= 400 && !networkRes.status < 600) {
              cache.put(event.request, networkRes.clone());
            }
            return networkRes;
          });
          return response || fetchPromise;
        });
      })
    );
  }
});
