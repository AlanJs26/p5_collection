class Machine {
  main_stack: DigitStack
  secondary_stack: DigitStack

  selected_column: number = 0
  selected_row: number = 0
  base: number

  center: boolean = true
  loop: boolean = false
  finished: boolean = false

  operatorSymbol = '+'

  pos: p5.Vector
  constructor(list: string[], base: number = 10, x: number = 0, y: number = 0){
    this.pos = createVector(x,y)
    this.main_stack = DigitStack.fromArray(
      this.pos,
      list.length ? list.map(e => e.split('').map(Number)) : [[]]
    )

    this.base = base
    this.main_stack.setBase(base)

    this.secondary_stack = new DigitStack(this.pos.copy())
  }

  clearCarries(){
    for(let row of this.main_stack.rows){
      for(let element of row){
        element.carry = []
        element.new_value = []
      }
    }
  }

  restart(){
    this.clearCarries()
    this.selected_column = 0
    this.selected_row = 0
    this.finished = false
    this.secondary_stack.rows = [[]]
  }

  clearAll(){
    this.clearCarries()
    this.main_stack.rows = [[]]
    this.secondary_stack.rows = [[]]
  }

  step?(): void

  draw(){
    textSize(this.main_stack.textSize)
    const text_height = textAscent()

    textSize(this.main_stack.textSize*0.8)
    const hoffset = text_height/5
    for (let i = 0; i < this.main_stack.rows.length-1; i++) {
      const yoffset = text_height/2 + text_height*i
      text(this.operatorSymbol, this.pos.x + hoffset, this.pos.y + yoffset)
    }

    const max_length = this.main_stack.rows.reduce((p, n) => max(p, n.length), 0)
    const main_stack_height = this.main_stack.rows.length*text_height
    
    stroke('white')
    line(this.pos.x - max_length*text_height, this.pos.y + main_stack_height,
         this.pos.x,                          this.pos.y + main_stack_height
        )

    const secondary_stack_offset = text_height
    if(this.center){
      this.pos.set(windowWidth/2 + max_length*text_height/2, windowHeight/2 - (main_stack_height+secondary_stack_offset)/2)
    }

    this.secondary_stack.pos.set(this.pos.x, this.pos.y + main_stack_height + secondary_stack_offset)

    this.main_stack.draw()
    this.secondary_stack.draw()
  }
}

