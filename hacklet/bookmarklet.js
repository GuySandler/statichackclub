javascript: (() => {
	const elements = document.body.getElementsByTagName('*');
	function randint(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	for (const element of elements) {
		switch (randint(0, 10)) {
			case 0:
				element.style.position = 'relative';
				element.style.top = `${randint(-25, 25)}px`;
				break;
			case 1:
				element.style.position = 'relative';
				element.style.right = `${randint(-25, 25)}px`;
				break;
			case 2:
				element.style.position = 'relative';
				element.style.left = `${randint(-25, 25)}px`;
				break;
			case 3:
				element.style.position = 'relative';
				element.style.bottom = `${randint(-25, 25)}px`;
				break;
			case 4:
				element.style.transform = `rotate(${randint(-25, 25)}deg)`;
				break;
			case 5:
				element.style.transform = `scale(${randint(50, 150) / 100})`;
				break;
			case 6:
				element.style.width = `${randint(1, 125)}%`;
				break;
			case 7:
				element.style.height = `${randint(1, 125)}%`;
				break;
			case 8:
				const fonts = [
					'Arial',
					'Courier New',
					'Georgia',
					'Times New Roman',
					'Verdana',
				];
				const font = fonts[randint(0, fonts.length - 1)];
				element.style.fontFamily = font;
				break;
			case 9:
				element.style.fontSize = `${randint(1, 125)}%`;
				break;
			case 10:
				element.style.color = `rgb(${randint(1, 255)}, ${randint(1, 255)}, ${randint(1, 255)})`;
				break;
			default:
				break;
		}
	}
})();
