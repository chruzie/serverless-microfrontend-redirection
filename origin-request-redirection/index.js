exports.handler = (event, context, callback) => {

  // Get the request object.
  const request = event.Records[0].cf.request;

  // Get the host from the request and take out "www." from the host if it exists.
  let host = request.headers.host[0].value;
  host = host.replace(/^www\./, "");
  // Check if the host contains a subdomain.
  // Eg. support.example.com <-- true
  // Eg. example.com <-- false

  // If it has a subdomain, get the path to the directory where the React app's static files are stored based on the subdomain's identifier (marketing, support, portal).
  // If it doesn't have a subdomain, there will be no need for a  path because the static files will be at the root of the bucket, so return an empty string.
  const subdomainPattern = /^[a-z0-9]+\.dev\.dns\.ca$/;
  const dir = subdomainPattern.test(host) ? host.split(".")[0] : undefined;
  const entryPoint = dir ? `/apps/${dir}` : "";

  // Declare the website endpoint of your Custom Origin.
  // website domain ->dns.s3-website.ca-central-1.amazonaws.com

  const domain = "bucketname.s3.amazonaws.com";

  // Instruct to send the request to the S3 bucket, specifying for it to look for content within the sub-directory or at the root.
  // The key here is the 'path' property. It specifies the entry point.  It does not affect the request URI (eg. /login).
  request.origin = {
    s3: {
      domainName: domain,
      region: "ca-central-1",
      port: 443,
      protocol: "https",
      authMethod: "origin-access-identity",
      path: "/dev" + entryPoint,
      sslProtocols: ["TLSv1.2"],
      readTimeout: 5,
      keepaliveTimeout: 5
    }
  };
  // Change the host in the request headers to match the S3 bucket's website endpoint.
  request.headers["host"] = [{ key: "host", value: domain }];

  //since we are using S3 REST API endpoint instead of bucket endpoint we need to add index.html to the URI if the URI ends in a slash
  //S3 website endpoints will do this by default but the REST API endpoint will not

  // Extract the request from the CloudFront event that is sent to Lambda@Edge 
  //var request = event.Records[0].cf.request;

  // Extract the URI from the request
  var olduri = request.uri;

  // Match any '/' that occurs at the end of a URI. Replace it with a default index
  var newuri = olduri.replace(/\/$/, '\/index.html');
  
  // Log the URI as received by CloudFront and the new URI to be used to fetch from origin
  console.log("Old URI: " + olduri);
  console.log("New URI: " + newuri);
  
  // Replace the received URI with the URI that includes the index page
  request.uri = newuri;
  
  callback(null, request);
};

