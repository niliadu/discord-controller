export function errorHandler(err, req, res, next) {
	if (err instanceof SyntaxError) {
		return res.status(400).json({
			error: {
				code: "INVALID_JSON",
				message: "The body of your request is not valid JSON."
			}
		})
	}

	console.error(err)
	res.status(500).send()
}
