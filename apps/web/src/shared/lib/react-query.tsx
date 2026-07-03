import type { DefaultOptions, UseMutationOptions } from "@tanstack/react-query";

export const queryConfig = {
	queries: {
		// throwOnError: true,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		retry: false,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
	},
} satisfies DefaultOptions;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
	Awaited<ReturnType<FnType>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryConfig<T extends (...args: any[]) => any> = Omit<
	ReturnType<T>,
	"queryKey" | "queryFn"
>;

export type MutationConfig<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
	ApiFnReturnType<MutationFnType>,
	Error,
	Parameters<MutationFnType>[0]
>;
