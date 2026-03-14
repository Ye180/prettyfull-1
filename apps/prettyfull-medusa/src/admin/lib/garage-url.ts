export const withGarageViewParam = (rawUrl: string): string => {
	if (!rawUrl) {
		return rawUrl
	}

	const shouldAppend = /\.garage\.|dev-storage\.prettyfull\.com/i.test(rawUrl)
	if (!shouldAppend) {
		return rawUrl
	}

	try {
		const url = new URL(rawUrl)
		if (!url.searchParams.has("view")) {
			url.searchParams.set("view", "1")
		}
		return url.toString()
	} catch {
		return rawUrl
	}
}
