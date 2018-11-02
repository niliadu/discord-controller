export async function keyAuth(req, res, next) {
    if (req.headers["X-Service-Token"] !== process.env.CONTROLLER_KEY) {
        return res.status(401).json({
            error: {
                code: "INVALID_TOKEN",
                message: "The token you provided is not valid."
            }
        })
    }

    next()
}
