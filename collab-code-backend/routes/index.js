const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.send({ response: "i am alive" }).status(200);
	console.log(req);
});

module.exports = router;