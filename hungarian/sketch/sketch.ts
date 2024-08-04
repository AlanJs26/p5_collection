import { Player, Side } from './Player'
import { DistanceUtils } from './DistanceUtils'
import { minWeightAssign, maxWeightAssign } from 'munkres-algorithm';
import * as lib from './lib'

let teammates: Player[] = []
let opponents: Player[] = []
let distanceUtils: DistanceUtils

let ball: p5.Vector
const AREA =  150
const INNER_AREA =  50

export const fieldWidth = 1000
export const fieldHeight = 600
export const SPREAD = 0.9

window.setup = () => {
  console.log("🚀 - Setup initialized - P5 is running");

  createCanvas(fieldWidth, fieldHeight)

  ball = createVector(0,0)

  for (let unum = 2; unum <= 11; unum++) {
    teammates.push(Player.random(unum, Side.Ours))
  }
  for (let unum = 2; unum <= 11; unum++) {
    opponents.push(Player.random(unum, Side.Theirs))
  }

  distanceUtils = new DistanceUtils(teammates, opponents)
}

window.draw = () => {
  background('#1FA01F');

  ball.x = mouseX
  ball.y = mouseY

  lib.drawBall(ball)

  lib.drawArea(ball, AREA)
  lib.drawArea(ball, INNER_AREA, 'red')

  for(let player of ([...teammates, ...opponents])){
    player.draw()
  }

  // const teammatesInArea = lib.playersInsideArea(teammates, ball, AREA)
  const opponentsInArea = lib.playersInsideArea(opponents, ball, AREA).filter(player => player.distFromVec(ball) > INNER_AREA)
  const sortedTeammatesFromBall = lib.sortPlayersByDistance(teammates, ball).slice(0, opponentsInArea.length)

  const distance_matrix = distanceUtils.constructDistanceMatrixFromPlayers(sortedTeammatesFromBall, opponentsInArea)

  const assignments = minWeightAssign(distance_matrix).assignments

  // console.log(assignments);

  for(let index = 0; index < distance_matrix.length; index++) {
    const assignedIndex = assignments[index]

    if (!sortedTeammatesFromBall[index] || !opponentsInArea[assignedIndex]) continue;

    sortedTeammatesFromBall[index].drawPair(opponentsInArea[assignedIndex], color('blue'))
  }

}


