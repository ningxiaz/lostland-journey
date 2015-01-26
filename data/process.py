# prcoess the data for vis

import io, sys, json

def trim(filename):
    print 'preparing to trim file: ', filename
    with open(filename) as input_file:
        original_data = json.load(input_file)
    trimmed_data = []
    for item in original_data:
        print 'trimming one item...', item['name']
        trimmed = {}
        if not 'date' in item:
            continue
        trimmed['date'] = item['date']['uts']
        trimmed['album'] = item['album']['#text']
        trimmed['name'] = item['name']
        trimmed['artist'] = item['artist']['#text']
        trimmed['image'] = item['image'][-1]['#text']
        trimmed_data.append(trimmed)
    print 'done trimming...'
    with io.open('data/trimmed.json', 'w', encoding='utf-8') as output_file:
        output_file.write(unicode(json.dumps(trimmed_data, ensure_ascii=False, indent=4)))

def main(argv):
    if argv[0] == 'trim':
        trim(argv[1])
    elif argv[0] == 'count':
        count()
    elif argv[0] == 'normalize':
        normalize()

if __name__ == "__main__":
   main(sys.argv[1:])