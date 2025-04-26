(() => {
	if (document.getElementById("drawingCanvas"))
		return (
			document.body.removeChild(document.getElementById("drawingCanvas")),
			void document.body.removeChild(
				document.getElementById("drawingControls")
			)
		);
	const e = document.createElement("canvas");
	(e.id = "drawingCanvas"),
		(e.width = window.innerWidth),
		(e.height = window.innerHeight),
		(e.style.position = "fixed"),
		(e.style.top = "0"),
		(e.style.left = "0"),
		(e.style.zIndex = "10000"),
		(e.style.cursor = "crosshair"),
		document.body.appendChild(e);
	const t = e.getContext("2d");
	(t.lineWidth = 3), (t.lineCap = "round"), (t.strokeStyle = "red");
	let n = !1,
		o = 0,
		d = 0,
		l = "draw";
	const i = 7;
	function s() {
		n = !1;
	}
	e.addEventListener("mousedown", function (e) {
		let i, s;
		(n = !0),
			e.touches
				? ((i = e.touches[0].clientX), (s = e.touches[0].clientY))
				: ((i = e.clientX), (s = e.clientY)),
			([o, d] = [i, s]),
			"erase" !== l &&
				(t.beginPath(),
				t.arc(i, s, t.lineWidth / 2, 0, 2 * Math.PI),
				(t.fillStyle = t.strokeStyle),
				t.fill());
	}),
		e.addEventListener("mousemove", function (e) {
			"erase" == l
				? (function (e) {
						if (!n) return;
						let o, d;
						e.preventDefault(),
							e.touches
								? ((o = e.touches[0].clientX),
								  (d = e.touches[0].clientY))
								: ((o = e.clientX), (d = e.clientY));
						const l = t.lineWidth * i;
						t.clearRect(o - l / 2, d - l / 2, l, l);
				  })(e)
				: (function (e) {
						if (!n || "erase" == l) return;
						let i, s;
						e.preventDefault(),
							e.touches
								? ((i = e.touches[0].clientX),
								  (s = e.touches[0].clientY))
								: ((i = e.clientX), (s = e.clientY)),
							t.beginPath(),
							t.moveTo(o, d),
							t.lineTo(i, s),
							t.stroke(),
							([o, d] = [i, s]);
				  })(e);
		}),
		e.addEventListener("mouseup", s),
		e.addEventListener("mouseout", s);
	const r = document.createElement("div");
	(r.id = "drawingControls"),
		(r.style.position = "fixed"),
		(r.style.top = "10px"),
		(r.style.left = "10px"),
		(r.style.padding = "20px"),
		(r.style.backgroundColor = "rgba(200, 200, 200, 0.8)"),
		(r.style.border = "2px solid black"),
		(r.style.borderRadius = "5px"),
		(r.style.zIndex = "10001"),
		(r.style.display = "flex"),
		(r.style.gap = "10px"),
		(r.style.cursor = "move"),
		document.body.appendChild(r);
	let c,
		a,
		u = !1;
	const m = (e) => {
			let t, n;
			(u = !0),
				(document.body.style.userSelect = "none"),
				e.touches
					? ((t = e.touches[0].clientX), (n = e.touches[0].clientY))
					: ((t = e.clientX), (n = e.clientY)),
				(c = t - r.offsetLeft),
				(a = n - r.offsetTop),
				document.addEventListener("mousemove", h),
				document.addEventListener("mouseup", p),
				document.addEventListener("touchmove", h, { passive: !1 }),
				document.addEventListener("touchend", p);
		},
		h = (e) => {
			if (!u) return;
			let t, n;
			e.preventDefault(),
				e.touches
					? ((t = e.touches[0].clientX), (n = e.touches[0].clientY))
					: ((t = e.clientX), (n = e.clientY)),
				(r.style.left = t - c + "px"),
				(r.style.top = n - a + "px");
		},
		p = () => {
			u &&
				((u = !1),
				(document.body.style.userSelect = ""),
				document.removeEventListener("mousemove", h),
				document.removeEventListener("mouseup", p),
				document.removeEventListener("touchmove", h),
				document.removeEventListener("touchend", p));
		};
	r.addEventListener("mousedown", m), r.addEventListener("touchstart", m);
	["red", "blue", "green", "yellow", "black", "white"].forEach((e) => {
		const n = document.createElement("button");
		(n.style.backgroundColor = e),
			(n.style.width = "20px"),
			(n.style.height = "20px"),
			(n.style.border = "1px solid grey"),
			(n.style.cursor = "pointer"),
			n.addEventListener("click", () => {
				(t.strokeStyle = e), (l = "draw");
			}),
			r.appendChild(n);
	});
	const y = document.createElement("button");
	(y.textContent = "Eraser"),
		(y.style.marginLeft = "10px"),
		y.addEventListener("click", () => {
			l = "erase" === l ? "draw" : "erase";
		}),
		r.appendChild(y);
	const v = document.createElement("input");
	(v.type = "range"),
		(v.min = "1"),
		(v.max = "50"),
		(v.value = "3"),
		(v.style.marginLeft = "10px"),
		v.addEventListener("input", (e) => {
			t.lineWidth = e.target.value;
		}),
		r.appendChild(v),
		v.addEventListener("change", (e) => {
			t.lineWidth = e.target.value;
		});
	const b = document.createElement("label");
	(b.textContent = "Pen Width"),
		(b.style.marginLeft = "5px"),
		(b.style.fontSize = "12px"),
		(b.style.color = "black"),
		r.appendChild(b);
	const E = document.createElement("span");
	(E.textContent = t.lineWidth),
		(E.style.marginLeft = "5px"),
		(E.style.fontSize = "12px"),
		(E.style.color = "black"),
		r.appendChild(E),
		v.addEventListener("input", (e) => {
			E.textContent = e.target.value;
		});
	const g = document.createElement("label");
	(g.textContent = "px"),
		(g.style.marginLeft = "5px"),
		(g.style.fontSize = "12px"),
		(g.style.color = "black"),
		r.appendChild(g);
	const w = document.createElement("button");
	(w.textContent = "Clear"),
		(w.style.marginLeft = "10px"),
		w.addEventListener("click", () => {
			t.clearRect(0, 0, e.width, e.height);
		}),
		r.appendChild(w);
	const f = document.createElement("button");
	(f.textContent = "Close"),
		(f.style.marginLeft = "5px"),
		f.addEventListener("click", () => {
			document.body.removeChild(e), document.body.removeChild(r);
		}),
		r.appendChild(f),
		window.addEventListener("resize", () => {
			(e.width = window.innerWidth),
				(e.height = window.innerHeight),
				(t.lineWidth = 3),
				(t.lineCap = "round");
		}),
		document.addEventListener("keydown", (n) => {
			switch (n.key) {
				case "Escape":
					document.body.removeChild(e), document.body.removeChild(r);
					break;
				case "Enter":
					t.clearRect(0, 0, e.width, e.height);
					break;
				case "Backspace":
					l = "erase" === l ? "draw" : "erase";
					break;
				case "1":
					(t.strokeStyle = "red"), (l = "draw");
					break;
				case "2":
					(t.strokeStyle = "blue"), (l = "draw");
					break;
				case "3":
					(t.strokeStyle = "green"), (l = "draw");
					break;
				case "4":
					(t.strokeStyle = "yellow"), (l = "draw");
					break;
				case "5":
					(t.strokeStyle = "black"), (l = "draw");
					break;
				case "6":
					(t.strokeStyle = "white"), (l = "draw");
			}
		});
})();
