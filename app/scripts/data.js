// data module
// manipulating data obtained from API

journey.data = (function() {
    var computeArtistDailyCounts = function(tracks) {
        var counts = {};
        tracks.forEach(function(track) {
            var dateObj = new Date(parseInt(track.date.uts) * 1000);
            console.log(track.date['#text']);
            // day string will be something like "2014 3 23" (April 23, 2014) local time
            var dateString = dateObj.getFullYear() + ' ' + dateObj.getMonth() + ' ' + dateObj.getDate();

            if(!counts.hasOwnProperty(dateString)) {
                counts[dateString] = 1;
            }
            else {
                counts[dateString] += 1;
            }
        });

        return counts;
    };

    var computeDailyCounts = function(tracks) {
        var counts = {};
        tracks.forEach(function(track) {
            var artistName = track.artist['#text'];
            if(!counts.hasOwnProperty(artistName)) {
                counts[artistName] = {};
                counts[artistName]['total'] = 0;
            }
            // a new track might not have date field
            if(track.date) {
                var dateObj = new Date(parseInt(track.date.uts) * 1000);
                // day string will be something like "2014 3 23" (April 23, 2014) local time
                var dateString = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();

                if(!counts[artistName].hasOwnProperty(dateString)) {
                    counts[artistName][dateString] = 1;
                }
                else {
                    counts[artistName][dateString] += 1;
                }
                counts[artistName]['total'] += 1;
            }
        });

        return counts;
    };

    // normalize counts for D3 to use
    var normalizeDailyCounts = function(counts) {
        var normalized = [];

        for(var artistName in counts) {
            if(counts.hasOwnProperty(artistName)) {
                var artist = counts[artistName];

                for (var date in artist) {
                    if(artist.hasOwnProperty(date)) {
                        if(date !== 'total') {
                            normalized.push({
                                'artist': artistName,
                                'date': date,
                                'count': artist[date]
                            });
                        }
                    }
                }                
            }
        }

        return normalized;
    };

    return {
        computeArtistDailyCounts: computeArtistDailyCounts,
        computeDailyCounts: computeDailyCounts,
        normalizeDailyCounts: normalizeDailyCounts
    };
})();