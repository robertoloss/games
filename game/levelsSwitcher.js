class Level {
  constructor(levelNum, tiles) {
    this.number = levelNum;
    this.level = levels[this.number]
    this.map = levels[this.number].map;
    this.collisionBricks = []
    this.platforms = []
    this.goldNuggets = []
    this.animals = []
    this.death = []
    this.poison = []
    this.playerInitialPosition = levels[this.number].playerInitialPosition
    this.door = {
      top: {
        x: levels[this.number].door.top.x,
        y: levels[this.number].door.top.y
      },
      bottom: {
        x: levels[this.number].door.bottom.x,
        y: levels[this.number].door.bottom.y,
      },
    }
    this.doorOpen = false
    this.newLevel = true
    this.tiles = tiles
    this.snakes = levels[this.number].snakes
    this.bats = levels[this.number].bats
    this.backgroundPosition = {
      x: levels[this.number].backgroundPosition.x,
      y: levels[this.number].backgroundPosition.y,
    } 
  }

  create() {
    for (let i = 0; i < this.map.length; i++) {
    for (let j = 0; j < this.map[i].length; j++) {
      
      if (  this.map[i][j] === 1 ||
            this.map[i][j] > 4 
        ) {
        const brick = {
          gridPosition: {
            x: j,
            y: i,
          },
          position: {
            x: j*(tileOriginalSize*tileScale),
            y: i*(tileOriginalSize*tileScale),
          }, 
          kind: 'wall',
          tilesList : this.tiles
        }
        if (this.map[i][j] === 6) brick.kind = 'leaves'
        if (this.map[i][j] === 7) brick.kind = 'treeTrunk'
        if (this.map[i][j] === 8) brick.kind = 'dirt'
        if (this.map[i][j] === 9) brick.kind = 'grass'

        this.collisionBricks.push(new Brick(brick))
        }

      if (this.map[i][j] === 2) {
        const platform = {
          gridPosition: {
            x: j,
            y: i,
            },
          position: {
            x: j*(tileOriginalSize*tileScale),
            y: i*(tileOriginalSize*tileScale),
            },
            img: this.tiles.branch
          }
        this.platforms.push(new Platform(platform))
        }

      if (this.map[i][j] === 3) {
        const nugget = {
          gridPosition: {
            x: j,
            y: i,
            },
          position: {
            x: j*(tileOriginalSize*tileScale),
            y: i*(tileOriginalSize*tileScale),
            },
          img: this.tiles.goldNugget
          }
        this.goldNuggets.push(new Gold(nugget))
        }
      
      if (this.map[i][j] === 4) {
        const death = {
          gridPosition: {
            x: j,
            y: i,
          },
          position: {
            x: j*(tileOriginalSize*tileScale),
            y: i*(tileOriginalSize*tileScale),
          },
          img: this.tiles.death
        }
        this.death.push(new Death(death))
        }
      
        for (const snake of this.level.snakes) {
          const newSnake = new Snake(
            snake)
          this.death.push(newSnake)
          this.animals.push(newSnake)
        }

        for (const bat of this.level.bats) {
          const newBat = new Bat(bat)
          this.death.push(newBat)
          this.animals.push(newBat)
        }
    
      }
    }
  }

  drawNuggets() {

  }

  draw() {
    this.collisionBricks.forEach(brick => brick.draw())
    this.platforms.forEach(platform => platform.draw())
    this.goldNuggets.forEach(nugget => nugget.draw())
    this.death.forEach(death => death.draw())
    this.poison.forEach(poison => poison.draw())
  }


  openDoor() {
    this.doorOpen = true
    const X = levels[this.number].door.top.x
    const Y = levels[this.number].door.top.y
    
    levels[this.number].map[Y][X] = 0
    levels[this.number].map[Y+1][X] = 0
    
    this.map = levels[this.number].map
    
    this.collisionBricks.length = 0
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        if (  this.map[i][j] === 1 ||
                this.map[i][j] > 4 
            ) {
            const brick = {
              gridPosition: {
                x: j,
                y: i,
              },
              position: {
                x: j*(tileOriginalSize*tileScale),
                y: i*(tileOriginalSize*tileScale),
              }, 
              kind: 'wall',
              tilesList : this.tiles
            }
            if (this.map[i][j] === 6) brick.kind = 'leaves'
            if (this.map[i][j] === 7) brick.kind = 'treeTrunk'
            if (this.map[i][j] === 8) brick.kind = 'dirt'
            if (this.map[i][j] === 9) brick.kind = 'grass'

            this.collisionBricks.push(new Brick(brick))
            }
          }
        }
  }

  openDoorOld() {
    c.fillStyle = 'black'
    c.fillRect(this.door.top.x*(tileOriginalSize*tileScale), this.door.top.y*(tileOriginalSize*tileScale), (tileOriginalSize*tileScale), (tileOriginalSize*tileScale))
    c.fillRect(this.door.bottom.x*(tileOriginalSize*tileScale), this.door.bottom.y*(tileOriginalSize*tileScale), (tileOriginalSize*tileScale), (tileOriginalSize*tileScale))
    level.doorOpen = true
    for (const brick of level.collisionBricks) {
      if (( brick.gridPosition.x === this.door.top.x && 
            brick.gridPosition.y === this.door.top.y ) || 
          (brick.gridPosition.x === this.door.bottom.x && 
            brick.gridPosition.y === this.door.bottom.y )) {
              const index = level.collisionBricks.indexOf(brick)
              level.collisionBricks.splice(index, 1)
            }
    }
  }

  levelUp() {
    this.number = Number(this.number) + 1
    this.level = levels[this.number]
    this.map = levels[this.number].map
    this.collisionBricks.length = 0
    this.platforms.length = 0
    this.goldNuggets.length = 0
    this.animals.length = 0
    this.death.length = 0
    this.door = {
      top: {
        x: levels[this.number].door.top.x,
        y: levels[this.number].door.top.y
      },
      bottom: {
        x: levels[this.number].door.bottom.x,
        y: levels[this.number].door.bottom.y,
      },
    }
    this.doorOpen = false
    this.newLevel = true
    this.playerInitialPosition = this.level.playerInitialPosition
    this.create()
    // this.draw() // there's already a draw command in the main loop
  }

}