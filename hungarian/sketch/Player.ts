import { SPREAD, fieldWidth, fieldHeight } from './sketch'

const p5 = window.p5

export enum Side {
  Ours,
  Theirs,
}

export class Player {
  x: number
  y: number
  unum: number
  side: Side
  constructor(x: number, y: number, unum: number, side: Side){
    this.x = x;
    this.y = y;
    this.side = side;
    this.unum = unum
  }

  static random(unum: number, side: Side): Player {
    let x = random(fieldWidth*(1-SPREAD), fieldWidth*SPREAD);
    let y = random(fieldHeight*(1-SPREAD), fieldHeight*SPREAD);
    return new Player(x,y, unum, side)
  }
  
  draw(): void {
    noStroke()
    if(this.side == Side.Theirs){
      fill('#F01414')
    }else{
      fill('#FFD700')    
    }
    circle(this.x, this.y, 18)
    textAlign('center')
    fill('black')
    text(this.unum, this.x,this.y+textAscent()/3)
  }
  
  dist(agent: Player): number {
    return dist(this.x,this.y, agent.x,agent.y)
  }

  distFromVec(pos: p5.Vector): number {
    return dist(this.x,this.y, pos.x, pos.y)
  }

  drawPair(targetPlayer: Player, color: p5.Color): void {
    stroke(color)
    const radius = 18/2

    const pos1 = createVector(this.x,this.y)
    const pos2 = createVector(targetPlayer.x,targetPlayer.y)

    const vec12 = p5.Vector.sub(pos1,pos2)
    vec12.rotate(HALF_PI)
    vec12.normalize()

    const perpVec = p5.Vector.mult(vec12,radius)

    // perp1 = p5.Vector.add(pos1,perpVec)
    let perp2 = p5.Vector.add(pos2,perpVec)  

    line(pos1.x, pos1.y, perp2.x, perp2.y)

    // perp1 = p5.Vector.add(pos1,p5.Vector.mult(perpVec,-1))
    perp2 = p5.Vector.add(pos2,p5.Vector.mult(perpVec,-1))

    line(pos1.x, pos1.y, perp2.x, perp2.y)
  }
}
