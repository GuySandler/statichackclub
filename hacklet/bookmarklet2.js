javascript: (() => {
	// Check if already running
	if (document.getElementById("drawingCanvas")) {
		document.body.removeChild(document.getElementById("drawingCanvas"));
		document.body.removeChild(document.getElementById("drawingControls"));
		return;
	}

	// Canvas
	const canvas = document.createElement("canvas");
	canvas.id = "drawingCanvas";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.position = "fixed";
	canvas.style.top = "0";
	canvas.style.left = "0";
	canvas.style.zIndex = "10000";
	canvas.style.cursor = "crosshair";
	document.body.appendChild(canvas);

	const ctx = canvas.getContext("2d");
	ctx.lineWidth = 3;
	ctx.lineCap = "round";
	ctx.strokeStyle = "red";

	let isDrawing = false;
	let lastX = 0;
	let lastY = 0;

	let mode = "draw";

	function draw(e) {
		if (!isDrawing || mode == "erase") return;
		e.preventDefault();

		let currentX, currentY;
		if (e.touches) {
			currentX = e.touches[0].clientX;
			currentY = e.touches[0].clientY;
		} else {
			currentX = e.clientX;
			currentY = e.clientY;
		}

		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(currentX, currentY);
		ctx.stroke();
		[lastX, lastY] = [currentX, currentY];
	}

	const eraserScale = 7;
	function erase(e) {
		if (!isDrawing) return;
		e.preventDefault();

		let currentX, currentY;
		if (e.touches) {
			currentX = e.touches[0].clientX;
			currentY = e.touches[0].clientY;
		} else {
			currentX = e.clientX;
			currentY = e.clientY;
		}

		const eraserSize = ctx.lineWidth * eraserScale;
		ctx.clearRect(
			currentX - eraserSize / 2, // Center X
			currentY - eraserSize / 2, // Center Y
			eraserSize,
			eraserSize
		);
	}

	function checkmode(e) {
		if (mode == "erase") {
			erase(e);
		} else {
			draw(e);
		}
	}

	function startDrawing(e) {
		isDrawing = true;
		let startX, startY;
		if (e.touches) {
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
		} else {
			startX = e.clientX;
			startY = e.clientY;
		}
		[lastX, lastY] = [startX, startY];

		// Only draw the initial dot if not in erase mode
		if (mode !== "erase") {
			ctx.beginPath();
			ctx.arc(startX, startY, ctx.lineWidth / 2, 0, Math.PI * 2);
			ctx.fillStyle = ctx.strokeStyle;
			ctx.fill();
		}
	}

	function stopDrawing() {
		isDrawing = false;
	}

	// Mouse Events
	canvas.addEventListener("mousedown", startDrawing);
	canvas.addEventListener("mousemove", checkmode);
	canvas.addEventListener("mouseup", stopDrawing);
	canvas.addEventListener("mouseout", stopDrawing);

	// Control Panel
	const panel = document.createElement("div");
	panel.id = "drawingControls";
	panel.style.position = "fixed";
	panel.style.top = "10px";
	panel.style.left = "10px";
	panel.style.padding = "20px";
	panel.style.backgroundColor = "rgba(200, 200, 200, 0.8)";
	panel.style.border = "2px solid black";
	panel.style.borderRadius = "5px";
	panel.style.zIndex = "10001";
	panel.style.display = "flex";
	panel.style.gap = "10px";
	panel.style.cursor = "move";
	document.body.appendChild(panel);

	let isDraggingPanel = false;
	let offsetX, offsetY;

	const startDrag = (e) => {
		isDraggingPanel = true;
		document.body.style.userSelect = "none";

		let clientX, clientY;
		if (e.touches) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		offsetX = clientX - panel.offsetLeft;
		offsetY = clientY - panel.offsetTop;

		document.addEventListener("mousemove", dragMove);
		document.addEventListener("mouseup", stopDrag);
		document.addEventListener("touchmove", dragMove, { passive: false });
		document.addEventListener("touchend", stopDrag);
	};

	const dragMove = (e) => {
		if (!isDraggingPanel) return;
		e.preventDefault();

		let clientX, clientY;
		if (e.touches) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		panel.style.left = `${clientX - offsetX}px`;
		panel.style.top = `${clientY - offsetY}px`;
	};

	const stopDrag = () => {
		if (!isDraggingPanel) return;
		isDraggingPanel = false;
		document.body.style.userSelect = "";
		document.removeEventListener("mousemove", dragMove);
		document.removeEventListener("mouseup", stopDrag);
		document.removeEventListener("touchmove", dragMove);
		document.removeEventListener("touchend", stopDrag);
	};

	panel.addEventListener("mousedown", startDrag);
	panel.addEventListener("touchstart", startDrag);

	// Colors
	const colors = ["red", "blue", "green", "yellow", "black", "white"];
	colors.forEach((color) => {
		const btn = document.createElement("button");
		btn.style.backgroundColor = color;
		btn.style.width = "20px";
		btn.style.height = "20px";
		btn.style.border = "1px solid grey";
		btn.style.cursor = "pointer";
		btn.addEventListener("click", () => {
			ctx.strokeStyle = color;
			mode = "draw";
		});
		panel.appendChild(btn);
	});

	// eraser
	const eraserBtn = document.createElement("button");
	eraserBtn.textContent = "Eraser";
	eraserBtn.style.marginLeft = "10px";
	eraserBtn.addEventListener("click", () => {
		mode = mode === "erase" ? "draw" : "erase";
	});
	panel.appendChild(eraserBtn);

	// pen width
	const penWidthInput = document.createElement("input");
	penWidthInput.type = "range";
	penWidthInput.min = "1";
	penWidthInput.max = "50";
	penWidthInput.value = "3";
	penWidthInput.style.marginLeft = "10px";
	penWidthInput.addEventListener("input", (e) => {
		ctx.lineWidth = e.target.value;
	});
	panel.appendChild(penWidthInput);
	penWidthInput.addEventListener("change", (e) => {
		ctx.lineWidth = e.target.value;
	});
	// pen width label
	const penWidthLabel = document.createElement("label");
	penWidthLabel.textContent = "Pen Width";
	penWidthLabel.style.marginLeft = "5px";
	penWidthLabel.style.fontSize = "12px";
	penWidthLabel.style.color = "black";
	panel.appendChild(penWidthLabel);
	// pen width value
	const penWidthValue = document.createElement("span");
	penWidthValue.textContent = ctx.lineWidth;
	penWidthValue.style.marginLeft = "5px";
	penWidthValue.style.fontSize = "12px";
	penWidthValue.style.color = "black";
	panel.appendChild(penWidthValue);
	penWidthInput.addEventListener("input", (e) => {
		penWidthValue.textContent = e.target.value;
	});
	// pen width value label
	const penWidthValueLabel = document.createElement("label");
	penWidthValueLabel.textContent = "px";
	penWidthValueLabel.style.marginLeft = "5px";
	penWidthValueLabel.style.fontSize = "12px";
	penWidthValueLabel.style.color = "black";
	panel.appendChild(penWidthValueLabel);

	// Clear
	const clearBtn = document.createElement("button");
	clearBtn.textContent = "Clear";
	clearBtn.style.marginLeft = "10px";
	clearBtn.addEventListener("click", () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	});
	panel.appendChild(clearBtn);

	// Close
	const closeBtn = document.createElement("button");
	closeBtn.textContent = "Close";
	closeBtn.style.marginLeft = "5px";
	closeBtn.addEventListener("click", () => {
		document.body.removeChild(canvas);
		document.body.removeChild(panel);
	});
	panel.appendChild(closeBtn);

	// window resize
	window.addEventListener("resize", () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx.lineWidth = 3;
		ctx.lineCap = "round";
	});

	// keyboard events
	document.addEventListener("keydown", (e) => {
		switch (e.key) {
			case "Escape":
				document.body.removeChild(canvas);
				document.body.removeChild(panel);
				break;
			case "Enter":
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				break;
			case "Backspace":
				mode = mode === "erase" ? "draw" : "erase";
				break;
			case "1":
				ctx.strokeStyle = "red";
				mode = "draw";
				break;
			case "2":
				ctx.strokeStyle = "blue";
				mode = "draw";
				break;
			case "3":
				ctx.strokeStyle = "green";
				mode = "draw";
				break;
			case "4":
				ctx.strokeStyle = "yellow";
				mode = "draw";
				break;
			case "5":
				ctx.strokeStyle = "black";
				mode = "draw";
				break;
			case "6":
				ctx.strokeStyle = "white";
				mode = "draw";
				break;
			default:
				break;
		}
	});
})();
