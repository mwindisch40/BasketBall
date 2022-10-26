import * as cheerio from 'cheerio';
import got from 'got';

const players = [];

// Alright this one is a beast - first we are getting the lowercase alphabet out of the character map
// then we use splice to destructively remove out any letters that aren't between the arguments passed
// at the command line, again using the char map.
const getAlphabet = (alphabetRange) => [...String.fromCharCode(...Array(123).keys()).slice(97)]
  .splice(alphabetRange[0].charCodeAt(0)-97,alphabetRange[1].charCodeAt(0)-alphabetRange[0].charCodeAt(0)+1);


export default async (alphabetRange) => {
    const alphabet = getAlphabet(alphabetRange);
    for (const letter of alphabet) { //Loop through our custom alphabet
        const response = await got.get(`https://www.baseball-reference.com/players/${letter}/`); //Get all players for letter
        const $ = cheerio.load(response.body); //This loads the body of the page into cheerio, which allows us to use "jQuery" to traverse the DOM

        $('#div_players_ p b a').each((i, el) => { //Note: this 'b' filters active player, handy
            const name = $(el).html(); //Get the name out of the visible html
            console.log(name);
            const [blank, _players, letter, _name] = el.attribs.href.split('/'); //Get the rest out of the url
            const [slug, html] = _name.split('.'); //Parse the slug out of that
            players.push({ letter, name, slug }); //Then add it to one array of all players
        });
    }
    return players; //Return the players to the main baseball function
};

console.log({players})
