import * as d3 from 'd3';

class HeatUtils {

     // Function to calculate correlation matrix
     static calculateCorrelationMatrix = (numericalFeatures) => {

        if (!numericalFeatures || typeof numericalFeatures !== 'object') {
            console.error('Numerical features are not provided or not in the correct format.');
            return [];
        }

        const features = Object.keys(numericalFeatures);
        const correlationMatrix = [];

        for (let i = 0; i < features.length; i++) {
            const row = [];
            for (let j = 0; j < features.length; j++) {
                const feature1 = features[i];
                const feature2 = features[j];
                const correlation = this.calculateCorrelation(numericalFeatures[feature1], numericalFeatures[feature2]);
                row.push(correlation);
            }
            correlationMatrix.push(row);
        }


        return correlationMatrix;
    };

    // Function to calcualte correlation coefficient
    static calculateCorrelation = (values1, values2) => {
        const n = values1.length;
        const sumX = d3.sum(values1);
        const sumY = d3.sum(values2);
        const sumXSq = d3.sum(values1.map(x => Math.pow(x, 2)));
        const sumYSq = d3.sum(values2.map(y => Math.pow(y, 2)));
        const sumXY = d3.sum(values1.map((x, i) => x * values2[i]));

        const numerator = (n * sumXY) - (sumX * sumY);
        const denominator = Math.sqrt((n * sumXSq - Math.pow(sumX, 2)) * (n * sumYSq - Math.pow(sumY, 2)));

        if (denominator === 0) {
            return 0; // Correlation is 0 if denominator is 0
        }

        return numerator / denominator;
    };

}

export default HeatUtils;