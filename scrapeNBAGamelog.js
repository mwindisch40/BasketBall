import * as cheerio from 'cheerio';
import got from 'got';

// Hitter Stats based on a key in the html data (note: needs to be all of them)
const BBallStats = ["game_season", "date_game", "age", "team_id", "game_location", "opp_id", "game_result", "gs", "mp", "fg", "fga",
    "fg_pct", "fg3", "fg3a", "fg3_pct", "ft", "fta", "ft_pct", "orb", "drb", "trb", "ast", "stl", "blk", "tov", "pf", "pts", "game_score", "plus_minus"];

//Get the url for the gamelogs, calling separate params for pitchers and hitters
const getGamelogUrl = ({ letter, slug }) => `https://www.basketball-reference.com/players/t/thompkl01/gamelog/2023`;

//Check the "position" in the hero element of the page to see if they are a pitcher
const checkPitcherness = $ => /pitcher/i.test($('#meta').toString());

//Simple function to test if an object has keys
const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

//Only here to be more DRY, but this essentially just loads the page into cheerio
const scrapeUrl = async (player) => {
    const url = getGamelogUrl(player);
    const response = await got.get(url);
    return cheerio.load(response.body);
};

const gamelogs = {
    BBall: []
};

export default async (players) => {
    for (const player of players) { //looping through our huge players array now
        let $ = await scrapeUrl(player); //First we assume they are a hitter since that is default on baseball-reference
        let stats = BBallStats;
        let logs = '#BBall_gamelogs';
        let isPitcher = false;
        if (checkPitcherness($)) { //Then check to see if they were secretly a pitcher this whole time, and instead run it all again as a pitcher if they were
            stats = pitcherStats;
            logs = '#pitching_gamelogs';
            isPitcher = true;
            $ = await scrapeUrl(player, isPitcher);
        }

        let row = {};
        const rows = $(`${logs} tbody tr`); //Makes an array of all the rows in the stats table
        rows.each((i, rowEl) => { //Then go through that row and write each one to an key/value pair in an object. jQuery is gross.
            $(rowEl).children('td').each((i, el) => {
                const key = stats[i];
                let val = '';
                if ($(el).children('a').length) {
                    val = $($(el).children('a')[0]).html();
                } else
                    if ($(el).children('strong').length) {
                        val = $($(el).children('strong')[0]).html();
                    }
                    else {
                        val = $(el).html();
                    }
                row[key] = val;
            });
            if (!isEmpty(row)) {
                row.rk = $($(rowEl).children('th')[0]).html();
                row.year = '2021';
                row.player = player.name;
                gamelogs[isPitcher ? "pitcher" : "BBall"].push(JSON.parse(JSON.stringify(row)));
                row = {};
            }
        });
        console.log(`Wrote gamelogs for ${player.name}`);
    }
    return gamelogs; //Finally return the game logs object to the main functionzz
};