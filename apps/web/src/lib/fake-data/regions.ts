export interface FakeRegion {
	id: string;
	name: string;
	currency_code: string;
}

export const regions: FakeRegion[] = [
	{ id: "reg_us", name: "United States", currency_code: "usd" },
	{ id: "reg_xof", name: "Afrique de l'Ouest (XOF)", currency_code: "xof" },
];
