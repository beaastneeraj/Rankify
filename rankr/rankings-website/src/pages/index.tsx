import { useEffect, useState } from 'react';
import ParameterForm from '../app/components/ParameterForm';
import RankingTable from '../app/components/RankingTable';
import { parseCSV } from '../app/lib/csvParser';
import { calculateRankings } from '../app/lib/rankingCalculator';

const IndexPage = () => {
    const [rankings, setRankings] = useState([]);
    const [weights, setWeights] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/rankings');
            const data = await response.json();
            setRankings(data);
        };
        fetchData();
    }, []);

    const handleWeightChange = (newWeights) => {
        setWeights(newWeights);
        const updatedRankings = calculateRankings(rankings, newWeights);
        setRankings(updatedRankings);
    };

    return (
        <div>
            <h1>Rankings Dashboard</h1>
            <ParameterForm onWeightChange={handleWeightChange} />
            <RankingTable rankings={rankings} />
        </div>
    );
};

export default IndexPage;