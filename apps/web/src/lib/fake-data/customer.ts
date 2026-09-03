export interface FakeCustomerAddress {
	id: string;
	first_name: string;
	last_name: string;
	company?: string;
	address_1: string;
	address_2?: string;
	city: string;
	postal_code: string;
	province?: string;
	country_code: string;
	phone?: string;
	is_default_shipping?: boolean;
	is_default_billing?: boolean;
}

export interface FakeCustomer {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone?: string;
	addresses: FakeCustomerAddress[];
}

export const customer: FakeCustomer = {
	id: "cus_demo",
	first_name: "Jane",
	last_name: "Doe",
	email: "demo@prettyfull.shop",
	phone: "+1 512 555 0100",
	addresses: [
		{
			id: "addr_demo_1",
			first_name: "Jane",
			last_name: "Doe",
			address_1: "123 Main St",
			city: "Austin",
			postal_code: "73301",
			country_code: "us",
			phone: "+1 512 555 0100",
			is_default_shipping: true,
			is_default_billing: true,
		},
	],
};
