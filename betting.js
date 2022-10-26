import * as cheerio from 'cheerio';
import got from 'got';
import { makeCsv } from './buildcsv.js';

const findTextAndReturnRemainder = (target, variable) => {
  const chopFront = target.substring(target.search(variable)+variable.length,target.length);
  return chopFront.substring(0,chopFront.search(";"));
};

const getTableJson = async () => {
  const response = await got.get(`https://www.rotowire.com/betting/mlb/player-props.php`); //Load the betting site info
  const $ = cheerio.load(response.body); //This loads the body of the page into cheerio, which allows us to use "jQuery" to traverse the DOM
  const strikeouts = $('#props-strikeouts').next().html();
  return JSON.parse(findTextAndReturnRemainder(strikeouts, 'data: ').split(/,\n/)[0]);
};

(async ()=>{
  const strikeouts = await getTableJson();
  await makeCsv(strikeouts, 'strikeouts');
})();