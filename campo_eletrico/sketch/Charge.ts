
const max_mag = 120

class Charge {
  charge: number
  pos: p5.Vector
  epsilon: number = 1

  velocity: p5.Vector = createVector(0,0)
  acceleration: p5.Vector = createVector(0,0)
  mass: number

  constructor(charge: number, pos: p5.Vector, mass: number = 1){
    this.charge = charge
    this.pos = pos
    this.mass = mass
  }

  eletric_field(pos: p5.Vector) : p5.Vector{
    const scalar = this.charge / (4 * PI * this.epsilon)
    return p5.Vector.mult(pos, scalar/pow(pos.mag(), 3))
  }

  draw(){
    fill('red')
    noStroke()
    circle(this.pos.x, this.pos.y, 20)
  }

  _draw_force(_force: p5.Vector){
    const force = _force.copy().mult(100)
    force.limit(max_mag)

    strokeWeight(2)
    stroke('magenta')
    push()
    translate(this.pos.x, this.pos.y)

    line(0, 0, force.x, force.y)

    fill('orange')
    noStroke()
    circle(force.x, force.y, min(force.mag(), 5))
    pop()

  }

  edges(){
    if(this.pos.x < 0 && this.velocity.x < 0){
      this.velocity.x *= -1
    }else if (this.pos.x > windowWidth && this.velocity.x > 0){
      this.velocity.x *= -1
    }

    if(this.pos.y < 0 && this.velocity.y < 0){
      this.velocity.y *= -1
    }else if (this.pos.y > windowHeight && this.velocity.y > 0){
      this.velocity.y *= -1
    }
  }

  update(charges: Charge[]){
    const dt = 0.1

    const E = createVector(0,0)
    for(let charge of charges){
      if(charge === this) continue;
      const r = p5.Vector.sub(this.pos, charge.pos)
      E.add(charge.eletric_field(r))
    }

    const force = p5.Vector.mult(E, this.charge)
    force.limit(max_mag)

    this.acceleration.set(force.div(this.mass))
    this.velocity.add(p5.Vector.mult(this.acceleration, dt))
    this.pos.add(p5.Vector.mult(this.velocity, dt))

    this.edges()


    this._draw_force(force)
  }
}
