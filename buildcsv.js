import converter from 'json-2-csv';
import * as fs from 'fs';

const makeCsv = async (inputData, name) => {
    await converter.json2csv(inputData, (err, csv) => { //Convert their objects to csv
        if (err) {
            throw err;
        }

        const writeStream = fs.createWriteStream(`${name}.csv`);
        writeStream.write(csv); //Write it to a file with this name ^

        writeStream.on('finish', () => {
            console.log(`done writing to csv: ${name}`);
        });

        writeStream.on('error', (err) => {
            console.error(err);
        });

        writeStream.end();
    })
};

const baseballGamelogCsv = async (gamelogs) => { //Takes in an object containing gamelogs for "hitters" and "pitchers"
    for (const gamelogsByType of Object.keys(gamelogs)) { //For both of those...
        await makeCsv(gamelogs[gamelogsByType], `gamelog-${gamelogsByType}`)
    }
};

export { baseballGamelogCsv, makeCsv };