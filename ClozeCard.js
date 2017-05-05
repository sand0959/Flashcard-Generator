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
		fs.writeFile("log.txt", JSON.stringify(data) + ',', "utf8", function(error) {
			if (error) {
				console.log(error);
			}
		});
		};
	}
	module.exports = ClozeCard;