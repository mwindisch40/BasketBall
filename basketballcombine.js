import scrapeNBAPlayers from './scrapeNBAPlayers.js';
import scrapeNBAGamelog from './scrapeNBAGamelog.js';
import { basketballGamelogCsv } from './BuildNBACSV.js';

const alphabetRange = process.argv.slice(2); //Get our command line args, expecting 2 letters e.g. 'node baseball.js a b'
alphabetRange[0] || alphabetRange.push('a'); //Set a default of a and z, if 1 or less args
alphabetRange[1] || alphabetRange.push('z');

(async () => {
  const players = await scrapeNBAPlayers(alphabetRange); //First scrape active players from the list
  const gamelogs = await scrapeNBAGamelog(players); //Then scrape their page for their hitting or pitching stats
  await basketballGamelogCsv(gamelogs); //Then convert to csv
})();
