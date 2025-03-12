import React from 'react';
import PieChart from '../../components/Graphs';


const HomePage: React.FC = () => {
    const labels = ['Red', 'Blue', 'Yellow'];
    const data = [10, 20, 30];
    const backgroundColor = [ '#FF6384', '#36A2EB', '#FFCE56'];
    return(
        <div>
            <h2>Pie Chart</h2>
            <PieChart labels={labels} data={data} backgroundColors={backgroundColor} />
        </div>
    );
};
export default HomePage;