import * as cheerio from 'cheerio';
import got from 'got';
import { makeCsv } from './buildNBAcsv.js';

const findTextAndReturnRemainder = (target, variable) => {
    const chopFront = target.substring(target.search(variable) + variable.length, target.length);
    return chopFront.substring(0, chopFront.search(";"));
};

const getTableJson = async () => {
    const response = await got.get(`https://www.rotowire.com/betting/nba/player-props.php`); //Load the betting site info
    const $ = cheerio.load(response.body); //This loads the body of the page into cheerio, which allows us to use "jQuery" to traverse the DOM
    const points = $('#props-pts').next().html();
    const threes = $('#props-threes').next().html();

    return JSON.parse(findTextAndReturnRemainder(points, 'data: ').split(/,\n/)[0]);
    return JSON.parse(findTextAndReturnRemainder(threes, 'data: ').split(/,\n/)[0]);
};


(async () => {
    const threes = await getTableJson();
    await makeCsv(threes, 'threes');
    const points = await getTableJson();
    await makeCsv(points, 'points');
})(); 