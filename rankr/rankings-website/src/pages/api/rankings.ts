import { NextApiRequest, NextApiResponse } from 'next';
import { parseCSV } from '../../lib/csvParser';
import { calculateRankings } from '../../lib/rankingCalculator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { weights } = req.body;

        try {
            const data2022 = await parseCSV('eng_2022.csv');
            const data2023 = await parseCSV('eng_2023.csv');
            const data2024 = await parseCSV('eng_2024.csv');
            const overallData = await parseCSV('overall_2024.csv');

            const rankings2022 = calculateRankings(data2022, weights);
            const rankings2023 = calculateRankings(data2023, weights);
            const rankings2024 = calculateRankings(data2024, weights);
            const overallRankings = calculateRankings(overallData, weights);

            res.status(200).json({
                rankings2022,
                rankings2023,
                rankings2024,
                overallRankings,
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch rankings data' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}