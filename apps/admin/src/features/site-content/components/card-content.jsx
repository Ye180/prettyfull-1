const CardSiteContent = () => {
	const bankAccounts = [
		{
			id: 1,
			bankName: "Chase Bank",
			lastDigits: "6789",
			holder: "Darrell Williamson",
			address: "651 Washington Ave Apt 5, Brooklyn, NY, 11238",
			status: "Verified",
		},
	];

	return (
		<div className="py-8">
			<div className="flex flex-wrap gap-4">
				{bankAccounts.map((account) => (
					<div
						key={account.id}
						className="w-[18rem] rounded-2xl bg-gradient-to-br from-[#101f3c] h-[15rem] via-[#0d1830] to-[#050b18] px-3 py-3 flex justify-between flex-col space-y-10 text-slate-100 shadow-xl"
					>
						<p className="text-[2rem] font-bold uppercase tracking-[0.2em] text-slate-300">
							Woman
						</p>

						<div className="mt-6 space-y-1">
							<p className="text-sm font-medium">{account.holder}</p>
							<p className="text-sm text-slate-300">{account.address}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CardSiteContent;
