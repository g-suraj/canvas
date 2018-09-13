// globals
let dot_radius = 10;
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let HEIGHT = canvas.height;
let WIDTH = canvas.width;
let MAX_TTL = 50;
let VEL_MAX = 20;

let dots = [];

class Dot {
    constructor(x, y, vel, colors) {
        this.x = x;
        this.y = y;
        this.vel = vel;
        this.ttl = MAX_TTL; // ticks
        this.me = new Path2D();
        this.me.arc(x, y, dot_radius, 0, 2 * Math.PI);
    }

    draw(top) {
        if (this.ttl <= 0) {
            return false;
        }

        let fade = (1 - (this.ttl / MAX_TTL)) * 255;
        if (top) {
            context.fillStyle = 'rgba(' + fade + ',' + fade + ',' + fade + ', 1)';
            context.fill(this.me);

        } else {
            fade += 100;
            context.strokeStyle = 'rgba(' + fade + ',' + fade + ',' + fade + ', 1)';
            context.stroke(this.me);
        }
        this.ttl--;
        return true;
    }
}

let getNewVel = function () {
    let vel = {};
    let x_squared = Math.random() * VEL_MAX;
    vel.x = Math.sqrt(x_squared)
    vel.y = Math.sqrt(VEL_MAX - x_squared)

    if (Math.random() > 0.5) {
        vel.x *= -1;
    }

    if (Math.random() > 0.5) {
        vel.y *= -1;
    }
    return vel;
}

let checkCollision = function (dot) {


    let new_x = dot.x + dot.vel.x;
    let new_y = dot.y + dot.vel.y;

    if (new_x <= 0 || new_x >= WIDTH) {
        dot.vel.x *= -1;
        dot.vel.x += (Math.random());
    }

    if (new_y <= 0 || new_y >= HEIGHT) {
        dot.vel.y *= -1;
        dot.vel.y += (Math.random());
    }

}

let process_dot = function (dot) {
    if (dot.length == 0) {
        return;
    }

    checkCollision(dot[0]);

    let current = new Dot(dot[0].x + dot[0].vel.x, dot[0].y + dot[0].vel.y, dot[0].vel);
    dot.unshift(current);

    for (let i = dot.length - 1; i >= 0; i--) {
        let top = (i == 0);
        if (!dot[i].draw(top)) {
            dot.splice(i, 1);
        }
    }
}

let loop_arrs = function () {
    dots.map((dot) => {
        process_dot(dot);
    });

    window.requestAnimationFrame(() => {
        context.clearRect(0, 0, WIDTH, HEIGHT);
        loop_arrs();
    });
}

let main = function () {

    if (!context) {
        console.log("Error getting 2d context");
        return;
    }

    let center = new Dot(WIDTH / 2, HEIGHT / 2, getNewVel());

    dots.push([center]);

    canvas.addEventListener('click', function () {
        let newOne = new Dot(Math.random() * WIDTH, Math.random() * HEIGHT, getNewVel());
        dots.push([newOne]);
    }, false);

    loop_arrs();
}


// call
main();