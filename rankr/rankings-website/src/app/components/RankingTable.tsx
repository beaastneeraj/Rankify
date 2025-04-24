import React from 'react';

interface RankingTableProps {
    rankings: Array<{
        name: string;
        score: number;
        [key: string]: any; // Allow for dynamic parameters
    }>;
}

const RankingTable: React.FC<RankingTableProps> = ({ rankings }) => {
    return (
        <div>
            <h2>Rankings</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Score</th>
                        {/* Add more headers dynamically based on parameters */}
                        {rankings.length > 0 && Object.keys(rankings[0]).filter(key => key !== 'name' && key !== 'score').map(param => (
                            <th key={param}>{param}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rankings.map((ranking, index) => (
                        <tr key={index}>
                            <td>{ranking.name}</td>
                            <td>{ranking.score}</td>
                            {/* Render dynamic parameters */}
                            {Object.keys(ranking).filter(key => key !== 'name' && key !== 'score').map(param => (
                                <td key={param}>{ranking[param]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RankingTable;