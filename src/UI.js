var UI = UI || {};
UI.scrollMenuListener = null;
UI.currentSelected = [];


UI.currentSubmenu = null;

UI.imageLoaded = false;
UI.isImageLoaded = function() {
	return UI.imageLoaded;
}

UI.setImageLoaded = function(isLoaded) {
	if(document.getElementById("canvas_info")) {
		document.getElementById("canvas_info").style.display = (isLoaded) ? "none" : "";
	}

	if(document.getElementById("image_main")) {
		document.getElementById("image_main").style.display =  (!isLoaded) ? "none" : "";
	}
	UI.imageLoaded = !!isLoaded;
}

UI.loadingHandler = function() {
	if (document.getElementById("loading-bar")) { // Only one instance is allower
		return;
	}
	var loadingElm = document.createElement("div");
	loadingElm.setAttribute("id", "loading-bar");

	var loadingBar = document.createElement("div");
	loadingBar.setAttribute("id", "loading-bar-container");

	var loadingBarLoader = document.createElement("div");
	loadingBarLoader.setAttribute("id", "loading-bar-loader");
	loadingBar.append(loadingBarLoader);
	loadingElm.append(loadingBar);
	document.body.append(loadingElm);
	return {
		load: function() {

		},
		set: function(x) {
			if (x > 100) { x = 100; }
			if (x < 0) { x = 0; }
			// Clear ui update
			setTimeout(function() {
				document.getElementById("loading-bar-loader").style.width = x + "%";
			}, 0);
		},
		end: function() {
			this.set(100);
			setTimeout(function() {
				document.body.removeChild(loadingElm);
			}, 200);
		}
	}
};

UI.closeSubmenu = function(menu) {
	document.getElementById("submenu_" + menu).style.transform = "translateY(-100%)";
	setTimeout(function() {
		document.getElementById("submenu_" + menu).style.display = "none";
	}, 200); // In order to perform transform before display: none
	
};

UI.openSubmenu = function(menu) {
	var subMenuElm = document.getElementById("submenu_" + menu);
	var j = subMenuElm.children.length;
	var i = 0;
	var selectedElm = subMenuElm.children[0]; // select first from default
	while (i < j) {
		if (subMenuElm.children[i].className.indexOf("selected") > -1) {
			selectedElm = subMenuElm.children[i];
			break;
		}
		i++;
	}

	subMenuElm.style.display = "block";
	
	// When open menu, select the selected element on submenu
	UI.selectAdjust(selectedElm);

	setTimeout(function() {
		subMenuElm.style.transform = "translateY(0%)";
	}, 200); // In order to perform display: block before translateY
	
}
UI.selectAdjust = function(that) {

	if (that.getAttribute("data-submenu")) {
		if (UI.currentSubmenu && UI.currentSubmenu !== that.getAttribute("data-submenu")) {
			UI.closeSubmenu(UI.currentSubmenu);
		}
		// Show submenu
		UI.currentSubmenu = that.getAttribute("data-submenu");
		UI.openSubmenu(that.getAttribute("data-submenu"));
		return;
	}

	// Close when menu changes, but prevent when in submenu
	if (UI.currentSubmenu && that.parentElement.className.indexOf("submenu") < 0) {
		UI.closeSubmenu(UI.currentSubmenu);
	}

	

	if (that.getAttribute("data-item")) {
		current_adjust.paramName = that.getAttribute("data-item");
	}
	current_adjust.max = parseFloat(that.getAttribute("max"));
	current_adjust.min = parseFloat(that.getAttribute("min"));
	current_adjust.callbacks = that.getAttribute("data-callback") || "";

	var amountElm = document.getElementById("cantidad");
  if (amountElm) {
    amountElm.innerHTML = Locale.get(current_adjust.paramName) + ": " + Math.round(Params.get(current_adjust.paramName) * 100) / 100;
  }

}

UI.dataActionClick = function(event) {
	var that = event.target;
	console.log(event.target);
	if (that.getAttribute("data-action")) {
		var action = that.getAttribute("data-action")
		window.Actions[action]();
	}

};

// Double click => set default
UI.rangeDblClick = function(event) {
	event.stopPropagation();
	this.value = Params.getDefault(this.getAttribute("data-item"));
	Actions.setParam({
    paramName: this.getAttribute("data-item"),
    value: parseFloat(this.value),
    callbacks: this.getAttribute("data-callback"),
    save: true
  });
  event.preventDefault();
};

UI.moveRange_timer = {
	to: null,
	param: null
};

UI.moveRange = function(event) {
	
	// Set params
	if (UI.moveRange_timer.to && UI.moveRange_timer.to == this.getAttribute("data-item")) {
		clearTimeout(UI.moveRange_timer.to)
	}

	UI.moveRange_timer.param = this.getAttribute("data-item");
	UI.moveRange_timer.to = setTimeout(() => {
		Actions.setParam({
	    paramName: this.getAttribute("data-item"),
	    value: parseFloat(this.value),
	    callbacks: this.getAttribute("data-callback"),
	    save: true
	  });
	}, 30);
};



UI.scrollMenu = function(event) {

	var menuElm = event.target;
	if (event.target.className.indexOf("menu") < 0) {
		return;
	}
	var selection = Math.round(__NUM_OF_MENU_ITEMS__ * this.scrollLeft / document.body.offsetWidth);
	selection += __MENU_ITEMS_PADDING__;				

	if (UI.scrollMenuListener) {
		clearTimeout(UI.scrollMenuListener);
	}

	// Set the position
	var that = this;
	UI.scrollMenuListener = setTimeout(function() {
		UI.selectMenuItem(selection, menuElm);
	}, 150);
}



UI.clickMenuContainer = function(event) {
	if (this.parentElement.classList.contains("open")) {
		this.parentElement.classList.remove("open");
	} else {
		this.parentElement.classList.add("open");
	}
}

UI.dropFile = function(event) {
		event = event || window.event;
	  event.preventDefault();
	  event.stopPropagation(); 
	  document.body.style.opacity = 1;
	  try {
	  	loadImageFromUrl(URL.createObjectURL(event.dataTransfer.files[0]));
	  } catch (err) {
	  	console.log(err);
	  	__ERROR("No se pudo cargar la imagen al arrastrarla, por favor, utilice el botón de abrir.");
	  }
}