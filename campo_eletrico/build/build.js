var max_mag = 120;
var Charge = (function () {
    function Charge(charge, pos, mass) {
        if (mass === void 0) { mass = 1; }
        this.epsilon = 1;
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.charge = charge;
        this.pos = pos;
        this.mass = mass;
    }
    Charge.prototype.eletric_field = function (pos) {
        var scalar = this.charge / (4 * PI * this.epsilon);
        return p5.Vector.mult(pos, scalar / pow(pos.mag(), 3));
    };
    Charge.prototype.draw = function () {
        fill('red');
        noStroke();
        circle(this.pos.x, this.pos.y, 20);
    };
    Charge.prototype._draw_force = function (_force) {
        var force = _force.copy().mult(100);
        force.limit(max_mag);
        strokeWeight(2);
        stroke('magenta');
        push();
        translate(this.pos.x, this.pos.y);
        line(0, 0, force.x, force.y);
        fill('orange');
        noStroke();
        circle(force.x, force.y, min(force.mag(), 5));
        pop();
    };
    Charge.prototype.edges = function () {
        if (this.pos.x < 0 && this.velocity.x < 0) {
            this.velocity.x *= -1;
        }
        else if (this.pos.x > windowWidth && this.velocity.x > 0) {
            this.velocity.x *= -1;
        }
        if (this.pos.y < 0 && this.velocity.y < 0) {
            this.velocity.y *= -1;
        }
        else if (this.pos.y > windowHeight && this.velocity.y > 0) {
            this.velocity.y *= -1;
        }
    };
    Charge.prototype.update = function (charges) {
        var dt = 0.1;
        var E = createVector(0, 0);
        for (var _i = 0, charges_1 = charges; _i < charges_1.length; _i++) {
            var charge = charges_1[_i];
            if (charge === this)
                continue;
            var r = p5.Vector.sub(this.pos, charge.pos);
            E.add(charge.eletric_field(r));
        }
        var force = p5.Vector.mult(E, this.charge);
        force.limit(max_mag);
        this.acceleration.set(force.div(this.mass));
        this.velocity.add(p5.Vector.mult(this.acceleration, dt));
        this.pos.add(p5.Vector.mult(this.velocity, dt));
        this.edges();
        this._draw_force(force);
    };
    return Charge;
}());
var FieldItem = (function () {
    function FieldItem(color, pos, dir, mag) {
        this.color = color;
        this.pos = pos;
        this.dir = dir;
        this.mag = mag;
    }
    return FieldItem;
}());
var VectorField = (function () {
    function VectorField(hArrows, vArrows) {
        this.hArrows = hArrows;
        this.vArrows = vArrows;
        this.width = windowWidth;
        this.height = windowHeight;
        this.field = [];
        var hcell = this.width / this.hArrows;
        var vcell = this.height / this.vArrows;
        for (var i = 0; i < this.vArrows; i++) {
            this.field[i] = [];
            for (var j = 0; j < this.vArrows; j++) {
                this.field[i][j] = new FieldItem(color('blue'), createVector(i * hcell + hcell / 2, j * vcell + vcell / 2), createVector(1, 0), 15);
            }
        }
    }
    VectorField.prototype._draw_field_item = function (field_item) {
        strokeWeight(1);
        stroke('blue');
        push();
        translate(field_item.pos.x, field_item.pos.y);
        line(-field_item.dir.x * field_item.mag / 2, -field_item.dir.y * field_item.mag / 2, field_item.dir.x * field_item.mag / 2, field_item.dir.y * field_item.mag / 2);
        fill('darkgreen');
        noStroke();
        circle(field_item.dir.x * field_item.mag / 2, field_item.dir.y * field_item.mag / 2, min(field_item.mag, 3));
        pop();
    };
    VectorField.prototype.mapVectors = function (callback) {
        for (var i = 0; i < this.field.length; i++) {
            for (var j = 0; j < this.field[i].length; j++) {
                var field_item = this.field[i][j];
                callback(field_item);
            }
        }
    };
    VectorField.prototype.draw = function () {
        for (var i = 0; i < this.field.length; i++) {
            for (var j = 0; j < this.field[i].length; j++) {
                var field_item = this.field[i][j];
                this._draw_field_item(field_item);
            }
        }
    };
    return VectorField;
}());
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var field;
var charges;
var static_charges;
var moving_charges;
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER).noFill().frameRate(30);
    field = new VectorField(40, 40);
    static_charges = [
        new Charge(-1000, createVector(windowWidth / 2, windowHeight / 2)),
    ];
    moving_charges = [
        new Charge(1000, createVector(windowWidth * 0.2, windowHeight * 0.5)),
        new Charge(1000, createVector(windowWidth / 2, windowHeight / 2)),
        new Charge(1000, createVector(windowWidth / 2, windowHeight / 2)),
        new Charge(1000, createVector(windowWidth / 2, windowHeight / 2)),
        new Charge(1000, createVector(windowWidth / 2, windowHeight / 2)),
        new Charge(1000, createVector(windowWidth / 2, windowHeight / 2)),
    ];
    charges = __spreadArrays(static_charges, moving_charges);
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
    background(0);
    if (static_charges.length) {
        static_charges[0].pos.set(mouseX, mouseY);
    }
    field.mapVectors(function (field_item) {
        var E = createVector(0, 0);
        for (var _i = 0, charges_3 = charges; _i < charges_3.length; _i++) {
            var charge = charges_3[_i];
            var r = p5.Vector.sub(field_item.pos, charge.pos);
            E.add(charge.eletric_field(r));
        }
        field_item.dir.set(E.copy().normalize());
        field_item.mag = min(E.mag() * 1000, 25);
    });
    field.draw();
    for (var _i = 0, charges_2 = charges; _i < charges_2.length; _i++) {
        var charge = charges_2[_i];
        if (moving_charges.includes(charge)) {
            charge.update(charges);
        }
        charge.draw();
    }
}
//# sourceMappingURL=build.js.map