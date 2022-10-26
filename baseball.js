import scrapePlayers from './scrapePlayers.js';
import scrapeGamelog from './scrapeGamelog.js';
import { baseballGamelogCsv } from './buildcsv.js';

const alphabetRange = process.argv.slice(2); //Get our command line args, expecting 2 letters e.g. 'node baseball.js a b'
alphabetRange[0] || alphabetRange.push('a'); //Set a default of a and z, if 1 or less args
alphabetRange[1] || alphabetRange.push('z');

(async () => {
  const players = await scrapePlayers(alphabetRange); //First scrape active players from the list
  const gamelogs = await scrapeGamelog(players); //Then scrape their page for their hitting or pitching stats
  await baseballGamelogCsv(gamelogs); //Then convert to csv
})();