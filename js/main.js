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
		displacementCenterM = {
			"offset":160,
			"number":4
		},
		displacementCenter = [],
		currentPosition = 1,
		checkpointInfm = [],
		CheckpointOver = true,
		secneSpeed = 10,
		nowSpeed = secneSpeed,
		state,id,map,bg,spineBoy,leftButton,rightButton,jumpButton,checkpointNum,interval,settingTime,isSettingTime;
	for(var i=0;i<displacementCenterM.number;i++){
		displacementCenter.push((720-320)/4*i+50+160);
	}
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
		               {view: document.getElementsByTagName("canvas")[0],
		               	antialias:true,
		               	forceFXAA:true
		           		}
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
			rightButton.x = bgWidth-rightButton.width-100;
			rightButton.y = bgHeight-240;
			gameScene.addChild(rightButton);

			jumpButton = new Sprite(id["jump.png"]);
			jumpButton.x = bgWidth/2-jumpButton.width/2;
			jumpButton.y = bgHeight-240;
			gameScene.addChild(jumpButton);


			scaleX=winW/bgWidth;
			scaleY=winW/bgWidth;
			app.stage.scale.x=scaleX;
			app.stage.scale.y=scaleY;
			state = game.play;
			// requestAnimationFrame(state);
			setTimeout(function(){
				secneSpeed = 20;
				nowSpeed = secneSpeed;
			},12000)
			app.ticker.add(delta => game.gameloop(delta));
		},
		gameloop:function(delta){
			state(delta);
		},
		play:function(delta){
			console.log(secneSpeed)
			bg.tilePosition.y += secneSpeed;
			lastTime = new Date();
			let dTime = lastTime - now;
			if(spineBoy.ismove){
				if(spineBoy.ismoveStage == 0)return;
				game.jumpMotionStage(dTime);
			}
			if(CheckpointOver){
				game.CreateCheckpoint();
			}
			if(CheckpointStart){
				game.checkpointStart();
			}
			if(settingTime){
				spineBoy.update(0.005);
			}else{
				spineBoy.update(0.01666666666667);
			}
			now = lastTime;
			renderer.render(app.stage);
			// requestAnimationFrame(state);
		},
		onAssetsLoaded:function()
		{
		    // create a spine boy
		    spineBoy = new PIXI.spine.Spine(resources.spine_ninja.spineData);
		    spineBoy.skeleton.setToSetupPose();
		    spineBoy.update(0);
		    spineBoy.autoUpdate = false;

			
		    // set the position
		    spineBoy.x = displacementCenter[currentPosition];
		    spineBoy.y = bgHeight-spineBoy.height-300;
		    spineBoy.data = {
		    					scale:1,
		    					ismove:false
		    				};
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
				if(spineBoy.ismove)return;
		    	spineBoy.ismove = true;
		    	currentPosition--;
		    	if(currentPosition<0){
		    		currentPosition = 0;
		    		spineBoy.ismove = false;
		    		return;
		    	}
		    	spineBoy.ismoveStage = 3;
		    	spineBoy.targetData = {	
		    							x:displacementCenter[currentPosition],
		    							time:130,
		    							currentTime:new Date()
		    							};
		    	spineBoy.transitionData = move({x:spineBoy.x},
		    								  {x:spineBoy.targetData.x},
		    								  spineBoy.targetData.time);
		        spineBoy.state.setAnimation(0, 'animation2', false);
		        spineBoy.state.addAnimation(0, 'animation', true, 0.12);
		    });

			rightButton.interactive = true;
		    rightButton.on('pointerdown', function() {

		    	if(spineBoy.ismove)return;
		    	spineBoy.ismove = true;
		    	currentPosition++;
		    	if(currentPosition>3){
		    		currentPosition = 3;
		    		spineBoy.ismove = false;
		    		return;
		    	}
		    	spineBoy.ismoveStage = 3;
		    	spineBoy.targetData = {	
		    							x:displacementCenter[currentPosition],
		    							time:130,
		    							currentTime:new Date()
		    							};
		    	spineBoy.transitionData = move({x:spineBoy.x},
		    								  {x:spineBoy.targetData.x},
		    								  spineBoy.targetData.time);
		        spineBoy.state.setAnimation(0, 'animation3', false);
		        spineBoy.state.addAnimation(0, 'animation', true, 0.12);
		    });

		    jumpButton.interactive = true;
		    jumpButton.on('pointerdown', function() {
		    	if(spineBoy.ismove)return;
		    	spineBoy.ismove = true;
		    	spineBoy.ismoveStage = 1;
		    	spineBoy.targetData = {
		    							scale:1.5,
		    							y:bgHeight-spineBoy.height-400,
		    							time:100,
		    							currentTime:new Date()
		    							};
		    	spineBoy.transitionData = move({scale:spineBoy.data.scale,y:spineBoy.y},
		    								  {scale:spineBoy.targetData.scale,y:spineBoy.targetData.y},
		    								  spineBoy.targetData.time);
		        spineBoy.state.setAnimation(0,"jump1",false);
		        spineBoy.state.addAnimation(0,'jump2',true,0.3);
		        spineBoy.state.addAnimation(0,'animation',true,0.4);
		    });

		    
		    app.stage.addChild(spineBoy);
		},
		jumpMotionStage:function(dTime){
		    	if(spineBoy.targetData.time>(lastTime-spineBoy.targetData.currentTime)){
		    		
		    		if(spineBoy.ismoveStage==2||spineBoy.ismoveStage==1){
						let nowScale = spineBoy.data.scale+spineBoy.transitionData.scale*dTime;
						spineBoy.scale.set(nowScale);
			    		spineBoy.y+=spineBoy.transitionData.y*dTime;
			    		spineBoy.data.scale = nowScale;
		    		}
		    		if(spineBoy.ismoveStage == 3){
		    			spineBoy.x+=spineBoy.transitionData.x*dTime;
		    		}
				}else{
		    		if(spineBoy.ismoveStage==3){
			    		spineBoy.x=spineBoy.targetData.x;
		    			spineBoy.ismoveStage = 0;
		    		}
		    		if(spineBoy.ismoveStage==2){
						spineBoy.scale.set(spineBoy.targetData.scale);
			    		spineBoy.y=spineBoy.targetData.y;
		    			spineBoy.ismoveStage = 0;
		    		}
		    		if(spineBoy.ismoveStage==1){
		    			spineBoy.scale.set(spineBoy.targetData.scale);
			    		spineBoy.y=spineBoy.targetData.y;
		    			spineBoy.ismoveStage = 2;
		    			spineBoy.targetData = {
			    							scale:1,
			    							y:bgHeight-spineBoy.height-300,
			    							time:500,
				    						currentTime:new Date()
		    							};
				    	spineBoy.transitionData = move({scale:spineBoy.data.scale,y:spineBoy.y},
				    								  {scale:spineBoy.targetData.scale,y:spineBoy.targetData.y},
				    								  spineBoy.targetData.time);
		    		}
		    		if(spineBoy.ismoveStage==0){
		    			spineBoy.ismove=false;
		    		}
				}
		},
		CreateCheckpoint:function(){
			checkpointNum = randomInt(2,4);
			checkpointInfm = [];
			for(let i=0;i<checkpointNum;i++){
				let checkpointStateRnd = randomInt(0,100);
				let checkpointState = 0;
				let checkpointStateSub = null;
				if(checkpointStateRnd<0){

				}else if(checkpointStateRnd>=0&&checkpointStateRnd<=100){
					checkpointState = 0;
					let checkpointStateSubNum = randomInt(1,3);
					let j = 0;
					checkpointStateSub = [];
					while(checkpointStateSubNum>j){
						let checkpointStateSubRnd=randomInt(0,3);
						let isRepeat = false;
						for(let x = 0;x<checkpointStateSub.length;x++){
							if(checkpointStateSub[x]==checkpointStateSubRnd){
								isRepeat = true;
							}
						}
						if(!isRepeat){
							checkpointStateSub.push(checkpointStateSubRnd)
							j++;
						}
					}
				}else{

				}
				checkpointInfm.push({
					"state":checkpointState,
					"checkpointStateSub":checkpointStateSub,
					"sprite":[],
					"currentTime":new Date()
				})
			}
			for(let i=0;i<checkpointInfm.length;i++){
				for(let j=0;j<checkpointInfm[i].checkpointStateSub.length;j++){
					let muzhuang = new Sprite(id["muzhuang.png"]);
					muzhuang.x = displacementCenter[checkpointInfm[i].checkpointStateSub[j]]-muzhuang.width/2;
					muzhuang.y = -muzhuang.height;
					gameScene.addChild(muzhuang);
					checkpointInfm[i]["sprite"].push({
						"obj":muzhuang
					})
				}
			}
			CheckpointOver = false;
			CheckpointStart = true;
		},
		checkpointStart:function(){
			interval = 4000;
			if(checkpointInfm[checkpointInfm.length-1]["sprite"][0].obj.y>bgHeight){
				CheckpointStart = false;
				CheckpointOver = true;
			}
			for(let i=checkpointInfm.length-1;i>=0;i--){
				if((interval*i+2000)<lastTime-checkpointInfm[i].currentTime){
					if((checkpointInfm[i]["sprite"][0].obj.y+checkpointInfm[i]["sprite"][0].obj.height)>=spineBoy.y&&!checkpointInfm[i]["sprite"][0]["isPass"]){
						if(!settingTime){
							settingTime=new Date()*1+300;
							isSettingTime = true;
						}
					}
					if(settingTime){
						checkpointInfm[i]["sprite"][0]["isPass"] = true;
						secneSpeed = 0.5;
						if(settingTime<lastTime){
							settingTime = 0;
							isSettingTime=false;
						}
					}else{
						if(!isSettingTime)secneSpeed=nowSpeed;
					}
					for(let j = 0;j<checkpointInfm[i].checkpointStateSub.length;j++){
						checkpointInfm[i]["sprite"][j].obj.y +=secneSpeed;
					}
				}
			}
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
		return data;
	}
	function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
	loader
	.add("all","examples/images/thePhantomNinja.json")
	.add("map","examples/images/map_Grassland.png")
	.add("spine_ninja","examples/spine/player/ninja/top/skeleton.json")
	.load(game.init)
	.load(game.onAssetsLoaded);
})