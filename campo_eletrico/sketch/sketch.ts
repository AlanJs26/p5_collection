
let field: VectorField
let charges: Charge[]

let static_charges: Charge[]
let moving_charges: Charge[]

function setup() {
  console.log("🚀 - Setup initialized - P5 is running");

  createCanvas(windowWidth, windowHeight)
  rectMode(CENTER).noFill().frameRate(30);
  field = new VectorField(40, 40)



  static_charges = [
    new Charge(-1000, createVector(windowWidth/2, windowHeight/2)),
    // new Charge(1000, createVector(windowWidth*0.7, windowHeight*0.5)),
  ]

  moving_charges = [
    new Charge(1000, createVector(windowWidth*0.2, windowHeight*0.5)),
    new Charge(1000, createVector(windowWidth/2, windowHeight/2)),
    new Charge(1000, createVector(windowWidth/2, windowHeight/2)),
    new Charge(1000, createVector(windowWidth/2, windowHeight/2)),
    new Charge(1000, createVector(windowWidth/2, windowHeight/2)),
    new Charge(1000, createVector(windowWidth/2, windowHeight/2)),
  ]

  charges = [...static_charges, ...moving_charges]
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function draw() {
  
  background(0);
  if(static_charges.length){
    static_charges[0].pos.set(mouseX, mouseY)
  }

  field.mapVectors((field_item) => {

    const E = createVector(0,0)
    for(let charge of charges){
      const r = p5.Vector.sub(field_item.pos, charge.pos)
      E.add(charge.eletric_field(r))
    }

    field_item.dir.set(E.copy().normalize())
    field_item.mag = min(E.mag()*1000, 25)
  })
  field.draw()


  for(let charge of charges){
    if(moving_charges.includes(charge)){
      charge.update(charges)
    }
    charge.draw()
  }
}
