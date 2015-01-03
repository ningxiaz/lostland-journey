# crawl all my scrobbles from Last.fm

import requests
import io, json

lastfmKey = 'bd286e68d3aa369779ff55dfe15470b6'
baseUrl = 'http://ws.audioscrobbler.com/2.0/'
tracks = []
filename = 'data/data.json'

info = {'method': 'user.getrecenttracks', 'user': 'thmmrs2298', 'api_key': lastfmKey,'limit': '200', 'format': 'json'}
r = requests.get(baseUrl, params=info)

print(r.url)

data = r.json()

totalPages = int(data['recenttracks']['@attr']['totalPages'])
print('total number of pages: ', totalPages)

info = {'method': 'user.getrecenttracks', 'user': 'thmmrs2298', 'api_key': lastfmKey,'limit': '200', 'format': 'json', 'page': '1'}

for i in range(1, totalPages + 1):
    info['page'] = i
    print 'getting page %d ...' % i
    r = requests.get(baseUrl, params=info)
    data = r.json()
    tracks = tracks + data['recenttracks']['track']
    with io.open(filename, 'w', encoding='utf-8') as f:
        f.write(unicode(json.dumps(tracks, ensure_ascii=False, indent=4)))





