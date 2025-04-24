import React, { useState } from 'react';

const ParameterForm = ({ onUpdateWeights }) => {
    const [weights, setWeights] = useState({
        parameter1: 1,
        parameter2: 1,
        parameter3: 1,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWeights({
            ...weights,
            [name]: parseFloat(value) || 0,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateWeights(weights);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Parameter 1 Weight:
                    <input
                        type="number"
                        name="parameter1"
                        value={weights.parameter1}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Parameter 2 Weight:
                    <input
                        type="number"
                        name="parameter2"
                        value={weights.parameter2}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Parameter 3 Weight:
                    <input
                        type="number"
                        name="parameter3"
                        value={weights.parameter3}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <button type="submit">Update Rankings</button>
        </form>
    );
};

export default ParameterForm;