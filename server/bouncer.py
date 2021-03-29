import os
import json

from cleaner import clean_json

CATALOG_PATH = "./server/houses/catalog.json"

TO = "./server/houses/"
FROM = "./server/raw_data/"

RESET = True

if RESET:
    catalog = {}
    FROM = TO
else:
    with open(CATALOG_PATH) as catalog_file:
        catalog = json.load(catalog_file)

def add_to_category(category, path):
    # create category in catalog
    if category not in catalog.keys():
        catalog[category] = []

    catalog[category].append(path)

# process houses
for city in os.scandir(FROM):
    # check if entry really is a folder (a city!)
    if not city.is_dir():
        continue

    # create directory if city is new
    to_city_path = TO + city.name
    if not os.path.isdir(to_city_path):
        os.mkdir(to_city_path)

    # make static list of houses to avoid looping issues scary
    houses = [h for h in os.scandir(city.path)]

    # iterate over scraped files
    for house in houses:
        # retrieve data
        with open(house.path) as house_file:
            # load the data
            house_data = json.load(house_file)

            # clean the data
            success = clean_json(house_data)

            if not success:
                print("something went wrong parsing", house.path)
                continue

            # add to catalog
            catalog_entry = city.name + "/" + house.name

            add_to_category("all", catalog_entry)
            add_to_category(city.name, catalog_entry)
            # add_to_category("huizen met dakterras", catalog_entry)
            
            # save the file
            to_house_path = to_city_path + "/" + house.name
            with open(to_house_path, 'w') as outfile:
                json.dump(house_data, outfile, indent=4)

            print("succesfully saved " + house.path)

# save catalog
with open(CATALOG_PATH, 'w') as outfile:
    json.dump(catalog, outfile, indent=4)
