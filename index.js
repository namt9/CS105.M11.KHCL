import * as THREE from './js/three.module.js';
import { OrbitControls } from './js/OrbitControls.js';
import { TransformControls } from './js/TransformControls.js';
import { TeapotBufferGeometry } from './js/TeapotBufferGeometry.js';

// Init variable
var camera, scene, renderer, control, orbit;
var mesh, texture;
var raycaster, light, PointLightHelper, meshplan;
var type_material = 3;
var color_material = 'rgb(255, 255, 255)';
var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
material.needsUpdate = true;

var mouse = new THREE.Vector2();

// Init point for LatheGeometry
const points = [];
for ( let i = 0; i < 10; i ++ ) {
	points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
}

// Geometry
var BoxGeometry = new THREE.BoxGeometry(30, 30, 30, 40, 40, 40);
var SphereGeometry = new THREE.SphereGeometry(20, 20, 20);
var ConeGeometry = new THREE.ConeGeometry(18, 30, 32, 20);
var CylinderGeometry = new THREE.CylinderGeometry(20, 20, 40, 30, 5);
var TorusGeometry = new THREE.TorusGeometry(20, 5, 20, 100);
var TeapotGeometry = new TeapotBufferGeometry(20, 8);
var DodecahedronGeometry = new THREE.DodecahedronBufferGeometry(25);
var IcosahedronGeometry = new THREE.IcosahedronBufferGeometry(25);
var OctahedronGeometry =  new THREE.OctahedronBufferGeometry(25);
var TetrahedronGeometry = new THREE.TetrahedronBufferGeometry(25);
var LatheGeometry = new THREE.LatheGeometry(points);
var TorusKnotGeometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);

init();
render();

function init() {
	// Scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x343a40);

	// Camera
	var camera_x = 1;
	var camera_y = 50;
	var camera_z = 100;
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
	camera.position.set(camera_x, camera_y, camera_z);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// Grid
    var size = 400;
    var divisions = 50;
    var gridHelper = new THREE.GridHelper(size, divisions, 0x888888);
	scene.add(gridHelper);
	
    // Renderer
    raycaster = new THREE.Raycaster();
    renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setSize( window.innerWidth, window.innerHeight )
    renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.getElementById("rendering").addEventListener('mousedown', onMouseDown, false);
	document.getElementById("rendering").appendChild(renderer.domElement);
	window.addEventListener('resize', () => {
		var width = window.innerWidth
		var height = window.innerHeight
		renderer.setSize(width, height)
		camera.aspect = width / height
		camera.updateProjectionMatrix()
		render()
	})
	orbit = new OrbitControls(camera, renderer.domElement);
	orbit.update();
	orbit.addEventListener('change', render);
	control = new TransformControls(camera, renderer.domElement);
	control.addEventListener('change', render);
	control.addEventListener('dragging-changed', function (event) {
		orbit.enabled = !event.value;
	});
}

function render() {
	renderer.render(scene, camera);
}

function boxdefault(){

	mesh = new THREE.Mesh(BoxGeometry, material);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.name = "mesh1"
	scene.add(mesh);
	control.attach(mesh);
	scene.add(control);
	render();
}
boxdefault();

function CloneMesh(dummy_mesh) {
	mesh.name = dummy_mesh.name;
	mesh.position.set(dummy_mesh.position.x, dummy_mesh.position.y, dummy_mesh.position.z);
	mesh.rotation.set(dummy_mesh.rotation.x, dummy_mesh.rotation.y, dummy_mesh.rotation.z);
	mesh.scale.set(dummy_mesh.scale.x, dummy_mesh.scale.y, dummy_mesh.scale.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add(mesh);
	control.attach(mesh);
	scene.add(control);
}	
function SetMaterial(mat, color) {
	mesh = scene.getObjectByName("mesh1");
	light = scene.getObjectByName("pl1");
	if (mat != 0) {
		type_material = mat;
	}
	
	 if (color) {
	 	color_material = color;
	 }


	if (mesh) {
		const dummy_mesh = mesh.clone();
		scene.remove(mesh);

		switch (type_material) {
			case 1:
				material = new THREE.PointsMaterial({ color: color_material, size: 0.3 });
				mesh = new THREE.Points(dummy_mesh.geometry, material);
				CloneMesh(dummy_mesh);
				break;
			case 2:
				material = new THREE.MeshBasicMaterial({ color: color_material, wireframe: true });
				mesh = new THREE.Mesh(dummy_mesh.geometry, material);
				CloneMesh(dummy_mesh);
				break;
			case 3:
				if (!light)
					material = new THREE.MeshBasicMaterial({ color: color_material });
				else
				 	material = new THREE.MeshPhongMaterial({ color: mesh.material.color_material });
				mesh = new THREE.Mesh(dummy_mesh.geometry, material);
				CloneMesh(dummy_mesh);
				break;
			case 4:
				if (!light)
					material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
				else
					material = new THREE.MeshLambertMaterial({ map: texture, transparent: true });
				mesh = new THREE.Mesh(dummy_mesh.geometry, material);
				CloneMesh(dummy_mesh);
				break;
		}
		render();
	}
}
window.SetMaterial = SetMaterial


// 3. Affine
function Translate() {
	control.setMode("translate");
}
window.Translate = Translate;

function Rotate() {
	control.setMode("rotate");
}
window.Rotate = Rotate;

function Scale() {
	control.setMode("scale");
}
window.Scale = Scale;

// Control onKeydown
function control_transform(mesh) {
	control.attach(mesh);
	scene.add(control);
	window.addEventListener('keydown', function (event) {
		switch (event.keyCode) {
			case 84: // T
				Translate(); 
				break;
			case 82: // R
				Rotate(); 
				break;
			case 83: // S
				Scale(); 
				break;
		}
	});
}

function onMouseDown(event) {
	event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	// find intersections
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(scene.children);
	let check_obj = 0;
	if (intersects.length > 0) {
		var obj;
		for (obj in intersects) {
			if (intersects[obj].object.name == "mesh1") {
				check_obj = 1;
				control_transform(intersects[obj].object);
				break;
			}
			if (intersects[obj].object.type == "PointLightHelper") {
				check_obj = 1;
				control_transform(light);
				break;
			}
		}
	}
	if (check_obj == 0 && control.dragging == 0) control.detach();
	render();
}