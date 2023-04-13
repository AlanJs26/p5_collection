class Digit {
  base: number = 10
  value: number
  pos: p5.Vector = createVector(0,0)
  carry: Digit[] = []

  new_value: Digit[] = []

  is_cut = false
  color: p5.Color = color('white')

  size: number = 50

  static BASE_MAP: { [key: number]: string } = {
    0: '0',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: 'A',
    11: 'B',
    12: 'C',
    13: 'D',
    14: 'E',
    15: 'F',
    16: 'G',
    17: 'H',
    18: 'I',
    19: 'J',
    20: 'K',
    21: 'L',
    22: 'M',
    23: 'N',
    24: 'O',
    25: 'P',
    26: 'Q',
    27: 'R',
    28: 'S',
    29: 'T',
    30: 'U',
    31: 'V',
    32: 'W',
    33: 'X',
    34: 'Y',
    35: 'Z',
  }

  static REVERSED_BASE_MAP: { [key: string]: number } = Object.fromEntries(
    Object.entries(Digit.BASE_MAP).map(([k,v]) => [v.toString(),Number(k)])
  )

  constructor(value: number){
    this.value = value
  }

  toString(){
    if(this.value >= 0 && this.value <= 15){
      return Digit.BASE_MAP[this.value]
    }
    return ''
  }

  getValue(){
    return this.getDigit().value
  }
  getDigit(){
    if(this.new_value.length){
      return this.new_value[this.new_value.length-1]
    }
    return this
  }

  sumCarry(){
    return this.carry.reduce((p,n) => p+n.getValue(), 0)
  }

  static toBase(num: number, base: number){
    const digits: Digit[] = []

    do{
      digits.push(new Digit(num % base))
      num = Math.floor(num/base)
    }while(num >= 1);

    return digits.reverse()
  }

  update_value(value: number){
    this.new_value.push(new Digit(value))
  }

  getHeight(){
    const prev = textSize()
    textSize(this.size)
    const height = textAscent()
    textSize(prev)
    return height
  }
  getWidth(){
    const prev = textSize()
    textSize(this.size)
    const width = textWidth(this.toString()) 
    textSize(prev)
    return width
  }


  draw() {
    textAlign(CENTER, CENTER)
    textSize(this.size)
    fill(this.color)
    noStroke()
    text(this.toString(), this.pos.x, this.pos.y)

    if(this.new_value.length || this.is_cut){
      stroke('red')
      noFill()
      strokeWeight(5)
      const textheight = textAscent()
      const textwidth = textWidth(this.toString())
      line(this.pos.x-textwidth/3, this.pos.y-textheight/3,
           this.pos.x+textwidth/3, this.pos.y+textheight/3)
    }

    let i = 0

    for(let new_digit of this.new_value){
      new_digit.size = this.size/2
      if(i < this.new_value.length-1){
        new_digit.is_cut = true
      }else{
        new_digit.is_cut = false
      }

      const y_offset = this.getHeight()

      const textheight = new_digit.getHeight()


      new_digit.pos.set(this.pos.x, this.pos.y - y_offset - i*textheight*1.2)
      new_digit.draw()
      i++
    }

    i = 0
    for(let carry_digit of this.carry){
      carry_digit.size = this.size/2

      let y_offset = this.getHeight()

      const textheight = carry_digit.getHeight()

      y_offset += (this.new_value.length)*textheight*1.2

      carry_digit.pos.set(this.pos.x, this.pos.y - y_offset - i*textheight*1.2)
      carry_digit.color = color('gray')
      carry_digit.draw()
      i++
    }
  }
}
