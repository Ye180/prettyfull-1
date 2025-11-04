import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from "chart.js";
import { useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const SimpleBarChart = () => {
	const [activeIndex, setActiveIndex] = useState(1); // Default active bar (e.g., April)

	const data = {
		labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
		datasets: [
			{
				label: "Monthly Data",
				data: [3, 7, 5, 6, 8, 3, 1],
				backgroundColor: ({ dataIndex }) =>
					dataIndex === activeIndex ? "#5EAD70" : "#F2F8F5",
				borderRadius: 4,
				hoverBackgroundColor: "#5EAD70",
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			tooltip: { enabled: false },
		},
		scales: {
			x: {
				grid: { display: false },
				ticks: { color: "#888", font: { size: 12 } },
			},
			y: {
				display: false,
				beginAtZero: true,
			},
		},
		onClick: (event, elements) => {
			if (elements.length > 0) {
				const clickedIndex = elements[0].index;
				setActiveIndex(clickedIndex);
			}
		},
	};

	return (
		<div style={{ width: "100%", height: "100%" }}>
			<Bar data={data} options={options} />
		</div>
	);
};

export default SimpleBarChart;
