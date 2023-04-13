
class SumMachine extends Machine {

  constructor(list: string[], base: number = 10, x: number = 0, y: number = 0){
    super(list, base, x, y)
    this.operatorSymbol = '+'
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

    let result  = transposed[column_index].reduce((p,n) => p+n.getValue(), 0)
    result     += transposed[column_index][0].sumCarry()

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

