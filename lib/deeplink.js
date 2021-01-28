const fs = require('fs');
const stream = require('stream');
const path = require('path');
const inliner = require('html-inline');

module.exports = function (_options = {}) {
  const options = Object.assign({}, _options);
  options.url = _options.url || '';
  options.title = _options.title || '';
  options.ios_store_link = _options.ios_store_link || '';
  options.android_package_name = _options.android_package_name || '';
  options.fallback = _options.fallback || '';

  const deeplink = function (req, res, next) {
    const opts = {};
    Object.keys(options).forEach(function (k) {
      opts[k] = req.query[k] || options[k];
    });

    // bail out if we didn't get url
    if (!opts.url) {
      return next();
    }

    if (!opts.fallback) {
      throw new Error('Error (deeplink): options.fallback cannot be null');
    }

    // read template file
    const file = fs.createReadStream(
      path.join(__dirname, '/public/index.html')
    );

    // replace all template tokens with values from options
    const detoken = new stream.Transform({ objectMode: true });
    detoken._transform = function (chunk, encoding, done) {
      let data = chunk.toString();
      Object.keys(opts).forEach(function (key) {
        data = data.replace('{{' + key + '}}', opts[key]);
      });

      this.push(data);
      done();
    };

    // inline template js with html
    const inline = inliner({ basedir: path.join(__dirname, '/public') });

    // make sure the page is being sent as html
    res.set('Content-Type', 'text/html;charset=utf-8');

    // read file --> detokenize --> inline js --> send out
    file.pipe(detoken).pipe(inline).pipe(res);
  };

  return deeplink;
};
