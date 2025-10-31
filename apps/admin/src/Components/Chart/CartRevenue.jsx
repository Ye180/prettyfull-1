import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from "chart.js";
import { Fragment } from "react";
import { Bar } from "react-chartjs-2";
import useHostname from "../Provider/HostnameProvider";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const CartRevenue = () => {
	const originalUrl = useHostname();

	const data = {
		labels: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		],
		datasets: [
			{
				label: "Dataset 1",
				data: [30, 55, 30, 40, 1.702, 45, 45, 47, 35, 20, 50, 45],
				backgroundColor: "#57A481",
				borderColor: "#57A481",
				borderWidth: 0,
				borderRadius: 4,
			},
			{
				label: "Dataset 2",
				data: [55, 45, 32, 20, 50, 23, 28, 40, 30, 46, 60, 55],
				backgroundColor: "#C7F080",
				borderColor: "#C7F080",
				borderWidth: 0,
				borderRadius: 4,
			},
		],
	};

	const options = {
		responsive: true,
		scales: {
			x: {
				grid: {
					display: false, // Disable grid lines on the x-axis
				},
				border: {
					display: false, // Remove the x-axis line
				},
			},
			y: {
				grid: {
					display: false, // Disable grid lines on the y-axis
				},
				border: {
					display: false, // Remove the x-axis line
				},
			},
		},
		plugins: {
			legend: {
				display: false, // Hide the legend
			},
			title: {
				display: false, // Hide the title
			},
		},
	};

	return (
		<Fragment>
			<div className="p-4 border border-Mborderborderprimary w-full rounded-lg">
				<div className="flex justify-between items-start mb-4">
					<div className="">
						<h5 className="font-medium text__18 mb-2">Revenue Report</h5>
						<h2 className="font-semibold text__32 mb-2">$220,745,00</h2>
						<div className="flex items-center gap-2 ]">
							<div className="flex items-center gap-2 px-2 py-1 rounded-sm bg-[#EFFBF2]">
								<img src={originalUrl + "/images/arrow-up.svg"} alt="" />
								<p className="font-medium text__14 text-Malertssucces">80%</p>
							</div>
							<p className="text__14 text-Mtexttextinvert">vs previous month</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-Mmaincolorgreen"></div>
							<p className="font-medium text__12 text-Mmaincolorgreen">
								Earning
							</p>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-Mmaincolorlightgreen"></div>
							<p className="font-medium text__12 text-Mmaincolorlightgreen">
								Expense
							</p>
						</div>
					</div>
				</div>

				<Bar data={data} options={options} />
			</div>
		</Fragment>
	);
};

export default CartRevenue;
