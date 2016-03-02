// data module
// manipulating data obtained from API

journey.data = (function() {
    var aggregateData = {
        totalPlays: 0,
        averagePlays: 0
    };

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

    var computeDateArtistCounts = function(tracks) {
        var counts = {};
        tracks.forEach(function(track) {
            var artistName = track.artist['#text'];
            if(track.date) {
                var dateObj = new Date(parseInt(track.date.uts) * 1000);
                var dateString = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();

                if(!counts.hasOwnProperty(dateString)) {
                    counts[dateString] = {};
                }

                if(!counts[dateString].hasOwnProperty(artistName)) {
                    counts[dateString][artistName] = 0;
                }
                counts[dateString][artistName] += 1;
                aggregateData.totalPlays += 1;
            }
        });

        aggregateData.averagePlays = aggregateData.totalPlays / (Object.keys(counts).length);
        console.log(aggregateData);

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

    // normalize nested counts for D3 to use
    // artist sorted by count for each day
    var normalizeAndSort = function(counts) {
        var normalized = [];

        for(var date in counts) {
            if(counts.hasOwnProperty(date)) {
                var artists = [];

                for(artistName in counts[date]) {
                    if(counts[date].hasOwnProperty(artistName)) {
                        artists.push({
                            'artist': artistName,
                            'date': date,
                            'count': counts[date][artistName]
                        });
                    }
                }

                artists.sort(function(a, b) {
                    if(a.count > b.count) {
                        return -1;
                    }
                    if(a.count < b.count) {
                        return 1;
                    }
                    return 0;
                });

                normalized.push({
                    date: date,
                    artists: artists
                });
            }
        }

        return normalized;
    };

    var computeOffsets = function(artists) {
        artists.forEach(function(artist, i) {
            if(i === 0) {
                artist.offset = 0;
                return;
            }

            var prevCount = 0;
            var prevOffset = 0;
            var overlap = 0;
            // for even elements
            if(i % 2 === 0) {
                prevCount = artists[i - 2].count;
                prevOffset = artists[i - 2].offset;
                overlap = computeOverlap(prevCount, artist.count);
                artist.offset = prevOffset + prevCount + overlap + artist.count;
                return;
            }
            prevCount = (i === 1) ? artists[0].count : artists[i - 2].count;
            prevOffset = (i === 1) ? artists[0].offset : artists[i - 2].offset;
            overlap = computeOverlap(prevCount, artist.count);
            artist.offset = - ((- prevOffset) + prevCount + overlap + artist.count);
            return;
        });

        return;
    };

    var computeOverlap = function(prevCount, currCount) {
        return 0;
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
        computeDateArtistCounts: computeDateArtistCounts,
        normalizeAndSort: normalizeAndSort,
        computeArtistDailyCounts: computeArtistDailyCounts,
        computeDailyCounts: computeDailyCounts,
        normalizeDailyCounts: normalizeDailyCounts
    };
})();