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
						className="w-[18rem] rounded-2xl bg-linear-to-br from-[#101f3c] via-[#0d1830] to-[#050b18] p-5 text-slate-100 shadow-xl"
					>
						<p className="text-xs uppercase tracking-[0.2em] text-slate-300">
							Bank account
						</p>
						<div className="mt-5 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
									<span className="text-lg font-semibold">C</span>
								</div>
								<div>
									<p className="text-base font-semibold">{account.bankName}</p>
									<p className="text-sm text-slate-300">
										•••• •••• •••• {account.lastDigits}
									</p>
								</div>
							</div>
							<span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase text-emerald-300">
								{account.status}
							</span>
						</div>
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
