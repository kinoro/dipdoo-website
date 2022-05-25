// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    authUrl: "https://localhost:5101/api/auth",  
    baseUrl: "https://localhost:5001/api",
    awsUrl: "http://s3.eu-west-2.amazonaws.com/ponderegg-images-dev",
    //authUrl: "https://auth.ponderegg.com/api/auth",
    //baseUrl: "https://api.ponderegg.com/api",
    //awsUrl: "https://s3.eu-west-2.amazonaws.com/ponderegg-images",
    useTestData: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
