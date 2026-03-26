const http = require('http');

http.get('http://localhost:3001/api/v1/metrics', (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        try {
            const metrics = JSON.parse(rawData);
            let data = [];
            for (let step in metrics) {
                let s = metrics[step];
                if (s.entered > 0) {
                    data.push({
                        name: s.name,
                        dropRate: s.dropped / s.entered,
                        avgTime: s.avgTime,
                        errors: s.errors,
                        rageClicks: s.rageClicks,
                        hesitation: s.hesitation,
                        tabSwitches: s.tabSwitches,
                        backButtons: s.backButtons
                    });
                }
            }
            
            if (data.length < 2) return console.log("Not enough data.");

            function getCorrelation(xArray, yArray) {
                let n = xArray.length;
                let sumX = 0, sumY = 0, sumXY = 0, sumX_sq = 0, sumY_sq = 0;
                for(let i = 0; i < n; i++){
                    sumX += xArray[i];
                    sumY += yArray[i];
                    sumXY += xArray[i] * yArray[i];
                    sumX_sq += Math.pow(xArray[i], 2);
                    sumY_sq += Math.pow(yArray[i], 2);
                }
                let numerator = (n * sumXY) - (sumX * sumY);
                let denominator = Math.sqrt((n * sumX_sq - Math.pow(sumX, 2)) * (n * sumY_sq - Math.pow(sumY, 2)));
                if (denominator === 0) return 0;
                return numerator / denominator;
            }

            const features = ['avgTime', 'errors', 'rageClicks', 'hesitation', 'tabSwitches', 'backButtons'];
            const y = data.map(d => d.dropRate);
            
            let scores = [];
            for (let f of features) {
                let x = data.map(d => d[f]);
                let r = Math.abs(getCorrelation(x, y));
                scores.push({ feature: f, score: r });
            }
            
            scores.sort((a,b) => b.score - a.score);
            console.log("=== Behavioral Drivers of Drop-Offs ===");
            let total = scores.reduce((sum, s) => sum + s.score, 0);
            if (total === 0) {
                console.log("Insufficient correlation found across the simulated data.");
                return;
            }
            scores.forEach(s => {
                let impact = (s.score / total) * 100;
                console.log(`- ${s.feature}: ${impact.toFixed(1)}% predictive impact on dropping out`);
            });
            
        } catch (e) {
            console.error(e.message);
        }
    });
}).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
});
