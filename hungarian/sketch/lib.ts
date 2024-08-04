import { Player } from "./Player"


export function drawBall(pos: p5.Vector) {
  strokeWeight(1)
  stroke('black')
  fill('white')

  circle(pos.x, pos.y, 10)
}

export function drawArea(pos: p5.Vector, area: number, color: string = 'purple') {
  stroke(color)
  noFill()
  strokeWeight(1)

  circle(pos.x, pos.y, 2*area)
}

export function playersInsideArea(players: Player[], pos: p5.Vector, area: number) {
  return players.filter(player => player.distFromVec(pos) <= area)
}

export function sortPlayersByDistance(players: Player[], pos: p5.Vector) {
  const sortedPlayers = [...players]
  sortedPlayers.sort((a,b) => a.distFromVec(pos) - b.distFromVec(pos))
  return sortedPlayers
}
