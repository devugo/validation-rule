exports.getMyDetails = (req, res, next) => {
    res.status(200).json({
        "message": "My Rule-Validation API",
        "status": "success",
        "data": {
            "name": "Ezenwankwo Ugochukwu Thankgod",
            "github": "@devugo",
            "email": "ugoezenwankwo@gmail.com",
            "mobile": "08133491134",
            "twitter": "@devugo1"
        }
    })
}