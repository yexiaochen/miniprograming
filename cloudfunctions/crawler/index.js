// 云函数入口文件
const cloud = require('wx-server-sdk')
const Crawler = require("crawler");

cloud.init()
const uriArray = [{ uri: 'http://www.nows.fun/', selector: '#sentence' }, { uri: 'https://www.nihaowua.com/', selector: 'body > div > section > div' }, { uri: 'https://www.nihaowua.com/home.html', selector: 'body > div > section > div' }];


let crawler = new Crawler();
let canClick = true;


const crawlerWebPage = () => {
  if (!canClick) return false;
  canClick = false;
  let index = Math.floor(Math.random() * 3);
  let { uri, selector } = uriArray[index];
  console.log('idnex', index)
  return new Promise((resolve, reject) => {
    crawler.direct({
      uri: uri,
      retries: 0,
      timeout: 5000,
      skipEventRequest: false,
      callback: function (error, response) {
        canClick = true;
        if (error) {
          console.log(error)
        } else {
          var $ = response.$;
          var content = $(selector).text();
          console.log('index', index)
          resolve(content);
        }
      }
    })
  })
}

exports.main = async (event, content) => {
  const result = await crawlerWebPage();
  return result;
}
