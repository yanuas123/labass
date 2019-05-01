var mobile = false; // for media screen <992px
var isMobile = { // for mobile gadgets
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



/* --- default functions ----------------------------------------------------------------------------------- */

function windowWheel(e) {
	e.preventDefault();
}
function focusedScroll(wrp) { // stop scroll on global window
	var content = $(wrp)[0];
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
	window.addEventListener("wheel", windowWheel, {
		passive: false
	});
	document.addEventListener("wheel", windowWheel, {
		passive: false
	});
}
function delFocusedScroll() {
	window.removeEventListener("wheel", windowWheel, {
		passive: true
	});
	document.removeEventListener("wheel", windowWheel, {
		passive: true
	});
}

function runScroll(i, el, no) { // properties for scrollbar plugin
	if($(el).id == "content_r") return;
	var instance = new SimpleBar(el, {
		autoHide: false,
		forceVisible: no || "y",
		classNames: {
			track: "track",
			scrollbar: "scroll-line"
		}
	});
	return instance;
}
var rightPnlScroll = null;


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
		"right": "0px"
	});
	for(var j = 1; j <= prop.count; j++) {
		target.arr[("item" + j)]({
			"width": (prop.width + "px")
		});
	}
	function setPoint(n) {
		prop.num = n;
		addDotClass(n);
		var r = 0 - (n * prop.width - prop.width);
		for(var k = 1; k <= prop.count; k++) {
			var styleObj = {
				"right": (r + "px"),
				"transition": "right 0.4s ease"
			};
			target.arr[("item" + k)](styleObj);
			r += prop.width;
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
/* slick galleries */
function countSlide(n1, n2, n3) {
	var blockWidth = $("body").width();
	if(blockWidth < 630) return n3;
	else if(blockWidth < 830) return n2;
	else return n1;
}
var reinitGallery = null;
var reinitProduct = null;
var reinitBlog = null;



function countMainBg() { /* counter for size of images advertising group of main page */
	var array = $(".items").children();
	for(var i = 1; i < array.length; ) {
		$(array[i]).addClass("item-l");
		i = i + 1;
		$(array[i]).addClass("item-l");
		i = i + 2;
	}
}


/* --- head panels functions ------------------------------------------------- */
var sideWidth = "500px";
var minSideWidth = "100px";
function openMenuRight(event, close) {
	var content = document.getElementById("content_r");
	if(event) event.stopPropagation();
	function closeMenuRight(event) {
		if(event) event.stopPropagation();
		delFocusedScroll();
		if(mobile) {
			$(".right-side").removeClass("down");
		} else {
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
		closeMenuRight();
		return;
	}
	focusedScroll("#content_r");
	if(mobile) {
		event.preventDefault();
		$(".right-side").addClass("down");
		$(".right-side .top-group .close").click(closeMenuRight);
		setTimeout(function() {
			rightPnlScroll.recalculate();
		}, 500);
	} else {
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
		delFocusedScroll();
		if(mobile) {
			$(".left-side").removeClass("down");
		} else {
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
	focusedScroll("#content_l");
	if(mobile) {
		event.preventDefault();
		$(".left-side").addClass("down");
		$(".left-side .top-group .close").click(closeMenuLeft);
	} else {
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

function openMainMenu(e, close) { // main menu
	var content = $(".menu-ins")[0];
	if(e) e.stopPropagation();
	function closeMainMenu(event) {
		if(event) event.stopPropagation();
		delFocusedScroll();
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
	focusedScroll(".menu-ins");
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
			focusedScroll($(el).next(".deeppest"));
		});
	});
	$("#close_main_menu").click(closeMainMenu);
}


/* --- catalog categories ---------------------------------------------------- */
function openDesktopCtgr() {
	var initEl = this;
	var content = $(initEl).siblings(".select-content");
	var allHeight = $(content).find(".select-content-ins").innerHeight() + "px";
	$(initEl).find(".indicat").toggleClass("indicat-pls");
	if($(content).hasClass("sl-closed")) {
		$(content).removeClass("sl-closed").css("height", allHeight);
	} else {
		$(content).css("height", 0);
		setTimeout(function() {
			$(content).addClass("sl-closed");
		}, 400);
	}
}
function openSelectCategory(e, close) {
	var content = $(".selecting-ins2")[0];
	if(e) e.stopPropagation();
	function closeSelectCategory(event) {
		if(event) event.stopPropagation();
		delFocusedScroll();
		$(content).removeClass("activeComp active");
		hideSubCtgr();
	}
	if(close) {
		closeSelectCategory();
		return;
	}
	focusedScroll(".selecting-ins2");
	$(content).addClass("activeComp");
	var hiddenParentCtgr = $(".hidden-list").addClass("scroll");
	runScroll(null, hiddenParentCtgr[0]);
	setTimeout(function() {
		$(content).addClass("active");
	}, 500);
	$("#select_catalog_submit, #close_main_menu").click(closeSelectCategory);
}


var catalogCtgrItems = {};
function hideSubCtgr(item) {
	if(item) {
		$(catalogCtgrItems[item].parent).removeClass("open");
	} else {
		for(var key in catalogCtgrItems) {
			$(catalogCtgrItems[key].parent).removeClass("open");
		}
	}
}
function createMobCtgr() {
	var target = $(".hidden-list .hidden-list-ins")[0];
	$(target).empty();
	var source = $("#select_catalog .select-group");
	function addMainItem(text, targ) {
		var content = $(targ).find(".select-content")[0];
		$(content).addClass("scroll");
		runScroll(null, content);
		var div = $("<div></div>").appendTo(target).addClass("itemMain").text(text);
		$(div).click(function() {
			$(targ).addClass("open");
		});
	}
	function changeLeadBtn(elSource, childs, sibling_btn, all) {
		$(elSource).css("display", "none");
		$(sibling_btn).css("display", "flex");
		for(var i = 0; i < childs.length; i++) {
			var child = childs[i];
			child.checked = all;
		}
	}
	function setDef(elSource, childs, sibling_btn) {
		changeLeadBtn(elSource, childs, sibling_btn, false);
	}
	function setAll(elSource, childs, sibling_btn) {
		changeLeadBtn(elSource, childs, sibling_btn, true);
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
		catalogCtgrItems[n] = {};
		tempCtgr = catalogCtgrItems[n];
		tempCtgr.parent = $(source[i]);
		tempCtgr.returnBtn = $(source[i]).find(".return-btn")[0];
		tempCtgr.def_btn = $(source[i]).find(".def-check-btn")[0];
		if($(tempCtgr.parent).hasClass("numbers")) {
			tempCtgr.numbers = true;
			tempCtgr.input1 = $(source[i]).find(".select-content input")[0];
			tempCtgr.val1 = $(tempCtgr.input1).attr("value");
			tempCtgr.input2 = $(source[i]).find(".select-content input")[1];
			tempCtgr.val2 = $(tempCtgr.input2).attr("value");
			$(tempCtgr.def_btn).css("display", "none");
		} else {
			tempCtgr.numbers = false;
			tempCtgr.inputs = $(source[i]).find(".select-content input");
			tempCtgr.all_btn = $(source[i]).find(".all-check-btn")[0];
		}
		tempCtgr.title = $(source[i]).find(".name").text();
		addMainItem(tempCtgr.title, tempCtgr.parent);
		var openContent = $(tempCtgr).find(".select-open").off("click", "openDesktopCtgr");
		(function(it) {
			$(tempCtgr.returnBtn).click(function(e) {
				hideSubCtgr(it);
			});
			if(!tempCtgr.numbers) {
				$(tempCtgr.all_btn).click(function(e) {
					setAll(this, catalogCtgrItems[it].inputs, catalogCtgrItems[it].def_btn);
				});
				$(tempCtgr.def_btn).click(function(e) {
					setDef(this, catalogCtgrItems[it].inputs, catalogCtgrItems[it].all_btn);
				});
				setInputs(catalogCtgrItems[it].inputs, catalogCtgrItems[it].all_btn, catalogCtgrItems[it].def_btn, true);
			} else {
				$(tempCtgr.def_btn).click(function(e) {
					$(this).css("display", "none");
					$(catalogCtgrItems[it].input1).val(catalogCtgrItems[it].val1);
					$(catalogCtgrItems[it].input2).val(catalogCtgrItems[it].val2);
				});
				function checkInputs() {
					function delNotNum(t, d) {
						var val = t.value;
						var reg = /[\-\+\,\.]/g;
						var lg = 3;
						if((val[0] === "0") && (val.lenght > 1)) val = val.slice(1);
						if(val === "") {
							$(t).val(d);
							return;
						}
						val = val.replace(reg, "");
						val = val.slice(0, lg);
						$(t).val(val);
					}
					var val1 = 0;
					var val2 = 0;
					if(this.name == "feature3_from") {
						val1 = this.value;
						val2 = $(catalogCtgrItems[it].input2).attr("value");
					} else {
						val2 = this.value;
						val1 = $(catalogCtgrItems[it].input1).attr("value");
					}
					if(((val1 === catalogCtgrItems[it].val1) || (val1 == 0 || val1 == "")) && ((val2 === catalogCtgrItems[it].val2) || (val2 == 0 || val2 == ""))) {
						$(catalogCtgrItems[it].def_btn).css("display", "none");
					} else {
						$(catalogCtgrItems[it].def_btn).css("display", "flex");
					}
					delNotNum(catalogCtgrItems[it].input1, catalogCtgrItems[it].val1);
					delNotNum(catalogCtgrItems[it].input2, catalogCtgrItems[it].val2);
				}
				catalogCtgrItems[it].input1.onchange = checkInputs;
				catalogCtgrItems[it].input2.onchange = checkInputs;
				catalogCtgrItems[it].input1.oninput = checkInputs;
				catalogCtgrItems[it].input2.oninput = checkInputs;
			}
		})(n);
	}
}


/* =========================================================================== */


var menu_uls = [];
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
			$(ul).each(function(i, elements) {
				menu_uls.push(runScroll(i, elements));
			});
		});
	} else {
		$(parentLi).each(function(i, element) {
			var el = $(element).find(".deeppest .first")[0];
			if(el) $(el).remove();
			var ul = $(element).find(".deeppest")[0];
		});
	}
}


$(document).ready(function() {

	$(".hidden-block").css("display", "none");
	$(window).click(function() {
		$(".succ-message").css("display", "none");
	});
	if($(window).outerWidth() <= 992) {
		mobile = true;
	}

	if(isMobile.any() && ($(window).innerWidth() <= 992)) {
		$(".menu-ins3").css("padding-left", "17px");
	}


	if(mobile) {
		if($(".catalog").length) {
			createMobCtgr();
		}
	}

	$(".head-slider-ins").css("visibility", "visible");

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
			delFocusedScroll();
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
			focusedScroll(".login-window");
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
		delFocusedScroll();
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
			focusedScroll("#search_popup");
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
		$(".select-open").click(openDesktopCtgr);
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


//    runHeadSlider(".head-slider-ins");
	$(".head-slider-ins").slick({
		arrows: false,
		appendDots: ".slider-btn-group",
		dots: true,
		dotsClass: "btn-slide",
		zIndex: 18,
		rtl: true,
		slidesToShow: 1
	});
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

});

function afterResize() {
	if($(window).outerWidth() <= 992) {
		mobile = true;
	} else mobile = false;

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
	createUlTitle();

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
}
var waitForFinalEvent = (function() {
	var timers = {};
	return function(callback, ms, uniqueId) {
		if(!uniqueId) {
			uniqueId = "some";
		}
		if(timers[uniqueId]) {
			clearTimeout(timers[uniqueId]);
		}
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();

$(window).resize(function() {
	waitForFinalEvent(function() {
		afterResize();
	}, 500, "some");
});