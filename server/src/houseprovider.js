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
function getId(categories, bannedIds) {
    var randomEntry;
    for (var i=0; i < MAX_ATTEMPTS; i++) {
        var randomCity = categories[Math.floor(Math.random() * categories.length)];
        // console.log("choosing from entries:", houseCatalog[randomCity]);
        var cityObjects = houseCatalog[randomCity];

        randomEntry = cityObjects[Math.floor(Math.random() * cityObjects.length)];

        if (!bannedIds.includes(randomEntry)) {
            return randomEntry;
        }
    }

    // lobby played so many houses there are no new ones let's remove half of their played ids
    bannedIds = bannedIds.slice(bannedIds.length - Math.floor(bannedIds.length * 0.5), bannedIds.length);

    return randomEntry;
}

function getHouse(categories, bannedIds) {
    var path = getId(categories, bannedIds);

    var houseFile = fs.readFileSync('./houses/'+ path, 'utf8');
    
    var houseData = JSON.parse(houseFile);

    bannedIds.push(path);

    return houseData;
}

function getHouses(amount, categories, bannedIds) {
    // check if no categories are provided, defaults to 'amsterdam'
    for (var i = categories.length - 1; i >= 0; i--) {
        if ((houseCatalog[categories[i]] == null) || (houseCatalog[categories[i]].length == 0)) {
            categories.splice(i, 1);
        }
    }
    if (categories.length == 0) {
        categories = ['amsterdam'];
    }

    // get the houses
    var houses = [];
    for (var i = 0; i < amount; i++) {
        var house = getHouse(categories, bannedIds);

        houses.push(house);
    }

    return houses;
}

module.exports.getHouses = getHouses;