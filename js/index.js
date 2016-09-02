
// variables
var $header_top = $('.header-top');
var $nav = $('nav');



// toggle menu 
$header_top.find('a').on('click', function() {
  $(this).parent().toggleClass('open-menu');
});



// fullpage customization
$('#fullpage').fullpage({
  sectionsColor: ['#B8AE9C', '#000000', '#F2AE72', '#5C832F', '#B8B89F'],
  sectionSelector: '.vertical-scrolling',
  slideSelector: '.horizontal-scrolling',
  navigation: true,
  slidesNavigation: true,
  controlArrows: false,
  anchors: ['firstSection', 'secondSection', 'thirdSection', 'fourthSection', 'fifthSection'],
  menu: '#menu',

  afterLoad: function(anchorLink, index) {
    $header_top.css('background', 'rgba(0, 47, 77, .3)');
    $nav.css('background', 'rgba(0, 47, 77, .25)');
    if (index == 5) {
        $('#fp-nav').hide();
      }
  },

  onLeave: function(index, nextIndex, direction) {
    if(index == 5) {
      $('#fp-nav').show();
    }
  },

  afterSlideLoad: function( anchorLink, index, slideAnchor, slideIndex) {
    if(anchorLink == 'fifthSection' && slideIndex == 1) {
      $.fn.fullpage.setAllowScrolling(false, 'up');
      $header_top.css('background', 'transparent');
      $nav.css('background', 'transparent');
      $(this).css('background', '#374140');
      $(this).find('h2').css('color', 'white');
      $(this).find('h3').css('color', 'white');
      $(this).find('p').css(
        {
          'color': '#DC3522',
          'opacity': 1,
          'transform': 'translateY(0)'
        }
      );
    }
  },

  onSlideLeave: function( anchorLink, index, slideIndex, direction) {
    if(anchorLink == 'fifthSection' && slideIndex == 1) {
      $.fn.fullpage.setAllowScrolling(true, 'up');
      $header_top.css('background', 'rgba(0, 47, 77, .3)');
      $nav.css('background', 'rgba(0, 47, 77, .25)');
    }
  } 
});



// Добавляем паутинку на первый слайд

(function() {

    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height+'px';

        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for(var x = 0; x < width; x = x + width/20) {
            for(var y = 0; y < height; y = y + height/20) {
                var px = x + Math.random()*width/20;
                var py = y + Math.random()*height/20;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in points) {
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(156,217,249,'+ p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(156,217,249,'+ _this.active+')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
    
})();



var Game = function(){

  this.aParticles = [];

  Game.prototype.init = function()
  {


    var oParticle = new Particles();
    this.aParticles.push( oParticle );
  
  }


  Game.prototype.pop = function(){

    var addP = this.addParticle.bind( this );

    setTimeout(function(){

      addP()

    }, ( 1000 - guiControls.popFreq ) / 10 );

  }

  Game.prototype.addParticle = function(){
    
    this.aParticles.push( new Particles() );

    this.pop();

    
  }

  Game.prototype.removeParticle = function( _i ){

    this.aParticles.splice( _i, 1 );

  }


  Game.prototype.rec_rec_collision = function( r1, r2)
  {

    if ( r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.h + r1.y > r2.y ) 
        return true;
    else 
      return false; 

  }

  Game.prototype.circle_circle_collision = function( dot1, dot2 ){

    var dx = dot1.x - dot2.x;
    var dy = dot1.y - dot2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if ( distance < dot1.r + dot2.r)
      return true;
    else
      return false;

  }


  Game.prototype.getDist = function( dot1, dot2 )
  {

    var dx = dot1.x - dot2.x;
    var dy = dot1.y - dot2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    return distance;

  }



  Game.prototype.jump = function()
  { 
    
    for (var i = this.aParticles.length - 1; i >= 0; i--) {
    
      this.aParticles[i].vy -= rand( guiControls.jumpForce * .3, guiControls.jumpForce );
      this.aParticles[i].vx += rand( -2, 2 );     

    };
    

  };

  Game.prototype.update = function()
  { 
    
    for (var i = this.aParticles.length - 1; i >= 0; i--) {
    
      this.aParticles[i].update( i );

    };
    

  };


  Game.prototype.draw = function( ctx ) 
  {

    for (var i = 0; i <= this.aParticles.length - 1; i++) {
      
      this.aParticles[i].draw( ctx );
      
    };

  };

  this.init();


}



var Particles = function(){

  this.w      = rand( 0, guiControls.width );

  if( !guiControls.mousePop ){

    this.x      = rand( 0, oSize.w );
    this.y      = rand( 0, oSize.h );

  }else {

    this.x      = oMouse.x;
    this.y      = oMouse.y;

  }

  this.lx     = this.x;
  this.ly     = this.y;

  
  if( oMouse.vx > -2 && oMouse.vx < 2 )
    this.vx     = rand( -5, 5 );
  else
    this.vx     = oMouse.vx * guiControls.mouseVelocity;
  
  if( oMouse.vy > -2 && oMouse.vy < 2 )
    this.vy     = rand( -15, -10 );
  else
    this.vy     = oMouse.vy * guiControls.mouseVelocity;
  
  this.life     = rand( ( guiControls.life - 5 ), ( guiControls.life + 5 ) );

  this.bounceY  = rand( guiControls.bounceY - 0.2, guiControls.bounceY + 0.2 );
  this.bounceX  = rand( 0.8, 0.99 );

  this.a      = 0;
  this.ta     = 1;
  this.gravity  = guiControls.gravity;

  this.c      = iParticlesColor;
  
  
  
  


  Particles.prototype.update = function( i )
  {

    this.lx     = this.x;
    this.ly     = this.y;

    if( this.a < this.ta && this.life > 0 )
      this.a += 0.06;

    this.vy += this.gravity;
    
    if( this.vy > 50 )
      this.vy = 50;
    
    this.x += this.vx;
    this.y += this.vy;

    if( this.y > oSize.h - ( this.w / 2 ) ){

      this.vy *= -this.bounceY;
      this.vx *=  this.bounceX;
      this.y = oSize.h - ( this.w / 2 );

    }

    if( this.x <= ( this.w / 2 ) ){

      this.x = ( this.w / 2 );
      this.vy *= this.bounceY;
      this.vx *= -this.bounceX;

    }


    if( this.x >= oSize.w - ( this.w / 2 ) ){

      this.x = oSize.w - ( this.w / 2 );
      this.vy *= this.bounceY;
      this.vx *= -this.bounceX;

    }


    this.updateLife( i );


  }

  Particles.prototype.updateLife = function( _i ){

    if( this.life <= 0 )
      this.a -= 0.05;
    else
      this.life -= 0.05;

    if( this.life <= 0 && this.a <= 0 )
      oGame.removeParticle( _i );

  }

  Particles.prototype.draw = function( ctx )
  {

    ctx.beginPath();
    
    if( this.lx == this.x || this.ly == this.y )
      ctx.moveTo( this.lx - .1 , this.ly - .1);
    else
      ctx.moveTo( this.lx, this.ly);
    
    ctx.lineTo( this.x, this.y);
    ctx.strokeStyle = "hsla( " + this.c + ", 100%, 50%, " + this.a + " )";
    ctx.lineWidth = this.w;
    ctx.lineCap = 'round';
    ctx.stroke();

      ctx.closePath();

  };


};











/** global vars **/
rand = function( min, max ){ return Math.random() * ( max - min) + min; };
update_mouse = function( _e ){ 
  oMouse.ly = oMouse.y; 
  oMouse.lx = oMouse.x; 
  oMouse.y = _e.pageY; 
  oMouse.x = _e.pageX; 
  oMouse.vy =  oMouse.y - oMouse.ly;
  oMouse.vx =  oMouse.x - oMouse.lx;
  
  if( oMouse.vx < -20 )
    oMouse.vx = -20;
  if( oMouse.vx > 20 )
    oMouse.vx = 20;
  
};
onresize = function () { oSize.w = canvas.width = window.innerWidth; oSize.h = canvas.height = window.innerHeight; };
merge = function(o1,o2){var o3 = {};for (var attr in o1) { o3[attr] = o1[attr]; }for (var attr in o2) { o3[attr] = o2[attr]; }return o3;};



var oSize     = {
  h : window.innerHeight,
  w : window.innerWidth
};
var oMouse    = {
  x : oSize.w / 2,
  y : oSize.h / 2,
  lx : oSize.h / 2,
  ly : oSize.w / 2,
  vx : 0,
  vy : 0
};

var canvas    = document.getElementById('gravity');
var ctx     = canvas.getContext('2d');
var iParticlesColor = 180;
canvas.height   = oSize.h;
canvas.width  = oSize.w;





document.addEventListener('mousemove', update_mouse, false);
document.addEventListener('onresize', onresize, false);
window.onresize(); 





/** DAT GUI **/
var guiControls = new function(){

  this.popFreq          = 1000;
  this.width            = 4;
  this.gravity          = 1;
  this.life             = 5;
  this.bounceY          = 0.6;
  this.mousePop           = true;
  this.mouseVelocity        = 2;
  this.jumpForce          = 30; 

}
var datGUI = new dat.GUI();
datGUI.close();
//j'ajoute a mon ui les variable
datGUI.add( guiControls, 'popFreq', 0, 1000 );
datGUI.add( guiControls, 'width', 1, 100 );
datGUI.add( guiControls, 'gravity', 0.1, 3 );
datGUI.add( guiControls, 'life', 1, 40 );
datGUI.add( guiControls, 'bounceY', 0.5, 2 );
datGUI.add( guiControls, 'mousePop');
datGUI.add( guiControls, 'mouseVelocity', 0.2, 3);
datGUI.add( guiControls, 'jumpForce', 10, 100);




var oGame = new Game();

var jump = oGame.jump.bind( oGame );
document.getElementById('gravity').addEventListener('click', jump, false);

/** ANIMATION **/
function render(){
    document.getElementById('info').style.color = "hsla( " + iParticlesColor + ", 100%, 50%, 1 )";
  
  ctx.clearRect( 0, 0, oSize.w, oSize.h );
  
  

  if( iParticlesColor >= 360 )
    iParticlesColor = 0;
  else
    iParticlesColor += 0.3;
  
  
  oGame.update();

  oGame.draw( ctx );

  requestAnimationFrame( render );

}
render();

oGame.pop();

// Gravity Cloud 
/* The following mimics the starter shim */
var a = document.getElementById( 'c' ),
  b = document.body,
  c = a.getContext( '2d' );

a.width = window.innerWidth;
a.height = window.innerHeight;

/*
Minified

function L(){for(i=0;i<K.length;i++)d[K[i]]=d[K[i]+1]=d[K[i]+2]=0;for(z=0>z?z+360:z-3,b=z*(P/180),r=s(b)*l+v>>0,g=s(b+2*(P/3))*l+v>>0,b=s(b+4*(P/3))*l+v>>0,i=0;i<C;i++){var n=S[i],a=m[0]-n[0],t=m[1]-n[1],e=M.atan2(t,a),o=100/M.sqrt(a*a+t*t);n[2]+=M.cos(e)*o,n[3]+=s(e)*o,n[0]+=n[2],n[1]+=n[3],n[2]*=.96,n[3]*=.96,n[0]=n[0]>=w?n[0]-w:n[0]<0?n[0]+w-1:n[0],n[1]=n[1]>=h?n[1]-h:n[1]<0?n[1]+h-1:n[1],e=(n[1]+.5>>0)*w*4+4*(n[0]+.5>>0),K[i]=e,d[e]=r,d[e+1]=g,d[e+2]=b}c.putImageData(f,0,0),u&&requestAnimationFrame(L)}function R(){w=a.width=W.innerWidth,h=a.height=W.innerHeight,c.fillRect(0,0,w,h),f=c.getImageData(0,0,w,h),d=f.data}var W=window,S=[],K=[],m=[0,0],C=3e4,u=!0,w,h,f,d,r,g,b,z=1,M=Math,P=M.PI,s=M.sin,v=128.5,l=127;for(W.onresize=R,W.onmousemove=function(i){m[0]=i.pageX,m[1]=i.pageY},W.onclick=function(){u=!u,u&&L()},R(),i=0;i<C;i++)S.push([M.random()*w,M.random()*h,0,0]);L();

*/

/*
Unminified
*/

//Declare variables
var W = window,
  C = 30000, //number of particles
  S = [], //the array that holds all of the particles
  K = [], //holds all the old array pointers for particle coordinates
  m = [0, 0], //mouse coordinates
  u = true, //playing or paused
  w, h, f, d, //width, height, imagedata, actual data array
  r, g, b, z=1, //red, green, blue, degrees of color rotation
  M = Math,
  P = M.PI,
  s = M.sin,
  v = 128.5, //center of color range
  l = 127; //maximum deviation

//Main loop
function L(){

  //Set all old particle pixels back to black (way more efficient than clearing the whole canvas)
  for (i=0;i<K.length;i++) d[K[i]]=d[K[i]+1]=d[K[i]+2]=0;

  //Rotate through 360 degrees. If less than 0, add 360 to wrap around
    z=z<0?z+360:z-35;
  
  //This is what does the color rotation. It's three sine waves out of phase from each other by 120 degrees.
  b=z*(P/180); //Degrees to radians

    r=s(b)*l+v>>0; //Red (bit shifting was used for the rounding)
  g=s(b+2*(P/3))*l+v>>0; //Green
  b=s(b+4*(P/3))*l+v>>0; //Blue

  //Loop through all of the particles
  for (i=0;i<C;i++) {

    var n=S[i], //reference to current particle
        x=m[0]-n[0], //distance between particle and mouse on the X axis
        y=m[1]-n[1], //distance between particle and mouse on the Y axis
      k=M.atan2(y,x), //angle in radians
        o=100/M.sqrt(x*x+y*y); //gravity calculation

        n[2]+=M.cos(k)*o; //Velocity change on X axis
        n[3]+=s(k)*o; //Velocity change on Y axis

        n[0]+=n[2]; //Add current velocity to particle position on X axis
        n[1]+=n[3]; //Add current velocity to particle position on Y axis

        n[2]*=0.96; //Reduce the X axis velocity (drag)
        n[3]*=0.96; //Reduce the Y axis velocity

        n[0]=n[0]>=w?n[0]-w:n[0]<0?n[0]+w-1:n[0]; //Wrap particle to opposite side of screen if it goes out of bounds on X axis
        n[1]=n[1]>=h?n[1]-h:n[1]<0?n[1]+h-1:n[1]; //Wrap particle to opposite side of screen if it goes out of bounds on Y axis

    k=(n[1]+0.5>>0)*w*4+(n[0]+0.5>>0)*4; //Get which point in the imagedata array is the current particle's new position
    
    K[i]=k; //Keep array position so it doesn't need to be calculated next loop (increases render speed a lot)

    d[k]=r; //Set the red channel
    d[k+1]=g; //Set the green channel
    d[k+2]=b; //Set the blue channel

  }

  c.putImageData(f, 0, 0); //Push the updated imagedata back to the canvas
  u && requestAnimationFrame(L) //If playing, loop again
}

//Window resize handler. stretches the canvas to fit screen and refreshes imagedata array.
function R() {
  w=a.width=W.innerWidth;
  h=a.height=W.innerHeight;
  c.fillRect(0,0,w,h);
  f=c.getImageData(0,0,w,h);
  d=f.data;
};

//Attach event handlers
W.onresize = R;
W.onmousemove = function(e) {m[0]=e.pageX; m[1]=e.pageY}; //Sets mouse coordinate values.
W.onclick = function() {u=!u; u&&L()}; //Toggle playing boolean and if playing, start loop.

R(); //Call the resize function once to size the canvas before we begin.

//This fills the particle array with randomly positioned particles.
for (i=0;i<C;i++) S.push([M.random()*w,M.random()*h,0,0]);

L(); //Start the loop.