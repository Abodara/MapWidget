class LeMondeWidget extends Widget {
	
	constructor(id, app) {
		super(id, LeMondeModel, LeMondeView, LeMondeController, app);
	}
	
	setUp() {
		super.setUp();
		this.header = true;
		this.footer = true;
		this.sizeX = 3;
		this.sizeY = 2;
		this.radius = 2;
	}
	
	async ready() {
		super.ready();
		SocketIO.initialize();
		trace(this);
		SocketIO.on("msg", this.mvc.controller.onMessage.bind(this));
		this.mvc.controller.load();
	}
	
}

class LeMondeModel extends WidgetModel {
	
	constructor() {
		super();
	}
	
	setUp() {
		super.setUp();
		
	}

}

class LeMondeView extends WidgetView {
	
	constructor() {
		super();
		this.map = HH.create("div");
		this.map.id = "map";
	}
	
	setUp() {
		super.setUp();
		L.mapquest.key = '3DD7MsUFRtG32ShoNDBFYeVsd9gZFK1u';
	}

	draw() {
		super.draw();
		this.map = document.getElementById("map");
		var parent = map.parentNode;
		parent.replaceChild(this.stage,this.map);
		this.editer = HH.create("div");
		this.research = HH.create("input");
		this.editer.appendChild(this.research);
		this.button = HH.create("button");
		this.button.textContent = "OK";
		this.button.addEventListener("click",() => this.update());
		SS.style(this.button,{"height":"30px", "width":"30px"});
		SS.style(this.research,{"width":"90%"});
		SS.style(this.editer,{"position":"relative","width":"100%"});
		this.editer.appendChild(this.button);
		this.footer.textContent = '';
		this.stage.appendChild(this.map);
		this.footer.appendChild(this.editer);
		this.map = L.mapquest.map('map', {
          center: [37.7749, -122.4194],
          layers: L.mapquest.tileLayer('map'),
          zoom: 12
        });

        this.map.addControl(L.mapquest.control());
	}
	
	update() {
		let val = this.research.value;
		L.mapquest.geocoding().geocode(val);
	}

	
}

class LeMondeController extends WidgetController {
	
	constructor() {
		super();
	}
	
	setUp() {
		super.setUp();
		
	}
	
	onMessage(data) {
		trace("received socket msg", data);
	}
	
	socketClick(event) {
		trace("test socket");
		SocketIO.send("msg", {test: "message"});
	}
	
	async load() {
		let result = await this.mvc.main.dom("https://lemonde.fr"); // load web page
		let domstr = _atob(result.response.dom); // decode result
		let parser = new DOMParser(); // init dom parser
		let dom = parser.parseFromString(domstr, "text/html"); // inject result
		let article = new xph().doc(dom).ctx(dom).craft('//*[@id="en-continu"]/div/ul/li[1]/a').firstResult; // find interesting things
		this.mvc.view.update(article.textContent, article.getAttribute("href"));
	}
	
}