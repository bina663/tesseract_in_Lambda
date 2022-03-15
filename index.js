const puppeteer = require('puppeteer');
const {createWorker} = require('tesseract.js');
const path = require('path');

(async () => {  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://raw.githubusercontent.com/shelfio/aws-lambda-tesseract/master/test.png');
  console.log('accessing website...')
  await page.screenshot({ path: 'test.jpeg' });
  await browser.close();
  
  console.log('reading image...');
  const worker = createWorker({
    //the path in a lambda function and [/tmp]
    cachePath: path.join('./tmp'),
  });
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const {data: {text} } = await worker.recognize('./test.jpeg');
  await worker.terminate();
  console.log(text);
})();