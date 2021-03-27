var fs = require('fs');

// catalog:
//{
// 'amsterdam' : 
//  [{'0' : '/amsterdam/ringdijk-11-b',
//    '1' : '/amsterdam/sloterplas-423'}],
// 'zwolle' :
//  [{'2' : '/zwolle/vrijheidspad-49'}],
//}
var catalogFile = fs.readFileSync('./houses/catalog.json', 'utf8');
houseCatalog = JSON.parse(catalogFile);

// after max attempts it just picks the latest attempt, whether banned or not
const MAX_ATTEMPTS = 150;
function getId(cities, bannedIds) {
    var randomEntry;
    for (var i=0; i < MAX_ATTEMPTS; i++) {
        var randomCity = cities[Math.floor(Math.random() * cities.length)];

        var cityObjects = houseCatalog[randomCity];

        randomEntry = cityObjects[Math.floor(Math.random() * cityObjects.length)];

        if (!bannedIds.includes(randomEntry["id"])) {
            return randomEntry;
        }
    }

    // lobby played so many houses there are no new ones let's remove half of their played ids
    bannedIds = bannedIds.slice(bannedIds.length - Math.floor(bannedIds.length * 0.5), bannedIds.length);

    return randomEntry;
}

function getHouse(cities, bannedIds) {
    var catalogEntry = getId(cities, bannedIds);
    
    var path = catalogEntry["path"];

    var houseFile = fs.readFileSync('./houses/'+ path, 'utf8');
    var houseData = JSON.parse(houseFile)[0];

    bannedIds.push(catalogEntry["id"]);

    return houseData;
}

function getHouses(amount, cities, bannedIds) {
    // check if no cities are provided, defaults to 'amsterdam'
    if (cities.length == 0) {
        cities = ['amsterdam'];
    }

    // get all the houses
    var houses = [];
    for (var i = 0; i < amount; i++) {
        var house = getHouse(cities, bannedIds);

        houses.push(house);
    }

    return houses;
}

module.exports.getHouses = getHouses;