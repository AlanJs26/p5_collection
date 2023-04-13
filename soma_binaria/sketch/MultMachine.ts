
class MultMachine extends Machine{
  sum_machine: SumMachine

  selected_column: number = 0
  selected_column_below: number = 0
  selected_row: number = 0

  constructor(number1: string, number2: string, base: number = 10, x: number = 0, y: number = 0) {
    super([], base, x, y)
    this.main_stack = DigitStack.fromArray(this.pos, [
      number1.split('').map(n => Digit.REVERSED_BASE_MAP[n]),
      number2.split('').map(n => Digit.REVERSED_BASE_MAP[n])
    ])
    this.main_stack.setBase(base)

    this.sum_machine = new SumMachine([], this.base)
    this.sum_machine.center = false
    this.operatorSymbol = 'x'
  }

  clearAll(){
    this.clearCarries()
    this.sum_machine.clearAll()
  }

  restart(){
    this.clearAll()
    this.sum_machine.restart()
    this.selected_column = 0
    this.selected_column_below = 0
    this.selected_row = 0
  }

  step(){
    const selected_index = this.main_stack.rows[0].length-this.selected_column-1
    const selected_index_below = this.main_stack.rows[1].length-this.selected_column_below-1

    if(this.sum_machine.finished){
      this.restart()
      return;
    }

    if(selected_index_below < 0){
      this.sum_machine.step()
      return
    }

    if(selected_index < 0){
      this.clearCarries()
      this.selected_column = 0
      this.selected_row += 1
      this.selected_column_below += 1
      if(this.selected_column_below < this.main_stack.rows[1].length){
        const new_row = []
        for (let i = 0; i < this.selected_column_below; i++) {
          new_row.push(new Digit(0))
          
        }
        this.sum_machine.main_stack.rows.push(new_row)
      }else{
        this.step()
      }
      return
    }


    const selected = this.main_stack.rows[0][selected_index]
    const selected_below = this.main_stack.rows[1][selected_index_below]

    const converted = Digit.toBase(
      selected.getValue() * selected_below.getValue() + selected.sumCarry(),
      this.base
    )

    const digit = converted.pop()
    this.sum_machine.main_stack.rows[this.selected_row].unshift(digit)

    let i = 1
    while(converted.length){
      const next_column = this.main_stack.rows[0][selected_index-i]

      if(next_column === undefined){
        this.sum_machine.main_stack.rows[this.selected_row].unshift(converted.pop())
      }else{
        next_column.carry.push(converted.pop())
      }

      i++
    }

    this.selected_column++
  }

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

    const sum_machine_height = this.sum_machine.main_stack.rows.length*text_height
    
    this.pos.set(windowWidth/2 + max_length*text_height/2, windowHeight/2 - (main_stack_height+sum_machine_height+secondary_stack_offset)/2)

    this.secondary_stack.pos.set(this.pos.x, this.pos.y + main_stack_height + secondary_stack_offset)


    this.sum_machine.pos.set(this.pos.x, this.pos.y + main_stack_height + secondary_stack_offset)


    this.main_stack.draw()
    this.secondary_stack.draw()
    this.sum_machine.draw()
  }
}

