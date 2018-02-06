$(function(){
	//pixi method definitin
	let Application = PIXI.Application,
		loader = PIXI.loader,
		Container = PIXI.Container,
		resources = PIXI.loader.resources,
		Sprite = PIXI.Sprite;

	//public variable definitin
	let winW = document.body.clientWidth,
		winH = document.body.clientHeight,
		now = new Date(),
		lastTime = new Date(),
		state,id,map,bg,spineBoy,leftButton,rightButton,jumpButton;

	//canvas initialization
	let app = new Application({
		width:winW,
		height:winH,
		antialiasing:false,
		transparent:true,
		resolution:1
	})
	document.body.appendChild(app.view);
	let renderer = PIXI.autoDetectRenderer(
		               winW,
		               winH,
		               {view: document.getElementsByTagName("canvas")[0]}
		            );
	//↑ ready finish
	//initial canvas element

	let game = {
		init:function(){
			gameScene = new Container();
			app.stage.addChild(gameScene);
				 // resources["images/treasureHunter.json"].textures;
			id = resources["all"].textures;
			//bg
			let bgTexture = PIXI.Texture.fromImage("map");
			bgWidth=bgTexture.baseTexture.source.width;
			bgHeight=bgTexture.baseTexture.source.width/winW*winH;
			bg = new PIXI.extras.TilingSprite(bgTexture,bgWidth,bgHeight);
			bg.position.x=0;
			bg.position.y=0;
			bg.tilePosition.x=0;
			bg.tilePosition.y=0;
			gameScene.addChild(bg);
			//button
			leftButton = new Sprite(id["left.png"]);
			leftButton.x = 100;
			leftButton.y = bgHeight-240;
			gameScene.addChild(leftButton);

			rightButton = new Sprite(id["right.png"]);
			console.log(winW-rightButton.width-100,rightButton.width)
			rightButton.x = bgWidth-rightButton.width-100;
			rightButton.y = bgHeight-240;
			gameScene.addChild(rightButton);

			jumpButton = new Sprite(id["jump.png"]);
			console.log(winW/2-jumpButton.width/2,jumpButton.width)
			jumpButton.x = bgWidth/2-jumpButton.width/2;
			jumpButton.y = bgHeight-240;
			gameScene.addChild(jumpButton);


			scaleX=winW/bgWidth;
			scaleY=winW/bgWidth;
			app.stage.scale.x=scaleX;
			app.stage.scale.y=scaleY;
			state = game.play;
			app.ticker.add(delta => game.gameloop(delta));
		},
		gameloop:function(delta){
			state(delta);
		},
		play:function(delta){
			bg.tilePosition.y += 3;

			lastTime = new Date();
			let dTime = lastTime - now;
			// if(spineBoy.ismove){
			// 	if(spineBoy.data.time>(lastTime-spineBoy.dataGo.current)){
			// 		let nowScale = spineBoy.dataNow.scale+spineBoy.dataGo.scale*dTime;
			// 		spineBoy.scale.set(nowScale);
		 //    		spineBoy.y+=spineBoy.dataGo.y*dTime;
		 //    		spineBoy.dataNow.scale = nowScale;
			// 	}else{
			// 		spineBoy.scale.set(spineBoy.data.scale);
		 //    		spineBoy.y=spineBoy.data.y;
		 //    		spineBoy.ismove=false;
			// 	}
			// }
			now = lastTime;
		},
		onAssetsLoaded:function()
		{
		    // create a spine boy
		    spineBoy = new PIXI.spine.Spine(resources.spine_ninja.spineData);

		    // set the position
		    spineBoy.data = {scale:1,y:800,x:400,ismove:false}
		    spineBoy.x = spineBoy.data.x;
		    spineBoy.y = spineBoy.data.y;
		    // set up the mixes!
		    // spineBoy.stateData.setMix('animation', 'animation2', 0.08);
		    // spineBoy.stateData.setMix('animation', 'animation3', 0.08);
		    // spineBoy.stateData.setMix('animation', 'animation', 0.1);
		    // spineBoy.stateData.setMix('animation', 'jump1', 0.3);
		    // spineBoy.stateData.setMix('jump1', 'jump2', 0.3);
		    // spineBoy.stateData.setMix('jump2', 'jump3', 0.01);
		    // spineBoy.stateData.setMix('jump3', 'animation', 0.01);
		    // play animation
		    spineBoy.state.setAnimation(0, 'animation', true);

			leftButton.interactive = true;
			leftButton.on('pointerdown', function() {
		        spineBoy.state.setAnimation(0, 'animation2', false);
		        spineBoy.state.addAnimation(0, 'animation', true, 0.08);
		    });

			rightButton.interactive = true;
		    rightButton.on('pointerdown', function() {
		        spineBoy.state.setAnimation(0, 'animation3', false);
		        spineBoy.state.addAnimation(0, 'animation', true, 0.08);
		    });

		    jumpButton.interactive = true;
		    jumpButton.on('pointerdown', function() {
		    	spineBoy.ismove = true;
		    	spineBoy.targetData = {scale:1.5,y:750,time:100};
		    	spineBoy.excessiveData = move({scale:spineBoy.data.scale,y:spineBoy.data.y},
		    								  {scale:spineBoy.data.scale,y:spineBoy.data.y},
		    								  spineBoy.targetData.time);
		        spineBoy.state.setAnimation(0,"jump1",false);
		        spineBoy.state.addAnimation(0,'jump2',true,0.3);
		        // spineBoy.state.addAnimation(0,'jump3',false,0.5);
		        spineBoy.state.addAnimation(0,'animation',true,0.5);
		    });

		    app.stage.addChild(spineBoy);
		}
	}


	function move(x,y,time,fn){
		data = {};
		for(let i in x){
			for(let j in y){
				if(i == j){
					data[j]=(y[j]-x[i])/time;
				}
			}
		}
		data["time"] = time;
		data["current"] = new Date();
		console.log(data);
		return data;
	}
	loader
	.add("all","examples/images/thePhantomNinja.json")
	.add("map","examples/images/map_Grassland.jpg")
	.add("spine_ninja","examples/spine/player/ninja/top/skeleton.json")
	.load(game.init)
	.load(game.onAssetsLoaded)
})