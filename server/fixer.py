"""
resets the catalog based on houses
"""

import os
import json

CATALOG_PATH = "./server/houses/catalog.json"

TO = "./server/houses/"


# process houses
for city in os.scandir(TO):
    # check if entry really is a folder (a city!)
    if not city.is_dir():
        continue

    # iterate over files
    for house in os.scandir(city.path):
        # retrieve data
        with open(house.path) as house_file: