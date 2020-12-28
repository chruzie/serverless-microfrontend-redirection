exports.handler = (event, context, callback) => {
    const response = event.Records[0].cf.response;
    const headers = response.headers;
    const request_headers = event.Records[0].cf.request.headers;

    //Set new headers 
    headers['strict-transport-security'] = [{
        key: 'Strict-Transport-Security', 
        value: 'max-age=63072000; includeSubdomains; preload'
    }]; 

    headers['content-security-policy'] = [{
        key: 'Content-Security-Policy', 
        value: "default-src data: 'unsafe-inline' blob: https://*.tiles.mapbox.com https://api.mapbox.com https://*.opendns.com https://*.mpac.ca https://*.munconnect.ca https://mpacconnect.ca; script-src 'self' data: blob: 'unsafe-inline' 'unsafe-eval' https://*.tiles.mapbox.com/ https://api.mapbox.com/ https://*.opendns.com https://*.mpac.ca https://*.munconnect.ca https://mpacconnect.ca https://maps.googleapis.com; child-src blob: https://*.tiles.mapbox.com https://api.mapbox.com https://*.opendns.com https://*.mpac.ca https://*.munconnect.ca https://mpacconnect.ca https://*.mpaclabs.ca https://mconnect.datafix.com; img-src data: blob: https://*.tiles.mapbox.com https://api.mapbox.com https://*.opendns.com https://*.mpac.ca https://*.munconnect.ca https://mpacconnect.ca https://s.gravatar.com https://*.wp.com https://maps.googleapis.com https://*.gstatic.com https://*.ggpht.com https://*.google.com; connect-src https://events.mapbox.com https://*.tiles.mapbox.com https://api.mapbox.com https://*.opendns.com https://*.mpac.ca https://*.munconnect.ca https://mpacconnect.ca; style-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://cdn.rawgit.com https://use.fontawesome.com https://*.tiles.mapbox.com https://*.munconnect.ca https://mpacconnect.ca https://api.mapbox.com; font-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.gstatic.com https://*.fontawesome.com https://*.munconnect.ca https://mpacconnect.ca data:"
    }]; 

    headers['x-content-type-options'] = [{
        key: 'X-Content-Type-Options', 
        value: 'nosniff'
    }];

    headers['x-frame-options'] = [{
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
    }];

    headers['x-xss-protection'] = [{
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    }];

    headers['referrer-policy'] = [{
        key: 'Referrer-Policy',
        value: 'no-referrer-when-downgrade'
    }];

    // headers['feature-policy'] = [{
    //     key: 'Feature-Policy', 
    //     value: 'same-origin'
    // }]; 

    headers['access-control-allow-origin'] = [{
        key: 'Access-Control-Allow-Origin',
        value: "assets.mconnect-dev.munconnect.ca"
    }];

    if ('origin' in request_headers) {
        const origin_value = request_headers['origin'][0]['value'];
        const regex = /https:\/\/.*\.(munconnect|mpac|mpacconnect|mpaconnect)\.ca/g; 

        if (origin_value.match(regex) != null) {
            headers['access-control-allow-origin'] = [{
                key: 'Access-Control-Allow-Origin',
                value: origin_value
            }];
        }
    }

    //Return modified response
    callback(null, response);
};