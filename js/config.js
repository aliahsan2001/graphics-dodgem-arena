/*
CM2030 Graphics Programming - Dodgem Arena commentary

Matter.js is used for all car bodies, walls, collisions and bounce response.
The player car is controlled with arrow keys. It uses force for acceleration, so
heavier cars feel slower. Cars also use different mass, friction and restitution
values.

Press I to arm insertion, then click inside the start zone to add the player.
The code checks the start zone and checks for overlap before adding the Matter
body and adding the car to the drawing list.

Mode 2 opponents drive in straight paths and turn after collisions. Mode 3
opponents follow wave-like coordinate trajectories stored in arrays in
trajectories.js. Animations are fading trails, hit flashes and wall pulses.

My extension is the arena pad system. Green boost pads apply an impulse and
reduce air friction. Red drain pads cut velocity and increase air friction for a
moment.
*/

const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Events = Matter.Events;
const Vector = Matter.Vector;

const ARENA_W = 1400;
const ARENA_H = 700;
const WALL_THICKNESS = 44;
const START_ZONE_W = 230;
const CAR_W = 78;
const CAR_H = 42;

var carNumbers = 4;

let engine;
let world;
let walls = [];
let cars = [];
let player = null;
let mode = 1;
let spawnArmed = false;
let arenaScale = 1;
let arenaLeft = 0;
let arenaTop = 0;
let trails = [];
let impactFlashes = [];
let barrierPulses = [];
let padParticles = [];
let rechargePads = [];
