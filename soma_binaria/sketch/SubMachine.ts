
class SubMachine extends Machine{

  constructor(list: string[], base: number = 10, x: number = 0, y: number = 0){
    super(list, base, x, y)
    this.operatorSymbol = '-'
  }

  step(){
    const transposed: Digit[][] = this.main_stack.transpose()

    const column_index = transposed.length-this.selected_column-1

    if(column_index < 0){
      this.finished = true
      if(!this.loop) return;
      this.restart()
      return;
    }

    const column_element = transposed[column_index][0]

    let result = column_element.getValue()
    result += column_element.sumCarry()

    for (let i = 1; i < transposed[column_index].length; i++) {
      result -= transposed[column_index][i].getValue();
    }

    if(result < 0){
      const next_column_element = transposed[column_index-1][0]
      const element_value = next_column_element.getValue()

      next_column_element.update_value(element_value-1)
      column_element.carry.push(new Digit(this.base))
      return
    }

    const converted = Digit.toBase(result, this.base)

    const digit = converted.pop()
    this.secondary_stack.rows[this.selected_row].unshift(digit)

    let i = 1
    while(converted.length){
      const next_column = transposed[column_index-i]

      if(next_column === undefined){
        this.secondary_stack.rows[this.selected_row].unshift(converted.pop())
      }else{
        transposed[column_index-i][0].carry.push(converted.pop())
      }

      i++
    }

    this.selected_column++
  }

}

