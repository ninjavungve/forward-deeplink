# forward-deeplink [![Build Status](https://travis-ci.org/mderazon/forward-deeplink.svg?branch=master)](https://travis-ci.org/mderazon/forward-deeplink) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Easily create express endpoint to handle mobile deeplinks in your web server

Takes away the pain of forwarding users to the right app store / mobile app depending on their platform.

## Use case

Suppose you have a custom url scheme `app://` handled by your mobile apps. You want to create a universal "smart" link that will know where to send the user:

- If the user has the app installed, open the app with the deeplink.
- If the user doesn't have the app installed, send to the app store to download the app (google play / itunes).
- If the user doesn't have a supported phone, send to a fallback url.

## Usage

### Example:

```js
var express = require('express');
var deeplink = require('forward-deeplink');

var app = express();

// fix deeplink conf with constance values
app.get(
  '/deeplink',
  deeplink({
    fallback: 'https://cupsapp.com',
    android_package_name: 'com.linh.demo',
    ios_store_link: 'https://itunes.apple.com/us/app/myapp/id556462755',
  })
);

// attach deeplink configurations inner request query-string
app.get('/forward-deeplink', deeplink());
```

This example creates an endpoint `GET /deeplink` in your web server.

Assuming your server address is `https://acme.org`, you can use the link `https://acme.org/deeplink?url=app://account` so when users will open it the app will open with `app://account` deeplink or the users will be redirected to download the app in case they don't have it.

### Available options

_forward-deeplink_ currently only supports Android and ios.

#### Options 1: To pass on to _forward-deeplink_ are:

- `url`: **mandatory**. The deeplink url you want the user to be directed to e.g. `app://account`.
- `fallback`: **mandatory**. A fallback url in case the user is opening the link via an unsupported platform like desktop / windows phone etc. In such case, the fallback url will be opened in the user's browser like a normal link.
- `android_package_name`: **optional**. In case you want to support Android deep links, pass your app's package name.
- `ios_store_link`: **optional**. In case you want to support ios deep links, pass your app's itunes url. You can get it [here](https://linkmaker.itunes.apple.com/us/).
- `title`: **optional**. Title for the intermediate html page. Defaults to an empty string.

#### Options 2: To pass on to query params (express request):

When a request comes in, the following query params are checked:

- `url`: **mandatory**. If available, will prefer this deeplink url over the one from the options.
- `fallback`: **mandatory**. If available, will prefer this fallback address over the one from the options.
- `android_package_name`: **optional**. In case you want to support Android deep links, pass your app's package name.
- `ios_store_link`: **optional**. In case you want to support ios deep links, pass your app's itunes url. You can get it [here](https://linkmaker.itunes.apple.com/us/).
- `title`: **optional**. Title for the intermediate html page. Defaults to an empty string.

### Behaviour

_forward-deeplink_ works by first sending the user to an html page with a user-agent sniffing script. After figuring out the user's device, it redirects them to the predefined deeplink. In practice, after clicking the link, the browser will be opened for a very short moment and then the redirect will happen.

### TODO

- Better user-agent discovery.
- Enable non-express use.
