require("dotenv").config();
export const envVariables = {
  baseUrl: process.env.baseUrl || "http://localhost:5959",
  port: process.env.PORT || 5959,
  connectString:
    process.env.CONNSTR ||
    "mongodb://localhost:27017/doantn?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
  jwtSecret: process.env.JWTSERCRET || "doanphanmem",
  // googleClientId:
  //   process.env.clientId ||
  //   "40792845616-i0phd247ebg64f68q17f8vo055c9nk9r.apps.googleusercontent.com",
  // googleClientSecret: process.env.clientSecret || "PpcvPGaH7kc78NneAOfaOoNq",
  // perPage: 9 || process.env.perPage,
  cloud_name: process.env.CLOUD_NAME || "dso1324ml",
  api_key_cloud: process.env.API_KEY_CLOUD || 498391132759548,
  api_secret_cloud:
    process.env.API_SECRET_CLOUD || "sNr0pHZvbEQu4ozBF5yFBuZJJBw",
  nodeEnv: process.env.NODE_ENV || "development",
  // nodemailerEmail: process.env.nodemailerEmail || "dacnpm17n2@gmail.com",
  // nodemailerPassword: process.env.nodemailerPassword || "qweQWE!@#",
  // API_GOOGLEMAP_KEY:
  //   process.env.api_googlemap_key || "AIzaSyDTlNkVmEcfZ5ICLzfmE48b8TWulg7G5Hs",
  // my_address: "62/07, nguyen luong bang, hoa khanh, lien chieu, da nang",
  // public_key:
  //   "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAihrZymTl4ueQQ4gIfV/O+z5smsjzNw6ivhmr/4tVQTvVjpyAEzQHwVqrvvTOPCirCAFcANpkOUAR4TSEq+J1npheGETMkIFour+FbfZUv/V+rtXZPEP8Dbuv21TXt++mFIqB2OPPmL70T+3sMQ9z6KAc0HK6IHWSm5IUkY4AO/ofxkHoQjkjwTVYYORTajmGNlojXgWZMJWu48gp31Q9Jnl15KqA8dzqfzWFh7zZU7k7t5Ycfnikp7d2ooVxYD2lZwjsWpYEN1+iIZuGGjaM4AssxW8IqhtR7stfJhtn31A/W71rM7BASgL/YckjW/8gpEmvDd21XErvh0KfPACKdpP4dl90dsvD9ZkimHXXw/I9QZpa7mFLsolbNXIHdM1fVQRyFQsQvL0K6sMfdxHq8fmKNj7cjfHcsnjjK0/BND7WHbO5ylc5edKeH7UU739BT0vB7lQGiCMnva2hHp8WKnn++sQJiIfahc0nF1LIZYFYwsUKXiaGmdwbh2RO3T0wij/sfLpjNIysrqx0VsA3IQ4qUQnuBMmSRRE4Y+rqPh0RQBrR08Wut1jfnvTUJ8y0QpTfOfofEU2pzFuC9pbuFb1vkiFiljl5TEI/UHfdm0sbRGxZKcEH7h/RUM4DfTQcPQi343yly73cfGFTcSWcK2YC8IuAxkjAlJ9Bt91tnsUCAwEAAQ==",
};
