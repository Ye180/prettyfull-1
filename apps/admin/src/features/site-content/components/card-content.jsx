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
						className="w-[18rem] rounded-2xl bg-gradient-to-br from-[#101f3c] via-[#0d1830] to-[#050b18] px-3 py-3  space-y-10 text-slate-100 shadow-xl"
					>
						<p className="text-xs uppercase tracking-[0.2em] text-slate-300">
							Woman
						</p>
						{/* <div className="flex items-center justify-between mt-5">
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
									<span className="text-lg font-semibold">C</span>
								</div>
								<div>
									<p className="text-base font-semibold">{account.bankName}</p>
									<p className="text-sm text-slate-300">
										•••• •••• •••• {account.lastDigits}
									</p>
								</div>
							</div>
							<span className="px-3 py-1 text-xs font-semibold uppercase rounded-full bg-emerald-500/20 text-emerald-300">
								{account.status}
							</span>
						</div> */}
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
