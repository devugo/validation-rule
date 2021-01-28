exports.validate = (req, res, next) => {
    res.send({
        "message": "My Rule-Validation API",
        "status": "success",
        "data": {
            "name": "Ezenwankwo Ugochukwu",
            "github": "@devugo",
            "email": "ugoezenwankwo@gmail.com",
            "mobile": "08133491134",
            "twitter": "@devugo1"
        }
    })
}