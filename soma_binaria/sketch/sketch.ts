let machine: Machine

function setup() {
  console.log("🚀 - Setup initialized - P5 is running");

  createCanvas(windowWidth, windowHeight)
  rectMode(CENTER).noFill().frameRate(30);

  // machine = new MultMachine(
  //   windowWidth/4, windowHeight/2,
  //   '110100101',
  //   '110100101',
  //   2
  // )

  machine = new SubMachine(
    [
      '111100101',
      '110101111',
    ],
    2
  )
  machine.loop = true

}

function mouseClicked(){
  machine.step()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);


}

function draw() {
  
  background(0);
  machine.draw()
  // digit.draw()

}

