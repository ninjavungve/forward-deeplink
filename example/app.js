var express = require('express');
var deeplink = require('..');
var app = express();

// mount deeplink middleware
app.get(
  '/deeplink',
  deeplink({
    fallback: 'https://cupsapp.com',
    android_package_name: 'com.linh.demo',
    ios_store_link: 'https://itunes.apple.com/us/app/myapp/id556462755',
  })
);

app.get('/forward-deeplink', deeplink());

app.use(express.static('public'));

app.listen(3000);
console.log('deeplink service listening on port 3000');
