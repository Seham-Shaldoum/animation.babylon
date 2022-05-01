var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };
var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, 10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 5, 0), scene);

     var material = new BABYLON.StandardMaterial("mat0", scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.5;

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.2, segments: 16}, scene);

   
    sphere.position.y = 10;

    // Sphere material
    material.diffuseColor = new BABYLON.Color3(1, 0, 0);
    material.specularColor = new BABYLON.Color3(0, 0, 5);
    material.specularPower = 50;
    material.checkReadyOnEveryCall = false;
    sphere.material = material;

 
 // Clone spheres
    var playgroundSize = 90;
    for (var index = 0; index < 8000; index++) {
        var clone = sphere.clone("sphere" + (index + 5), null, true);
        var scale = Math.random() * 2 + 4;
        clone.scaling = new BABYLON.Vector3(scale, scale, scale);
        clone.position = new BABYLON.Vector3(Math.random() * 2.5 * playgroundSize - playgroundSize, Math.random() * 2 * playgroundSize - playgroundSize, Math.random() * 2 * playgroundSize - playgroundSize);
    }
    sphere.setEnabled(false);
    scene.createOrUpdateSelectionOctree();

    // create animation object.
     var move_sphere = {obj: sphere, prop: 'position',
      val: new BABYLON.Vector3(10,50,7), dims:['x','y','z']};

     var dim_light = {obj: light, prop:'intensity', val:5,
     dims: false };

    var animations = [];

    animations.push(move_sphere);
    animations.push(dim_light);
    
    document.getElementById('renderCanvas').addEventListener('click', function(){

        animate(animations, scene, 8);

     });



    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    return scene;
};
        window.initFunction = async function() {
            
            
            var asyncEngineCreation = async function() {
                try {
                return createDefaultEngine();
                } catch(e) {
                console.log("the available createEngine function failed. Creating the default engine instead");
                return createDefaultEngine();
                }
            }

            window.engine = await asyncEngineCreation();
if (!engine) throw 'engine should not be null.';
startRenderLoop(engine, canvas);
window.scene = createScene();};
initFunction().then(() => {sceneToRender = scene                    
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});



