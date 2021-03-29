import datetime

def clean_json(house):
    # parse the price
    if not add_price(house):
        return False

    # make images ready for display
    if not fix_images(house):
        return False

    if 'metadata' not in house.keys():
        house['metadata'] = {}
    house['metadata']['cleaned_time'] = datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")

    return True

def fix_images(house):
    if 'images' not in house.keys() or len(house['images']) == 0:
        print("could not find any images")
        return False

    if type(house['images'][0]) == type('string'):
        fixed_imgs = []

        for link in house['images']:
            fixed_imgs.append({'original':link, 'thumbnail':link})

        house['images'] = fixed_imgs

        return True
    
    # yea i just assume it is already the fixed json
    return True




def add_price(house):
    try:
        raw = house['Overdracht']['Vraagprijs']
        price = int(raw.split(' ')[1].replace('.', ''))

        del house['Overdracht']['Vraagprijs']

        house['price'] = price
    except:
        if 'price' not in house.keys():
            print("could not find any vraagprijs")
            return False

    return True