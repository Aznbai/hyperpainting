$(window).load(function() {
    // Animate loader off screen
    $(".preload").fadeOut(800);;
});
// function youTubes_makeDynamic() {
//     var $ytIframes = $('iframe[src*="youtube.com"]');
//     $ytIframes.each(function(i, e) {
//         var $ytFrame = $(e);
//         var ytKey;
//         var tmp = $ytFrame.attr('src').split(/\//);
//         tmp = tmp[tmp.length - 1];
//         tmp = tmp.split('?');
//         ytKey = tmp[0];
//         var $ytLoader = $('<div class="ytLoader">');
//         $ytLoader.append($('<img class="cover" src="https://i.ytimg.com/vi/' + ytKey + '/hqdefault.jpg">'));
//         $ytLoader.append($('<span class="playBtn glyphicon glyphicon-picture" ></span>'));
//         $ytLoader.data('$ytFrame', $ytFrame);
//         $ytFrame.replaceWith($ytLoader);
//         $ytLoader.click(function() {
//             var $ytFrame = $ytLoader.data('$ytFrame');
//             $ytFrame.attr('src', $ytFrame.attr('src') + '?autoplay=1');
//             $ytLoader.replaceWith($ytFrame);
//         });
//     });
// };


$(document).ready(function() {

    wglContainer = document.getElementById('hpwebgl');
    // options = {
    //     videoId: 'C5xXAPcDOF8',
    //     // width: $(window).width(),
    //     start: 0
    // };
    // $('#loop').tubular(options);


    init();
    animate();
    // youTubes_makeDynamic();

});
var wglContainer, hp, conttest, options, curr_hp_dir, onWindowResize, hpwidth, hpheight, camera, scene, manager, ambient, imageLoader, directionalLight, renderer, texture;
var mouseX = 0,
    mouseY = 0,
    mouseScr = 0;;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function init() {
    $('#parawrap').parallax({
        imageSrc: "images/xhd_strip.jpg"
    });


    curr_hp_dir = Math.floor(Math.random() * 5 + 1); // Math.random() * (max - min) + min;
    camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 1, 5000); //5000 camera hotizont!!
    camera.position.x = 2050;
    camera.position.y = 850;
    camera.position.z = 550;

    scene = new THREE.Scene();
    ambient = new THREE.AmbientLight(0x101030);
    directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(ambient);
    scene.add(directionalLight);
    // texture
    manager = new THREE.LoadingManager();
    manager.onProgress = function(item, loaded, total) {
        console.log(item, loaded, total);
    };
    texture = new THREE.Texture();
    var onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function(xhr) {};
    imageLoader = new THREE.ImageLoader(manager);
    imageLoader.load("images/textures/" + curr_hp_dir + "/tex.png", function(image) {
        texture.image = image;
        texture.needsUpdate = true;
    });
    // model
    var loader = new THREE.OBJLoader(manager);
    loader.load('models/2.obj', function(object) {
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = texture;
            }
        });
        object.position.y = 100;
        object.position.z = 100;
        // object.position.y = -95;
        scene.add(object);
    }, onProgress, onError);
    //
    $('#hpwebgl').height(window.innerHeight);
    hpwidth = $('#hpwebgl').width();
    // console.log("width of hp_wglContainer = " + hpwidth);
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(hpwidth, window.innerHeight);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('touchmove', onDocumentTouchMove, false);
    window.addEventListener('resize', onWindowResize, false);
    wglContainer.appendChild(renderer.domElement);
    // $('body').on('resize', )
}
onWindowResize = function() {
    hpwidth = $('#hpwebgl').width();
    hpheight = $('#hpwebgl').height();
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(hpwidth, hpheight);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 2;
    mouseY = (event.clientY - windowHalfY) * 2;
}

function onDocumentTouchMove(event) {
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseX = (event.touches[0].pageX - windowHalfX) * 2;
        mouseY = (event.touches[0].pageX - windowHalfY) * 2;
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    camera.position.x += (mouseX - camera.position.x) * .5;
    camera.position.y += (-mouseY - camera.position.y) * .5;
    camera.position.z += (mouseY + camera.position.y) * .5;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}
