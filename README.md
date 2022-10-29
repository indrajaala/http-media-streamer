# media-streamer

[![npm][npm-img]][npm-url]
![example workflow](https://github.com/indrajaala/media-streamer/actions/workflows/test.yml/badge.svg)
![example workflow](https://github.com/indrajaala/media-streamer/actions/workflows/npm-publish.yml/badge.svg)

Node.js Express module to stream Video and Audio files.

## Installation

```
npm i media-streamer
```

## Usage

```js

import mediaStreamer from 'http-media-streamer';
import express from 'express';

const app = express();

app.get('/', mediaStreamer);

app.listen(3000, () => {
    console.log(`App listening on http://localhost:3000`);
});
```

**in browser**

send the request with absolute path of the file as query parameter `filePath`

```html
<video controls>
  <source src="http://localhost:3000/?filePath=/home/xyz/video.mp4" type="video/mp4">
</video>
```

## Supported formats

https://support.mozilla.org/en-US/kb/html5-audio-and-video-firefox#w_supported-formats

## Build

```
npm run build
```

## Test

```
npm run test
```

## License

[MIT](http://opensource.org/licenses/MIT)

[npm-img]: https://img.shields.io/npm/v/media-streamer.svg
[npm-url]: https://npmjs.com/package/media-streamer
