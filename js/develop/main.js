var mobile = false;

var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

function focusedScroll(wrp) {
	var content = document.getElementById(wrp);
	content.onwheel = function(e) {
		var target = $(this).find(".simplebar-content")[0];
		e.stopPropagation();
		var delta = e.deltaY || e.detail || e.wheelDelta;
		if(target) {
			if(delta < 0 && target.scrollTop == 0) {
				e.preventDefault();
			}
			if(delta > 0 && target.scrollHeight - target.clientHeight - target.scrollTop <= 1) {
				e.preventDefault();
			}
		} else {
			e.preventDefault();
		}
	};
	window.onwheel = function(e) {
		e.preventDefault();
	};
	document.onwheel = function(e) {
		e.preventDefault();
	};
}
function destFocusedScroll() {
	window.onwheel = function(e) {
		return true;
	};
	document.onwheel = function(e) {
		return true;
	};
}

/* select2 for color slector for product.html properties */
var srcObj = {};
function defineSrc(c) {
	for(var j = 0; j < c.length; j++) {
		var attr = $(c[j]).attr("data-color");
		var src = $(c[j]).attr("src");
		srcObj[attr] = src;
	}
}
function setPlaceholder(colorSelectTarg) {
	var src = null;
	var selectVal = $("#prod_color").children(":selected");
	selectVal = $(selectVal).attr("value");
	$(colorSelectTarg).addClass("colored");
	for(var key in srcObj) {
		if(key == selectVal) {
			src = srcObj[key];
		}
	}
	$(colorSelectTarg).css("background-image", "url(" + src + ")");
}
function afterOpen(data, jqKey) {
	$(".select2-results>.select2-results__options>.select2-results__option").addClass("colored");
	for(var i = 0; i < data.length; i++) {
		var value = data[i].value;
		var src_data = null;
		var target_child = data[i];
		var target_id = target_child[jqKey].data._resultId;
		for(var key in srcObj) {
			if(key == value) {
				src_data = srcObj[key];
			}
		}
		target_id = "#" + target_id;
		$(target_id).css("background-image", "url(" + src_data + ")");
	}
}

/* main page slider properties */
function gallerySwipe(els, func) {
	var left = $("#lead_left");
	var right = $("#lead_right");
	$(left).click(function() {
		func("left");
	});
	$(right).click(function() {
		func("right");
	});
}
function SetGallery(prop) { /* argument - pass an object for properties */
	/* create the properties */
	this.prop = {
		currentN: 0,
		negativN: 0,
		maxN: 4,
		maxSeqN: 6,
		z: 17,
		width: null,
		container: $(".head-slider-ins")[0],
		parent: $(this.container).parent()[0],
		swipe: gallerySwipe,
		dots: $(".btn-slide").children(),
		children: [],
		allchilds: [],
		currChilds: [],
		seqChilds: [],
		classes: {
			dot: "btn-active"
		}
	};
	this.frequent = {
		setdotStyle: function(t) {
			$(t).addClass(this.prop.classes.dot);
		},
		removeDotStyle: function(t) {
			$(t).removeClass(this.prop.classes.dot);
		},
		getWidth: function() {
			var width = $(this.prop.parent).innerWidth();
			this.prop.width = width;
			return width;
		},
		setWidth: function(t, width) {
			width = width || this.prop.width;
			$(t).css("width", width + "px");
		},
		setRight: function(t, n, val) { // n - seqN
			val = val || (n * this.prop.width);
			val = val + "px";
			$(t).css("right", val);
		},
		zRight: function(t, n, z, val) { // z - "min", or false. "min" - hide moving element
			if(z == "min") {
				z = this.prop.z - 1;
			} else {
				z = this.prop.z;
			}
			$(t).css("z-index", z);
			this.frequent.setRight(t, n, val);
		}
	};
	this.stand = {
		certWidth: function() {
			var width = this.prop.width * (this.prop.maxSeqN + 1);
			this.frequent.setWidth(this.prop.container, width);
			var right = this.prop.width * -1;
			this.frequent.setRight(this.prop.container, null, right);
		},
		setWidth: function() {
			this.frequent.getWidth();
			this.stand.certWidth();
			var sequent = this.prop.negativN;
			function elWidth(n) {
				var t = this.prop.seqChilds[n];
				this.frequent.setWidth(t);
				this.frequent.setRight(t, sequent);
				sequent++;
				if(n + 1 != this.prop.seqChilds.lenght) {
					return elWidth(n + 1);
				} else {
					return;
				}
			}
			elWidth(0);
		},
		psuedoSlide: function(el) {
			var clone = $(el).clone().appendTo(this.prop.container);
			return clone;
		},
		setChildren: function() {
			this.prop.children = $(this.prop.container).children();
			return this.prop.children;
		},
		runDots: function(t, n) {
			if(n === this.prop.currentN) {
				return false;
			} else {
				this.prop.currentN = n;
				this.prop.negativN = 0 - (n + 1);
				$(this.prop.seqChilds).each(function(i, el) {
					if(i === n) {
						this.frequent.dotStyle(this.prop.dots[i]);
					} else {
						this.frequent.removeDotStyle(this.prop.dots[i]);
					}
					var sequent = this.prop.negativN + i;
					this.frequent.setRight(el, sequent);
				});
			}
		}
	};
	this.swipe = function(dir) {
		if(dir == "left") dir = -1;
		if(dir == "right") dir = 1;
		this.prop.currentN += dir;
		if(this.prop.currentN < 0) this.prop.currentN = this.prop.maxN;
		if(this.prop.currentN > this.prop.maxN) this.prop.currentN = 0;
	};
	this.core = function() {
		this.frequent.getWidth();
		this.stand.certWidth();
		this.stand.setChildren();
		$(this.prop.children).each(function(i, el) {
			if(i === 0) {
				var psuedoEl = this.stand.psuedoSlide(el);
				this.frequent.setWidth(psuedoEl);
				this.frequent.zRight(psuedoEl, i, "max");
				this.prop.allchilds[i] = {
					el: psuedoEl,
					digN: i
				};
				this.prop.seqChilds[i] = this.prop.allchilds[i];
			}
			if(i === this.prop.maxN) {
				var psuedoEl = this.stand.psuedoSlide(el);
				this.frequent.setWidth(psuedoEl);
				this.frequent.zRight(psuedoEl, i + 2, "max");
				this.prop.allchilds[i + 2] = {
					el: psuedoEl,
					digN: i
				};
				this.prop.seqChilds[i + 2] = this.prop.allchilds[i + 2];
			}
			var sequent = i + 1;
			this.frequent.setWidth(el);
			this.frequent.zRight(el, sequent, "max");
			this.prop.allchilds[sequent] = {
				el: el,
				digN: i
			};
			this.prop.currChilds[i] = this.prop.allchilds[sequent];
			this.prop.seqChilds[sequent] = this.prop.allchilds[sequent];
			var clas = this;
			var dot = this.prop.dots[i];
			$(dot).click(this.stand.runDots.bind(clas, dot, i));
		});
	};
	this.core();
}
var numberItem = 1;
function runHeadSlider(props) {
	var prop = {
		container: $(props),
		parent: null,
		width: null,
		count: 4,
		num: 1,
		dots: $(".btn-slide").children(),
		dotStyle: "btn-active"
	};
	prop.parent = $(prop.container).parent();
	function addStyle(t, n) {
		if(n.prop) {
			$(t).css(n.prop, n.value);
		} else {
			$(t).css(n);
		}
	}
	function addDotClass(t) {
		var dots = prop.dots;
		for(var i = 1; i <= dots.length; i++) {
			$(dots[(i - 1)]).removeClass(prop.dotStyle);
		}
		$(dots[(t - 1)]).addClass(prop.dotStyle);
	}
	var target = {
		main: {
			el: $(".head-slider-ins"),
			style: function(n) {
				addStyle(".head-slider-ins", n);
			}
		},
		items: function(n) {
			addStyle(".slide", n);
		},
		arr: {
			item1: function(n) {
				addStyle(".slide1", n);
			},
			item2: function(n) {
				addStyle(".slide2", n);
			},
			item3: function(n) {
				addStyle(".slide3", n);
			},
			item4: function(n) {
				addStyle(".slide4", n);
			}
		}
	};
	prop.width = $(prop.parent[0]).innerWidth();
	addStyle(prop.container, {
		"width": (prop.count * prop.width + "px"),
		// "right": ("-" + prop.width + "px")
		"right": "0px"
	});
	for(var j = 1; j <= prop.count; j++) {
		target.arr[("item" + j)]({
			"width": (prop.width + "px")
		});
	}
	function setPoint(n) {
		// var direction = null;
		// if(prop.num > n)
		prop.num = n;
		addDotClass(n);
		var r = 0 - (n * prop.width - prop.width);
		for(var k = 1; k <= prop.count; k++) {
			console.log(r);
			console.log(k);
			console.log(n);
			// if(n < 1) n = prop.count;
			// if(n > prop.count) n = 1;
			var styleObj = {
				"right": (r + "px"),
				"transition": "right 0.4s ease"
			};
			console.log(styleObj);
			// if(n === prop.num - 1 || n === prop.num || n === prop.num + 1) {
			//     styleObj["transition"] = "right 0.4s ease";
			// }
			target.arr[("item" + k)](styleObj);
			r += prop.width;
			// n++;
		}
	}

	setPoint(numberItem);
	$(prop.dots).each(function(index, el) {
		$(el).click(function(e) {
			var n = index + 1;
			numberItem = n;
			setPoint(n);
		});
	});
}

function runScroll(i, el) { // properties for scrollbar plugin
	if($(el).id == "content_r") return;
	new SimpleBar(el, {
		autoHide: false,
		forceVisible: "y",
		classNames: {
			track: "track",
			scrollbar: "scroll-line"
		}
	});
}
var rightPnlScroll = null;

function countMainBg() { /* counter for size of images advertising group of main page */
	var array = $(".items").children();
	for(var i = 1; i < array.length; ) {
		$(array[i]).addClass("item-l");
		i = i + 1;
		$(array[i]).addClass("item-l");
		i = i + 2;
	}
}
/* galleries reinits */
function countSlide(n1, n2, n3) {
	var blockWidth = $("body").width();
	if(blockWidth < 630) return n3;
	else if(blockWidth < 830) return n2;
	else return n1;
}
var reinitGallery = null;
var reinitProduct = null;
var reinitBlog = null;

var sideWidth = "500px";
var minSideWidth = "100px";
function openMenuRight(event, close) {
	var content = document.getElementById("content_r");
	if(event) event.stopPropagation();
	function closeMenuRight(event) {
		if(event) event.stopPropagation();
		content.onwheel = function(e) {
			return true;
		};
		window.onwheel = function(e) {
			return true;
		};
		document.onwheel = function(e) {
			return true;
		};
		if(mobile) {
			$(".right-side").removeClass("down");
		} else {
			// $(".right-side").css("width", minSideWidth);
			$(".right-side").removeClass("right-side-open");
			$(".global-wrapper").removeClass("wider-right");
			$(".main-header").removeClass("wider-r");
			$(".main").removeClass("add-padding-r");
			$(".half-header").css("pointer-events", "auto");
			$(".wrap1").css("pointer-events", "auto");
			$(".right-side .scroll-line").css("opacity", "0");
			$(".right-side .bag-datas").off("click");
			$(".right-side").click(openMenuRight);
			$(document).off("click", hideRight);
		}
		setTimeout(function() {
			rightPnlScroll.recalculate();
		}, 500);

	}
	if(close) {
		console.log("close right");
		closeMenuRight();
		return;
	}
	content.onwheel = function(e) {
		var target = $(this).find(".simplebar-content")[0];
		e.stopPropagation();
		var delta = e.deltaY || e.detail || e.wheelDelta;
		if(delta < 0 && target.scrollTop == 0) {
			e.preventDefault();
		}
		if(delta > 0 && target.scrollHeight - target.clientHeight - target.scrollTop <= 1) {
			e.preventDefault();
		}
	};
	window.onwheel = function(e) {
		e.preventDefault();
	};
	document.onwheel = function(e) {
		e.preventDefault();
	};
	if(mobile) {
		event.preventDefault();
		$(".right-side").addClass("down");
		$(".right-side .top-group .close").click(closeMenuRight);
		setTimeout(function() {
			rightPnlScroll.recalculate();
		}, 500);
	} else {
		// $(".right-side").css("width", sideWidth);
		$(".right-side").addClass("right-side-open");
		$(".global-wrapper").addClass("wider-right");
		$(".main-header").addClass("wider-r");
		$(".main").addClass("add-padding-r");
		$(".half-header").css("pointer-events", "none");
		$(".wrap1").css("pointer-events", "none");
		$(".right-side .scroll-line").css("opacity", "1");
		$(".right-side").off("click");
		$(".right-side .bag-datas").click(closeMenuRight);
		setTimeout(function() {
			rightPnlScroll.recalculate();
		}, 500);
		function hideRight(event) {
			if($(event.target).closest(".right-side").length) return;
			closeMenuRight(event);
		}
		$(document).click(hideRight);
	}
}
function openMenuLeft(event, close) {
	var content = document.getElementById("content_l");
	if(event) event.stopPropagation();
	function closeMenuLeft(event) {
		if(event) event.stopPropagation();
		content.onwheel = function(e) {
			return true;
		};
		window.onwheel = function(e) {
			return true;
		};
		document.onwheel = function(e) {
			return true;
		};
		if(mobile) {
			$(".left-side").removeClass("down");
		} else {
			// $(".left-side").css("width", minSideWidth);
			$(".left-side").removeClass("left-side-open");
			$(".global-wrapper").removeClass("wider-left");
			$(".main-header").removeClass("wider");
			$(".main").removeClass("add-padding-l");
			$(".half-header").css("pointer-events", "auto");
			$(".wrap1").css("pointer-events", "auto");
			$(".heart-group").off("click");
			$(".heart-group").click(openMenuLeft);
			$(document).off("click", hideLeft);
		}
	}
	if(close) {
		closeMenuLeft();
		return;
	}
	content.onwheel = function(e) {
		var target = $(this).find(".simplebar-content")[0];
		e.stopPropagation();
		var delta = e.deltaY || e.detail || e.wheelDelta;
		if(delta < 0 && target.scrollTop == 0) {
			e.preventDefault();
		}
		if(delta > 0 && target.scrollHeight - target.clientHeight - target.scrollTop <= 1) {
			e.preventDefault();
		}
	};
	window.onwheel = function(e) {
		e.preventDefault();
	};
	document.onwheel = function(e) {
		e.preventDefault();
	};
	if(mobile) {
		event.preventDefault();
		$(".left-side").addClass("down");
		$(".left-side .top-group .close").click(closeMenuLeft);
	} else {
		// $(".left-side").css("width", sideWidth);
		$(".left-side").addClass("left-side-open");
		$(".global-wrapper").addClass("wider-left");
		$(".main-header").addClass("wider");
		$(".main").addClass("add-padding-l");
		$(".half-header").css("pointer-events", "none");
		$(".wrap1").css("pointer-events", "none");
		$(".heart-group").off("click");
		$(".heart-group").click(closeMenuLeft);
		function hideLeft(event) {
			if($(event.target).closest(".left-side").length) return;
			closeMenuLeft(event);
		}
		$(document).click(hideLeft);
	}
}

function openMainMenu(e, close) {
	var content = $(".menu-ins")[0];
	if(e) e.stopPropagation();
	function closeMainMenu(event) {
		if(event) event.stopPropagation();
		content.onwheel = function(e) {
			return true;
		};
		window.onwheel = function(e) {
			return true;
		};
		document.onwheel = function(e) {
			return true;
		};
		$(".menu-ins").css("right", "-100vw");
		$(".menu").removeClass("menu_active");
		$(".menu-ins").removeClass("active");
		$("#close_main_menu").off("click");
		var submenus = $(".sub-menu-block>.sub-menu li .deeppest");
		$(submenus).each(function(i, el) {
			$(el).removeClass("open");
		});
		var links = $(".sub-menu-block>.sub-menu .sub-link .buttons-menu");
		$(links).each(function(i, el) {
			$(el).off("click");
			var dippest = $(el).next(".deeppest")[0];
			$(dippest).removeClass("open");
			dippest.onwheel = function(e) {
				return true;
			};
		});
	}
	if(close) {
		closeMainMenu();
		return;
	}
	content.onwheel = function(e) {
		var target = $(this).find(".simplebar-content")[0];
		e.stopPropagation();
		var delta = e.deltaY || e.detail || e.wheelDelta;
		if(delta < 0 && target.scrollTop == 0) {
			e.preventDefault();

		}
		if(delta > 0 && target.scrollHeight - target.clientHeight - target.scrollTop <= 1) {
			e.preventDefault();
		}
	};
	window.onwheel = function(e) {
		e.preventDefault();
	};
	document.onwheel = function(e) {
		e.preventDefault();
	};
	$(".menu-ins").css("right", 0);
	$(".menu").addClass("menu_active");
	$(".menu-ins2").addClass("scroll");
	$('.scroll').each(runScroll);
	setTimeout(function() {
		$(".menu-ins").addClass("active");
	}, 500);
	var links = $(".sub-menu-block>.sub-menu .sub-link .buttons-menu");
	$(links).each(function(i, el) {
		$(el).click(function(e) {
			e.preventDefault();
			var dippest = $(el).next(".deeppest");
			$(dippest).addClass("open");
			var simpcontent = $(".menu-ins2 .simplebar-content")[0];
			var top = $(simpcontent).find(".menu-ins3")[0];
			top = top.getBoundingClientRect().top;
			$(dippest).css("top", (-top + "px"));
			var track = $(".menu-ins2>.track.simplebar-vertical")[0];
			$(simpcontent).css("overflow", "hidden");
			$(track).css("display", "none");
			dippest = dippest[0];
			dippest.onwheel = function(e) {
				var target = $(this).find(".simplebar-content")[0];
				e.stopPropagation();
				var delta = e.deltaY || e.detail || e.wheelDelta;
				if(delta < 0 && target.scrollTop == 0) {
					e.preventDefault();

				}
				if(delta > 0 && target.scrollHeight - target.clientHeight - target.scrollTop <= 1) {
					e.preventDefault();
				}
			};
		});
	});
	$("#close_main_menu").click(closeMainMenu);
}

function openCateg() {
	var initEl = $(this);
	var content = $($(initEl).siblings(".select-content"));
	var h = $($($(initEl).siblings(".select-content")).find(".select-content-ins")).innerHeight() + "px";
	if($(content).hasClass("sl-closed")) {
		$(content).removeClass("sl-closed");
		$($(initEl).find(".indicat")).toggleClass("indicat-pls");
		$(content).css("height", h);
	} else {
		$($(initEl).find(".indicat")).toggleClass("indicat-pls");
		$(content).css("height", 0);
		setTimeout(function() {
			$(content).addClass("sl-closed");
		}, 400);
	}
}

// function runSimpImg(close) {
//     var links = $(".exemp-group").find("a");
//     if(close) {
//         $(links).each(function(i, item) {
//             $(item).fancybox();
//         });
//     } else {
//     $(links).each(function(i, item) {
//         $(item).fancybox();
//     });
// }
// }

/* ====================================================================================================================== */
var catalogCtgrInfo = {};
function hideSubCtgr(item) {
	if(item) {
		item = catalogCtgrInfo[item].parent;
		$(item).removeClass("open");
	} else {
		for(var key in catalogCtgrInfo) {
			$(catalogCtgrInfo[key].parent).removeClass("open");
		}
	}
}
function createCategory() {
	var target = $(".hidden-list")[0];
	var source = $("#select_catalog .select-group");
	function addMainItem(text, targ) {
		var div = $("<div></div>").appendTo(target).addClass("itemMain").text(text);
		$(div).click(function() {
			$(targ).addClass("open");
		});
	}
	function setDef(elSource, child, sib_btn) {
		$(elSource).css("display", "none");
		$(sib_btn).css("display", "flex");
		for(var i = 0; i < child.length; i++) {
			var ch = child[i];
			ch.checked = false;
		}
	}
	function setAll(elSource, child, sib_btn) {
		$(elSource).css("display", "none");
		$(sib_btn).css("display", "flex");
		for(var i = 0; i < child.length; i++) {
			var ch = child[i];
			ch.checked = true;
		}
	}
	function setInputs(inputs, all_btn, def_btn, first) {
		var setAll = true;
		for(var i = 0; i < inputs.length; i++) {
			if(inputs[i].checked) {
				setAll = false;
			}
			if(first) {
				$(inputs[i]).click(setInputs.bind(null, inputs, all_btn, def_btn));
			}
		}
		if(setAll) {
			$(all_btn).css("display", "flex");
			$(def_btn).css("display", "none");
		} else {
			$(all_btn).css("display", "none");
			$(def_btn).css("display", "flex");
		}
	}

	for(var i = 0; i < source.length; i++) {
		var n = "ctgr_" + i;
		$(source[i]).addClass(n);
		catalogCtgrInfo[n] = {};
		tempCtgr = catalogCtgrInfo[n];
		tempCtgr.parent = $(source[i]);
		if($(tempCtgr.parent).hasClass("numbers")) {
			tempCtgr.numbers = true;
			tempCtgr.input1 = $(source[i]).find(".select-content input")[0];
			tempCtgr.val1 = $(tempCtgr.input1).attr("value");
			tempCtgr.input2 = $(source[i]).find(".select-content input")[1];
			tempCtgr.val2 = $(tempCtgr.input2).attr("value");
		} else {
			tempCtgr.numbers = false;
			tempCtgr.inputs = $(source[i]).find(".select-content input");
		}
		tempCtgr.returnBtn = $(source[i]).find(".return-btn")[0];
		tempCtgr.def_btn = $(source[i]).find(".def-check-btn")[0];
		if(!tempCtgr.numbers) {
			tempCtgr.all_btn = $(source[i]).find(".all-check-btn")[0];
		} else {
			$(tempCtgr.def_btn).css("display", "none");
		}
		tempCtgr.title = $(source[i]).find(".name")[0];
		tempCtgr.title = $(tempCtgr.title).text();
		addMainItem(tempCtgr.title, tempCtgr.parent);
		var openContent = $(tempCtgr).find(".select-open");
		$(openContent).off("click", "openCateg");
		(function(it) {
			$(tempCtgr.returnBtn).click(function(e) {
				hideSubCtgr(it);
			});
		})(n);
		if(!tempCtgr.numbers) {
			(function(it) {
				$(catalogCtgrInfo[it].all_btn).click(function(e) {
					setAll(this, catalogCtgrInfo[it].inputs, catalogCtgrInfo[it].def_btn);
				});
			})(n);
			(function(it) {
				$(catalogCtgrInfo[it].def_btn).click(function(e) {
					setDef(this, catalogCtgrInfo[it].inputs, catalogCtgrInfo[it].all_btn);
				});
			})(n);
			(function(it) {
				setInputs(catalogCtgrInfo[it].inputs, catalogCtgrInfo[it].all_btn, catalogCtgrInfo[it].def_btn, true);
			})(n);
		} else {
			(function(it) {
				$(tempCtgr.def_btn).click(function(e) {
					$(this).css("display", "none");
					$(catalogCtgrInfo[it].input1).attr("value", catalogCtgrInfo[it].val1);
					$(catalogCtgrInfo[it].input2).attr("value", catalogCtgrInfo[it].val2);
				});
			})(n);
			(function(it) {
				function checkInputs() {
					var val1 = 0;
					var val2 = 0;
					if(this.name == "feature3_from") {
						val1 = this.value;
						val2 = $(catalogCtgrInfo[it].input2).attr("value");
					} else {
						val2 = this.value;
						val1 = $(catalogCtgrInfo[it].input1).attr("value");
					}
					if(((val1 === catalogCtgrInfo[it].val1) || (val1 == 0 || val1 == "")) && ((val2 === catalogCtgrInfo[it].val2) || (val2 == 0 || val2 == ""))) {
						$(catalogCtgrInfo[it].def_btn).css("display", "none");
					} else {
						$(catalogCtgrInfo[it].def_btn).css("display", "flex");
					}
				}
				catalogCtgrInfo[it].input1.onchange = checkInputs;
				catalogCtgrInfo[it].input2.onchange = checkInputs;
				catalogCtgrInfo[it].input1.oninput = checkInputs;
				catalogCtgrInfo[it].input2.oninput = checkInputs;
			})(n);
		}

	}
}



function openSelectCategory(e, close) {
	var content = $(".selecting-ins2")[0];
	if(e) e.stopPropagation();
	function closeSelectCategory(event) {
		if(event) event.stopPropagation();
		content.onwheel = function(e) {
			return true;
		};
		window.onwheel = function(e) {
			return true;
		};
		document.onwheel = function(e) {
			return true;
		};
		$(".selecting-ins2").removeClass("activeComp");
		$(".selecting-ins2").removeClass("active");
		hideSubCtgr();
	}
	if(close) {
		closeSelectCategory();
		return;
	}
	content.onwheel = function(e) {
		var target = $(this).find(".simplebar-content")[0];
		e.stopPropagation();
		var delta = e.deltaY || e.detail || e.wheelDelta;
		if(delta < 0 && target.scrollTop == 0) {
			e.preventDefault();

		}
		if(delta > 0 && target.scrollHeight - target.clientHeight - target.scrollTop <= 1) {
			e.preventDefault();
		}
	};
	window.onwheel = function(e) {
		e.preventDefault();
	};
	document.onwheel = function(e) {
		e.preventDefault();
	};
	$(".selecting-ins2").addClass("activeComp");
	// $(".hidden-list").addClass("scroll");
	// $('.scroll').each(runScroll);
	setTimeout(function() {
		$(".selecting-ins2").addClass("active");
	}, 500);
	$("#select_catalog_submit, #close_main_menu").click(closeSelectCategory);
}

/* ========================================================================================================================= */



function createUlTitle() {
	var parentLi = $(".sub-menu-block>.sub-menu>.sub-link");
	if(mobile) {
		$(parentLi).each(function(i, el) {
			var str = $(el).find(".buttons-menu span:not(.plus):not(.image)")[0];
			str = $(str).text();
			var ul = $(el).find(".deeppest")[0];
			if($(ul).find(".first")[0]) {
				return;
			} else {
				var li = $("<li class='first deeppest-ins'></li>").prependTo(ul);
				var button = $("<button type='button'></button>").prependTo(li).append("<span></span>");
				$(li).append(("<span>" + str + "</span>"));
				$(button).click(function() {
					$(ul).removeClass("open");
					ul.onwheel = function(e) {
						return true;
					};
					var simpcontent = $(".menu-ins2 .simplebar-content")[0];
					var track = $(".menu-ins2>.track.simplebar-vertical")[0];
					$(simpcontent).css("overflow", "hidden scroll");
					$(track).css("display", "block");
				});
			}
			$(ul).addClass("scroll");
			$(ul).each(runScroll);
		});
	} else {
		$(parentLi).each(function(i, el) {
			var el = $(el).find(".deeppest .first")[0];
			if(el) $(el).remove();
		});
	}
}


$(document).ready(function() {

	$(".hidden-block").css("display", "none");
	$(window).click(function() {
		$(".succ-message").css("display", "none");
	});
	if($(window).innerWidth() <= 992) mobile = true;

	if(isMobile.any() && ($(window).innerWidth() <= 992)) {
		$(".menu-ins3").css("padding-left", "17px");
	}


	if(mobile) {
		if($(".catalog").length) {
			createCategory();
		}
	}

	setTimeout(function() {
		$(".head-slider-ins").css("opacity", "1");
	}, 800);

	$("select:not(#prod_color)").select2({
		dir: "rtl",
		minimumResultsForSearch: 20,
		languages: "he",
		theme: "default"
	});

	$("#prod_color").select2({ /* color select properties */
		dir: "rtl",
		minimumResultsForSearch: 20,
		languages: "he",
		theme: "default"
	});


	var col_container = $(".hide-colors").children();
	var colorSelectTarg = $("#prod_color + .select2-container .select2-selection--single");

	defineSrc(col_container);

	setPlaceholder(colorSelectTarg);

	$('#prod_color').on('select2:open', function(e) {
		var data = e.target.children;
		var jqKey = null;
		for(var key in data[0]) {
			if(/jQuery/.test(key)) {
				jqKey = key;
			}
		}
		setTimeout(function() {
			afterOpen(data, jqKey);
		}, 50);
	});
	$('#prod_color').on('select2:select', function(e) {
		setPlaceholder(colorSelectTarg);
	});


	/* custom scrollbar */

	$('.scroll').each(runScroll);
	rightPnlScroll = new SimpleBar($("#content_r")[0], {
		autoHide: false,
		forceVisible: "y",
		classNames: {
			track: "track",
			scrollbar: "scroll-line"
		}
	});

	countMainBg();

	/* chenge buttons on header - login or buttons */
	function changeMainButtons() {
		if($(".personal")[0] || $(".history")[0] || $(".checkout")[0]) {
			if(!mobile) $(".autorit").css("display", "none");
			if($(window).innerWidth() < 479) $(".search-group").css("display", "none");
			if($(window).innerWidth() < 400) $(".likebuy-btn").css("display", "none");
			$(".menu2").css("display", "flex");
		}
	}
	changeMainButtons();

	/* buttons of opening */
	function stopPropagate(e) {
		e.stopPropagation();
	}
	function loginClose(e) {
		$(".login-window").removeClass("open");
		setTimeout(function() {
			$(".login-window").css("display", "none");
		}, 400);
		$("#login_open").off("click", stopPropagate);
		$("#login_open2").off("click", stopPropagate);
		$(".login-window").off("click", stopPropagate);
		$(window).off("click", loginClose);
		$(window).off("onwheel", loginClose);
		$(document).off("onwheel", loginClose);
		$(window).off("scroll", loginClose);
		$(document).off("scroll", loginClose);
		$("#login_open").click(openLogin);
		$("#login_open2").click(openLogin);
		$(".login-window").removeClass("wider2");
		if(mobile) {
			var content = $(".login-window");
			content.onwheel = function(e) {
				return true;
			};
			window.onwheel = function(e) {
				return true;
			};
			document.onwheel = function(e) {
				return true;
			};
		}
	}
	function openLogin(e) { /* open login pop-up */
		var el = $(this);
		e.stopPropagation();
		e.preventDefault();
		openMainMenu(null, true);
		$(".login-window").css("display", "flex");
		$(".login-window").addClass("open");
		$(".login-window").addClass("scroll");
		$(".login-window").addClass("wider2");
		$('.scroll').each(runScroll);
		$(this).off("click", openLogin);
		$(this).click(stopPropagate);
		$(".login-window").click(stopPropagate);
		$(".login-window .links-group a, .login-window .networks-group a").click(loginClose);
		$(window).click(loginClose);
		if(!mobile) {
			$(window).scroll(loginClose);
			$(document).scroll(loginClose);
		} else {
			var content = $(".login-window");
			content.onwheel = function(e) {
				var target = $(this).find(".simplebar-content")[0];
				e.stopPropagation();
				var delta = e.deltaY || e.detail || e.wheelDelta;
				if(delta < 0 && target.scrollTop == 0) {
					e.preventDefault();

				}
				if(delta > 0 && target.scrollHeight - target.clientHeight - target.scrollTop <= 1) {
					e.preventDefault();
				}
			};
			window.onwheel = function(e) {
				e.preventDefault();
			};
			document.onwheel = function(e) {
				e.preventDefault();
			};
		}
	}
	$("#login_open").click(openLogin);
	$("#login_open2").click(openLogin);

	function searchClose(e) {
		$("#search_popup").removeClass("open");
		setTimeout(function() {
			$("#search_popup").css("visibility", "hidden");
		}, 400);
		$("#search_open").off("click", stopPropagate);
		$("#search_popup").off("click", stopPropagate);
		$(window).off("click", searchClose);
		$(window).off("onwheel", searchClose);
		$(document).off("onwheel", searchClose);
		$(window).off("scroll", searchClose);
		$(document).off("scroll", searchClose);
		$("#search_open").click(openSearch);
		destFocusedScroll();
	}
	function openSearch(e) { /* open search pop-up */
		var el = $(this);
		e.stopPropagation();
		e.preventDefault();
		$("#search_popup").css("visibility", "visible");
		$("#search_popup").addClass("open");
		$(this).off("click", openSearch);
		$(this).click(stopPropagate);
		$("#search_popup").click(stopPropagate);
		$("#search_popup .head-popup button").click(searchClose);
		if(!mobile) {
			$(window).click(searchClose);
			$(window).scroll(searchClose);
			$(document).scroll(searchClose);
		} else {
			focusedScroll("search_popup");
		}
	}
	$("#search_open").click(openSearch);

	$(".page-menu-ins li").click(function(event) { /* information page */
		var el = $(this).children().filter(".sub-menu").children();
		if($(this).children().filter(".sub-menu").innerHeight()) return;
		var count = el.length;
		var h = $(el[0]).outerHeight();
		count = count * h + "px";
		$(this).children().filter(".sub-menu").css({
			"visibility": "visible",
			"height": count
		});
		$(this).children(".buttons-menu").children().filter(".plus").addClass("minus");
		var el1 = $(this).children().filter(".buttons-menu").children();
		var el2 = $(this).children().filter(".sub-menu");
		var first = true;
		function clickOut() {
			if(first) {
				first = false;
				return;
			}
			$(el2).css("height", 0);
			$(el1).filter(".plus").removeClass("minus");
			setTimeout(function() {
				$(el2).css("visibility", "hidden");
			}, 300);
			$(window).off("click", clickOut);
		}
		$(window).on("click", clickOut);
	});

	$(".load-btn").click(function() { /* load button */
		$(this).css("opacity", 0);
		setTimeout(function() {
			$(this).css("visibility", "hidden");
		}, 800);
		$(".loader-img").css({
			"visibility": "visible",
			"opacity": 1
		});
	});

	$(".select-content").each(function(index, el) { /* catalog page */
		var h = $($(el).find(".select-content-ins")).innerHeight() + "px";
		$(el).height(h);
	});
	if(!mobile) {
		$(".select-open").click(openCateg);
	}

	function showMenImg() { // put images to menu side
		var buttonMenuArr = $(".sub-menu-block>.sub-menu").children();
		$(buttonMenuArr).each(function(i, el) {
			var targetImg = $((".sub-image .it" + (i + 1)));
			$(el).hover(function() {
				$(targetImg).css("opacity", 1);
			}, function() {
				$(targetImg).css("opacity", 0);
			});
		});
	}
	showMenImg();

	$("#scroll-btn").click(function() { // run scroll button
		$("html, body").animate({
			scrollTop: 0
		}, 500);
	});

	/* properties for moving side page */
	if($(window).innerWidth() <= 1366) {
		minSideWidth = "90px";
	}
	if($(window).innerWidth() <= 1280) {
		sideWidth = "400px";
		minSideWidth = "80px";
	}
	if($(window).innerWidth() <= 992) {
		sideWidth = "100vw";
		minSideWidth = "100vw";
	}

	$(".heart-group, #like_mob_open").click(openMenuLeft);


	$(".right-side, #bag_mob_open").click(openMenuRight);

	$(".mobile-btn").click(openMainMenu);


	$("#open_selectCategory").click(openSelectCategory);

	createUlTitle();

	/* -------------- end */

	// modals close
	$("#fancy_confirm_close, #facebook_reg, #google_reg").click(function() {
		$.fancybox.close();
	});
	$("#fancy_reg_open, #fancy_reg_opn, #fancy_reg_open2").click(function() {
		$.fancybox.open({
			src: "#registration_popup",
			type: "inline",
			opts: {
				beforeLoad: function(instance, current) {
					loginClose();
					openMainMenu(null, true);
					if($(".catalog").length) {
						openSelectCategory(null, true);
					}
				},
				clickOutside: "close",
				touch: {
					vertical: true
				}
			}
		});
	});

	$("[data-src='#newaddress']").click(function() {
		$.fancybox.open({
			src: "#newaddress",
			type: "inline",
			opts: {
				afterShow: function(instance, current) {
					$("select:not(#prod_color)").select2({
						dir: "rtl",
						minimumResultsForSearch: 20,
						languages: "he",
						theme: "default"
					});
				}
			}
		});
	});

	$("#checkout_sbm").click(function(e) {
		e.preventDefault();
		$.fancybox.open({
			src: "#confirm_popup",
			type: "inline",
			opts: {
				beforeLoad: function(instance, current) {
					loginClose();
					openMainMenu(null, true);
					if($(".catalog").length) {
						openSelectCategory(null, true);
					}
				},
				clickOutside: "close",
				touch: {
					vertical: true
				}
			}
		});
	});

	var login_wind = $(".login-window");
	$("#login_open2").click(function() {
		if(($(login_wind).innerWidth() + 100) > ($(window).innerWidth() || $(document).innerWidth())) {

			$(login_wind).find(".mark-title").css("display", "flex");
			$(login_wind).addClass("wider3");
			$(login_wind).addClass("scroll");
			var el = $(login_wind).find(".simplebar-content");
			$(el).addClass("insbar");
		}
	});

	// -----------------end

	/* gallery's slider properties */
	reinitGallery = {
		slidesToShow: countSlide(6, 4, 2),
		prevArrow: "#inst_btn_prev",
		nextArrow: "#inst_btn_next",
		infinite: false,
		rtl: true,
		slidesToScroll: (function() {
			if(countSlide(6, 4, 1) === 1) return 1;
			else return 2;
		})()
	};
	$(".images-grop").slick(reinitGallery);
	/* ---------------- end */


	runHeadSlider(".head-slider-ins");
	// $(".head-slider-ins").slick({
	//     arrows: false,
	//     appendDots: ".slider-btn-group",
	//     dots: true,
	//     dotsClass: "btn-slide",
	//     zIndex: 1000,
	//     rtl: true,
	//     slidesToShow: 1,
	//     variableWidth: true
	// });
	/* --------------------- end */

	/* product gallery slider properties */
	reinitProduct = {
		slidesToShow: countSlide(4, 3, 2),
		prevArrow: "#prod_btn_prev",
		nextArrow: "#prod_btn_next",
		infinite: false,
		rtl: true,
		slidesToScroll: (function() {
			if(countSlide(4, 3, 1) === 1) return 1;
			else return 2;
		})()
	};
	$(".prod-group").slick(reinitProduct);
	/* ---------------- end */

	/* blog gallery slider properties */
	reinitBlog = {
		slidesToShow: countSlide(3, 2, 1),
		prevArrow: "#blog_btn_prev",
		nextArrow: "#blog_btn_next",
		infinite: false,
		rtl: true,
		slidesToScroll: 1
	};
	$("#blog_gallery").slick(reinitBlog);
	/* ---------------- end */

	/* qty input control */
	function controlNumKey(e) {
		var input = this;
		if((/\D/.test(e.key))
			|| (/\./.test(e.key))) return false;
		setTimeout(function() {
			if(input.value.length > 2) input.value = input.value.slice(0, 2);
		}, 0);
	}
	function controlNumPaste(e) {
		var input = this;
		setTimeout(function() {
			if((input.value.length > 2)
				|| (input.value === "")
				|| (input.value === "00")
				|| (/\D/g.test(input.value))
				|| (/\./g.test(input.value))) input.value = "01";
			if(input.value.length === 1) input.value = "0" + input.value;
		}, 0);
	}
	function controlNumChange(e) {
		var input = this;
		if((input.value.length > 2)
			|| (input.value === "")
			|| (input.value === "00")
			|| (/\D/g.test(input.value))
			|| (/\./g.test(input.value))) input.value = "01";
		if(input.value.length === 1) input.value = "0" + input.value;
	}
	$("#prod_qty_n").keypress(controlNumKey).change(controlNumChange).on("paste", controlNumPaste).click(function() {
		$(this).select();
	});

	/* form validation */
	/* for exclude input valiadtion define disabled attribute */

	$("[name='checkout_checkbox']").change(function() {
		if(this.checked) {
			$("[name='gift']").attr("disabled", false);
		} else {
			$("[name='gift']").attr("disabled", true);
		}
	});

	var email_item = [{
			name: "email",
			required: true,
			regexp: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
		}];
	var fast_buy = [{
			name: "phone",
			required: true,
			regexp: /^[\d\-\+]+$/
		}];
	var newaddress = [{
			name: "country",
			required: true,
			targStyle: "[name='country'] + .select2 .select2-selection--single",
			targMsg: ".error-msg.country-error"
		}, {
			name: "city",
			required: true,
			targStyle: "[name='city'] + .select2 .select2-selection--single",
			targMsg: ".error-msg.city-error"
		}, {
			name: "address",
			required: true
		}, {
			name: "house_nmber",
			required: true
		}, {
			name: "index",
			required: true,
			regexp: /^[\d]{3,7}$/
		}];
	var accaunt = [{
			name: "pa_name",
			required: true
		}, {
			name: "pa_surname",
			required: true
		}, {
			name: "pa_email",
			required: true,
			regexp: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
		}, {
			name: "pa_phone",
			regexp: /^[\d\-\+]+$/
		}, {
			name: "pa_oldpass",
			regexp: /^[a-zA-Z0-9!@#$%^&*]{6,16}$/
		}, {
			name: "pa_newpass",
			regexp: /^[a-zA-Z0-9!@#$%^&*]{6,16}$/,
			prev: "pa_oldpass"
		}, {
			name: "pa_repeatpass",
			regexp: /^[a-zA-Z0-9!@#$%^&*]{6,16}$/,
			ident: "pa_newpass"
		}];
	var discount = [{
			name: "code",
			required: true
		}];
	var checkout = [{
			name: "address_list",
			required: true,
			targStyle: "[name='address'] + .select2 .select2-selection--single",
			targMsg: ".error-msg.address-error"
		}, {
			name: "names",
			required: true
		}, {
			name: "phone",
			required: true,
			regexp: /^[\d\-\+]+$/
		}, {
			name: "country",
			required: true,
			targStyle: "[name='country'] + .select2 .select2-selection--single",
			targMsg: ".error-msg.country-error"
		}, {
			name: "city",
			required: true,
			targStyle: "[name='city'] + .select2 .select2-selection--single",
			targMsg: ".error-msg.city-error"
		}, {
			name: "address",
			required: true
		}, {
			name: "house_nmber",
			required: true
		}, {
			name: "index",
			required: true,
			regexp: /^[\d]{3,7}$/
		}, {
			name: "gift",
			required: true
		}];
	var login = [{
			name: "email",
			required: true,
			regexp: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
		}, {
			name: "password",
			regexp: /^[a-zA-Z0-9!@#$%^&*]{6,16}$/
		}];
	var registration = [{
			name: "pa_name",
			required: true
		}, {
			name: "pa_surname",
			required: true
		}, {
			name: "pa_email",
			required: true,
			regexp: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
		}, {
			name: "pa_phone",
			regexp: /^[\d\-\+]+$/
		}, {
			name: "password",
			regexp: /^[a-zA-Z0-9!@#$%^&*]{6,16}$/
		}, {
			name: "password2",
			regexp: /^[a-zA-Z0-9!@#$%^&*]{6,16}$/,
			ident: "password"
		}, {
			name: "reg_checkbox",
			required: true,
			targMsg: ".error-msg.reg_checkbox"
		}];
	var search_popup = [{
			name: "search",
			required: true
		}];

	function validateFunc(name, prop, wrap) { /* default validation function */
		// args: form-name:string, properties:[{name(tag-name):string,required:boolean,regexp:regExp,regInvalidMsg:string}], wrap:string()
		var form = document.forms[name];
		var valid = true;

		var empty_msg = "The field is required"; // required-invalid message

		function putMsg(tag, msg) {
			if(tag.parentNode.getElementsByClassName(tag.name)[0]) {
				var span = tag.parentNode.getElementsByClassName(tag.name)[0];
				span.innerHTML = msg;
			} else {
				if(wrap) {
					$(tag).wrap("<div class='form-wrap'></div>");

				}
				var span = document.createElement("span");
				span.classList.add("warn");
				span.classList.add(tag.name);
				span.innerHTML = msg;
				tag.parentNode.insertBefore(span, tag.nextSibling);
			}
		}
		function showMsg(t, clas, i) {
			var afterTarget = null;
			if(prop[i].targMsg) {
				afterTarget = $(prop[i].targMsg);
			} else {
				afterTarget = $(t).next(".error-msg");
				if(!afterTarget.length) {
					afterTarget = $(t).parent().siblings(".error-msg." + $(t).attr("name"));
				}
			}
			var msgDiv = $(afterTarget).children(("." + clas));
			$(msgDiv[0]).css("display", "inline");
		}
		function hideMsg(t, clas, i) {
			var afterTarget = null;
			if(prop[i].targMsg) {
				afterTarget = $(prop[i].targMsg);
			} else {
				afterTarget = $(t).next(".error-msg");
				if(!afterTarget.length) {
					afterTarget = $(t).parent().siblings(".error-msg." + $(t).attr("name"));
				}
			}
			var msgDiv = $(afterTarget).children(("." + clas));
			$(msgDiv[0]).css("display", "none");
		}
		function removeMsg(tag) {
			var span = tag.parentNode.getElementsByClassName(tag.name)[0];
			if(span) tag.parentNode.removeChild(span);
		}
		function checkPrev(obj) {
			var prev = form[obj.prev];
			if(prev.value === "") return true;
			return false;
		}
		function checkIdent(t, obj) {
			var siblingEl = form[obj.ident];
			var ident = siblingEl.value === t.value;
			if(!ident) return true;
			return false;
		}

		for(var i = 0; i < prop.length; i++) {
			var tag = form[prop[i].name];
			function inputValidate(res, n, t) {
				if(t.disabled) return;
				var typeVal = null;
				var anyError = null;
				if(t.type == "text" || t.type == "email" || t.type == "password" || t.type == "number" || t.type == "tel") {
					if(t.value === "") typeVal = true;
				}
				if(t.type == "checkbox") {
					if(!t.checked) typeVal = true;
				}
				if(t.tagName == "SELECT") {
					if(t.value === "" || !t.value) typeVal = true;
				}
				if(prop[n].prev) {
					anyError = checkPrev(prop[n]);
					var prev = form[prop[n].prev];
					var prevoninput = t.oninput;
					if(typeVal) {
						prev.removeEventListener("input", prevoninput);
						delete prop[n].prevoninput;
					} else {
						if(!prop[n].prevoninput) {
							prev.addEventListener("input", prevoninput);
							prop[n].prevoninput = true;
						}
					}
				}
				if(prop[n].ident) {
					anyError = checkIdent(t, prop[n]);
					if(anyError) {
						typeVal = false;
					}
					var sibl = form[prop[n].ident];
					var sibloninput = t.oninput;
					if(!prop[n].sibloninput) {
						sibl.addEventListener("input", sibloninput);
						prop[n].sibloninput = true;
					}
				}
				if(((prop[n].required || t.required) && (typeVal || anyError)) || (anyError && !typeVal)) {
					if(res) valid = false;
					if(prop[n].targStyle) {
						$(prop[n].targStyle).addClass("error");
					} else {
						t.classList.add("error");
					}
					showMsg(t, "empty", n);
					hideMsg(t, "bad", n);
				} else if(prop[n].regexp && !typeVal) {
					if(!prop[n].regexp.test(t.value)) {
						if(res) valid = false;
						if(prop[n].targStyle) {
							$(prop[n].targStyle).addClass("error");
						} else {
							t.classList.add("error");
						}
						showMsg(t, "bad", n);
						hideMsg(t, "empty", n);
					} else {
						if(prop[n].targStyle) {
							$(prop[n].targStyle).removeClass("error");
						} else {
							t.classList.remove("error");
						}
						hideMsg(t, "bad", n);
						hideMsg(t, "empty", n);
					}
				} else {
					if(prop[n].targStyle) {
						$(prop[n].targStyle).removeClass("error");
					} else {
						t.classList.remove("error");
					}
					hideMsg(t, "empty", n);
					hideMsg(t, "bad", n);
				}
			}
			var n = i;
			var t = form[prop[n].name];
			tag.onchange = inputValidate.bind(null, false, n, t);
			tag.oninput = inputValidate.bind(null, false, n, t);
			inputValidate(true, i, tag);
		}

		if(valid) return true;
		else return false;
	}

	if(document.getElementById("email_form_sbm")) {
		document.getElementById("email_form_sbm").onclick = function() { // run validation
			if(validateFunc("email_form", email_item)) return true;
			else return false;
		};
	}
	if(document.getElementById("fast_buy_sbm")) {
		document.getElementById("fast_buy_sbm").onclick = function() { // run validation
			if(validateFunc("fast_buy_form", fast_buy)) return true;
			else return false;
		};
	}
	if(document.getElementById("newaddress_sbm")) {
		document.getElementById("newaddress_sbm").onclick = function() { // run validation
			if(validateFunc("newaddress", newaddress)) return true;
			else return false;
		};
	}
	if(document.getElementById("accaunt_sbm")) {
		document.getElementById("accaunt_sbm").onclick = function() { // run validation
			if(validateFunc("accaunt", accaunt)) return true;
			else return false;
		};
	}
	if(document.getElementById("discount_sbm")) {
		document.getElementById("discount_sbm").onclick = function() { // run validation
			if(validateFunc("discount", discount)) return true;
			else return false;
		};
	}
	if(document.getElementById("checkout_sbm")) {
		document.getElementById("checkout_sbm").onclick = function() { // run validation
			if(validateFunc("checkout", checkout)) return true;
			else return false;
		};
	}
	if(document.getElementById("login_window_sbm")) {
		document.getElementById("login_window_sbm").onclick = function() { // run validation
			if(validateFunc("login_window", login)) return true;
			else return false;
		};
	}
	if(document.getElementById("registration_sbm")) {
		document.getElementById("registration_sbm").onclick = function() { // run validation
			if(validateFunc("registration", registration)) return true;
			else return false;
		};
	}
	if(document.getElementById("search_popup_sbm")) {
		document.getElementById("search_popup_sbm").onclick = function() { // run validation
			if(validateFunc("search_popup", search_popup)) return true;
			else return false;
		};
	}

	// -----------------end

	$(window).resize(function() {
		loginClose();
		searchClose();
	});
});

$(window).on('load', function() {

});

$(window).resize(function() {
	if($(window).innerWidth() <= 992) mobile = true;
	else mobile = false;
	runHeadSlider(".head-slider-ins");

	$("select:not(#prod_color)").select2({
		dir: "rtl",
		minimumResultsForSearch: 20,
		languages: "he",
		theme: "default"
	});

	$("#prod_color").select2({ /* color select properties */
		dir: "rtl",
		minimumResultsForSearch: 20,
		languages: "he",
		theme: "default"
	});

	$('.scroll').each(runScroll);
	rightPnlScroll.recalculate();

	countMainBg();

	$(".images-grop").slick('unslick');
	reinitGallery.slidesToShow = countSlide(6, 4, 2);
	reinitGallery.slidesToScroll = (function() {
		if(countSlide(6, 4, 1) === 1) return 1;
		else return 2;
	})();
	$(".images-grop").slick(reinitGallery);
	$(".prod-group").slick('unslick');
	reinitProduct.slidesToShow = countSlide(4, 3, 2);
	reinitProduct.slidesToScroll = (function() {
		if(countSlide(4, 3, 1) === 1) return 1;
		else return 2;
	})();
	$(".prod-group").slick(reinitProduct);
	$("#blog_gallery").slick('unslick');
	reinitBlog.slidesToShow = countSlide(3, 2, 1);
	$("#blog_gallery").slick(reinitBlog);

	if($(window).innerWidth() <= 1366) {
		minSideWidth = "90px";
	}
	if($(window).innerWidth() <= 1280) {
		sideWidth = "400px";
		minSideWidth = "80px";
	}
	if($(window).innerWidth() <= 992) {
		sideWidth = "100vw";
		minSideWidth = "100vw";
	}
	openMenuRight(null, true);
	openMenuLeft(null, true);
	createUlTitle();
	openMainMenu(null, true);
	if(mobile) {
		if($(".catalog").length) {
			createCategory();
			openSelectCategory(null, true);
		}
	}

	var col_container = $(".hide-colors").children();
	var colorSelectTarg = $("#prod_color + .select2-container .select2-selection--single");
	defineSrc(col_container);

	setPlaceholder(colorSelectTarg);
	$('#prod_color').on('select2:open', function(e) {
		var data = e.target.children;
		var jqKey = null;
		for(var key in data[0]) {
			if(/jQuery/.test(key)) {
				jqKey = key;
			}
		}
		setTimeout(function() {
			afterOpen(data, jqKey);
		}, 50);
	});
	$('#prod_color').on('select2:select', function(e) {
		setPlaceholder(colorSelectTarg);
	});


	if(isMobile.any() && ($(window).innerWidth() <= 992)) {
		$(".menu-ins3").css("padding-left", "17px");
	}
});