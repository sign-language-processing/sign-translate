const fs = require('fs');

const preloadResources = [
  ['script', /<script src="(.*?)"/g],
  ['style', /<link rel="stylesheet" href="(.*?)"/g],
  ['font', /<link rel="preload" as="font" href="(.*?)"/g],
  ['image', /<link rel="preload" as="image" href="(.*?)"/g],
];

function* getResources(htmlPath) {
  const content = String(fs.readFileSync(htmlPath));

  for (const [type, re] of preloadResources) {
    for (const match of content.matchAll(re)) {
      yield `</${match[1]}>;rel=preload;as=${type}`;
    }
  }
}

function updateServerPush(resources) {
  const firebase = JSON.parse(String(fs.readFileSync('firebase.json')));
  const rewrite = firebase.hosting.rewrites.find(({source}) => source === '**');
  if (!rewrite.headers) {
    rewrite.headers = [];
  }
  rewrite.headers.push({key: 'Link', value: resources});
  fs.writeFileSync('firebase.json', JSON.stringify(firebase, null, 2));
}

const resources = [...getResources('dist/sign-translate/index.html')].join(',');
updateServerPush(resources);
