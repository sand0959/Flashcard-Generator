var fs = require("fs");

function ClozeCard (text, cloze) {
	this.text = text;
	this.cloze = cloze;
	this.partial = this.text.replace(this.cloze, '------');
	this.create = function () {
		var data = {
			text: this.text,
			cloze: this.cloze,
			partial: this.partial,
			type: "cloze"
		};
		fs.appendFile("log.txt", JSON.stringify(data, null, 2) + ";", function(error) {
			if (error) {
				console.log(error);
			}
		});
		};
	}
	module.exports = ClozeCard;