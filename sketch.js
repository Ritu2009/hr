//Create variables here
var dog,happyDog,database,foodS,foodStock;
var dogImg,FoodImage;
var addFood,feed;
var fedTime,lastfed;
var FoodObj;
var feedDog,currentTime;
var changingGameState,readingGameState;
var bedImage,gardenImage;
var washroomImage;
var Hungry,Playing,Sleeping,Bathing;
var currentTime;
var gameState,sadDog;
function preload()
{
  //load images here
  dogHappy=loadImage("pet images/happydog.png")
  dogImg=loadImage("pet images/a.png")
 bedImage=loadImage("pet images/BedRoom.png")
 gardenImage=loadImage("pet images/Garden.png")
 washroomImage=loadImage("pet images/WashRoom.png")
sadDog=loadImage("pet images/deadDog.png")
}

function setup() {
	createCanvas(760, 500);
  database=firebase.database();
  dog=createSprite(650,250)
  dog.addImage(dogImg)
  dog.scale=0.2
  

  feed=createButton("Feed the Dog")
 feed.position(700,95)
 feed.mousePressed(feedDog)

 addFood=createButton("Add Food")
 addFood.position(800,95)
addFood.mousePressed(addFoods);

foodObj=new Milk();


readingGameState=database.ref('gameState')
readingGameState.on("value",function(data){
  gameState=data.val();
})

  foodStock=database.ref('Food')
  foodStock.on("value",readStock)
}


function draw() {  

fill(255,255,254)
textSize(15)

if(lastfed>=12){
  text("Last Feed : "+ lastfed%12 +" PM",350,30)
}else if(lastfed==0){
  text("Last Feed : 12 AM",350,30);
}else{
  text("Last Feed :"+lastfed + " AM",350,30);
}
currentTime=hour();
if(currentTime==(lastfed+1)){
  update("Playing");
  foodObj.garden();
}
else if(currentTime==(lastfed+2)){
     update("Sleeping");
     foodObj.bedroom();
}
else if(currentTime>(lastfed+2) && currentTime<=(lastfed+4)){
 update("Bathing");
  foodObj.washroom();
}
else{
  update("Hungry")
  foodObj.display();
}

if(gameState!=="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
 
}
else{
  feed.show();
  addFood.show();
 dog.addImage(dogImg);
}




fedTime=database.ref('FeedTime');
fedTime.on("value",function(data){
  lastfed=data.val();
});


foodObj.display();

 drawSprites();
}
function addFoods(){
foodStock=foodStock+1;
  database.ref('/').update({
    Food:foodStock
  })
}  
function feedDog(){
 dog.addImage(dogHappy);

 foodObj.updateFoodStock(foodObj.getFoodStock()-1);
 database.ref('/').update({
  Food:foodObj.getFoodStock(),
  FeedTime:hour()

 })
}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
 
  


function readStock(data){
  
  
  foodStock=data.val();
  foodObj.updateFoodStock(foodStock)
}

function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  database.ref('/').update({
    Food:x
  })
}



