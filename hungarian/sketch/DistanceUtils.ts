import { Player, Side } from './Player'

const MAX_DIST = 100

type DistanceMatrix = number[][]

export class DistanceUtils{
  teammates: Player[]
  opponents: Player[]

  memo: {
    distanceMatrix: DistanceMatrix,
    sides: [Side,Side]
  }[] = []

  constructor(teammates: Player[], opponents: Player[]){
    this.teammates = teammates
    this.opponents = opponents
  }
    
  // side: 1 => players, 0 => opponents
  constructDistanceMatrix(sideA: Side, sideB: Side): DistanceMatrix {
    let found = this.memo.find(({distanceMatrix, sides}) => sides[0] == sideA && sides[1] == sideB)
    if (found) return found.distanceMatrix

    const playersA = sideA == Side.Ours ? this.teammates : this.opponents
    const playersB = sideB == Side.Ours ? this.teammates : this.opponents
    
    let distanceMatrix: DistanceMatrix = Array(10).fill(MAX_DIST).map(()=>Array(10).fill(MAX_DIST))
    
    for(let playerA of playersA){
      for(let playerB of playersB){
        // 11 players, golie has unum 1 and is not used in this matrix. Therefore, we are mapping 2..11 to 0..9
        distanceMatrix[playerA.unum-2][playerB.unum-2] = playerA.dist(playerB)
      }
    }

    this.memo.push({
      distanceMatrix,
      sides: [sideA, sideB]
    })
    
    return distanceMatrix
  }

  constructDistanceMatrixFromPlayers(sideAPlayers: Player[], sideBPlayers: Player[]): DistanceMatrix {
    if(sideAPlayers.length == 0 || sideBPlayers.length == 0) return []

    const sideA = sideAPlayers[0].side
    const sideB = sideBPlayers[0].side
    const distanceMatrix = this.constructDistanceMatrix(sideA, sideB)

    const newDistanceMatrix:DistanceMatrix = []

    for(let sideAPlayer of sideAPlayers){
      const indexA = sideAPlayer.unum-2
      const row: number[] = []

      for(let sideBPlayer of sideBPlayers){
        const indexB = sideBPlayer.unum-2

        row.push(distanceMatrix[indexA][indexB])
      }
      newDistanceMatrix.push(row)
    }

    return newDistanceMatrix
  }
}
