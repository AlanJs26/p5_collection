
class FieldItem {
  color: p5.Color
  pos: p5.Vector
  dir: p5.Vector
  mag: number

  constructor(color: p5.Color, pos: p5.Vector, dir: p5.Vector, mag: number) {
    this.color = color
    this.pos = pos
    this.dir = dir
    this.mag = mag
  }
}

class VectorField {
  hArrows: number
  vArrows: number
  field: FieldItem[][]
  width: number
  height: number

  constructor(hArrows:number, vArrows:number) {
    this.hArrows = hArrows
    this.vArrows = vArrows
    this.width = windowWidth
    this.height = windowHeight
    this.field = []

    const hcell: number = this.width/this.hArrows 
    const vcell: number = this.height/this.vArrows 
    for (let i = 0; i < this.vArrows; i++) {
      this.field[i] = [];
      for (let j = 0; j < this.vArrows; j++) {
        this.field[i][j] = new FieldItem(
          color('blue'),
          createVector(i*hcell+hcell/2, j*vcell+vcell/2),
          createVector(1,0),
          15
        )
      }
    }

}

  _draw_field_item(field_item: FieldItem){

    strokeWeight(1)
    stroke('blue')
    push()
    translate(field_item.pos.x, field_item.pos.y)
    line(-field_item.dir.x*field_item.mag/2, -field_item.dir.y*field_item.mag/2,
          field_item.dir.x*field_item.mag/2,  field_item.dir.y*field_item.mag/2
        )
        fill('darkgreen')
    noStroke()
    circle(field_item.dir.x*field_item.mag/2,  field_item.dir.y*field_item.mag/2, min(field_item.mag, 3))
    pop()

  }

  mapVectors(callback: (field_item: FieldItem) => void){
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        const field_item = this.field[i][j]
        callback(field_item)
      }
    }

  }

  draw() {
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        const field_item = this.field[i][j]
        this._draw_field_item(field_item)
      }
    }
  }
}
