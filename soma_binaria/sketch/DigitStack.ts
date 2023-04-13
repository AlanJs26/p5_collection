class DigitStack {
  rows: Digit[][] = [[]]

  pos: p5.Vector
  textSize: number = 50

  static fromArray(pos: p5.Vector, list: number[][]){
    const stack = new DigitStack(pos)
    stack.rows = []

    for (let i = 0; i < list.length; i++) {
      const row: Digit[] = []
      for (let j = 0; j < list[i].length; j++) {
        const element = list[i][j];

        row.push(new Digit(element))
      }
      stack.rows.push(row)
    }

    return stack 
  }

  transpose(){
    const columns: Digit[][] = []

    const max_length = this.rows.reduce((p, n) => max(p, n.length), 0)

    for (let i = 0; i < max_length; i++) {
      const column = []

      for(let row of this.rows){
        if(i < max_length-row.length) continue;

        column.push(row[i - (max_length-row.length)])
      }
      columns.push(column)
    }

    return columns
    
  }

  setTextSize(new_size: number){
    this.textSize = new_size
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.rows[i].length; j++) {
        const element = this.rows[i][j];
        element.size = this.textSize

      }
    }
  }
  setBase(new_base: number){
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.rows[i].length; j++) {
        const element = this.rows[i][j];
        element.base = new_base
      }
    }
  }

  constructor(pos: p5.Vector){
    this.pos = pos
  }

  draw(){
    for (let i = 0; i < this.rows.length; i++) {
      textSize(this.textSize)
      const yoffset = i*textAscent()
      let hoffset = 0

      for (let j = this.rows[i].length-1; j >= 0; j--) {
        const element = this.rows[i][j];
        hoffset += element.getWidth()
        element.pos.set(this.pos.x - hoffset, this.pos.y + yoffset)
        element.draw()
      }
    }

  }

}

