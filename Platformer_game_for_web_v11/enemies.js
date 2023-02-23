const snakeWalkRight = new Image();
snakeWalkRight.src = './snakeWalkRight.png';
const snakeWalkLeft = new Image();
snakeWalkLeft.src = './snakeWalkLeft.png';

const batFlying = new Image();
batFlying.src = './batFlying.png';


class Snake {
  constructor({
    gridPosition, 
    pathLengthInTiles,
    direction,
  }
  ) {
    this.gridPosition = {
      x: gridPosition.x,
      y: gridPosition.y,
    }
    this.position = {
      x: gridPosition.x * 48,
      y: gridPosition.y * 48,
    }
    this.initialPosition = {
      x: gridPosition.x * 48,
      y: gridPosition.y * 48,
    }
    this.pathLengthInTiles = pathLengthInTiles
    this.pathLength = pathLengthInTiles * 48
    this.width = 48
    this.height = 48
    this.direction = direction
    this.endRight = this.direction === 'right' ? this.initialPosition.x + (this.pathLength - this.width) : this.initialPosition.x
    this.endLeft = this.direction === 'right' ? this.initialPosition.x : this.initialPosition.x - (this.pathLength - this.width)
    this.velocity = 1
    this.counterWait = 0
    this.waitLength = 50
  
 
    this.scale = 3 // CHECK THIS
    this.spritePointer = 0
    this.frameRate = 4
    this.frameBuffer = 8
    this.counterForAnimation = 0
    this.spriteSheet = this.direction === 'right' ? snakeWalkRight : snakeWalkLeft
    
  }


  drawNormal() {
    c.fillStyle = "rgba(255,255,255,1)"
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  draw() {
    c.imageSmoothingEnabled = false
    c.drawImage(  
      this.spriteSheet, // spriteSheet image to crop
      0, // x for cropping
      16*this.spritePointer, // y for cropping
      16, // width for cropping
      16, // height for cropping
      this.position.x, // x position on canvas
      this.position.y, // y position on canvas
      16*this.scale,
      16*this.scale
      );
    if (this.counterForAnimation >= this.frameBuffer) {
      this.spritePointer++
      if (this.spritePointer >= this.frameRate) this.spritePointer = 0
      this.counterForAnimation = 0
    } else {
      this.counterForAnimation++
    }
    }

  move() {
    if (this.direction === 'right') {
      if (this.position.x < this.endRight) {
        this.position.x += this.velocity
      } else {
        if (this.counterWait < this.waitLength) {
          this.counterWait++
         } else {
          this.counterWait = 0
          this.direction = 'left'
          this.spriteSheet = snakeWalkLeft
          this.spritePointer = 0
         }
        } 
    } else if (this.direction === 'left'){
      if (this.position.x > this.endLeft) {
        this.position.x -= this.velocity
      } else {
        if (this.counterWait < this.waitLength) {
          this.counterWait++
         } else {
          this.counterWait = 0
          this.direction = 'right'
          this.spriteSheet = snakeWalkRight
          this.spritePointer = 0
         }
      }
    }
  }
} 


class Bat {
  constructor({
    gridPosition, 
    pathLengthInTiles,
    direction,
    sense,
  }) {
    this.gridPosition = {
      x: gridPosition.x,
      y: gridPosition.y,
    }
    this.position = {
      x: gridPosition.x * 48,
      y: gridPosition.y * 48,
    }
    this.initialPosition = {
      x: gridPosition.x * 48,
      y: gridPosition.y * 48,
    }
    this.pathLengthInTiles = pathLengthInTiles
    this.pathLength = pathLengthInTiles * 48
    this.width = 48
    this.height = 48
    this.sense = sense
    this.direction = direction
    
    this.endRightDown = 
      this.sense === 'upDown' ? (
        this.direction === 'down' ? 
        this.initialPosition.y + (this.pathLength - this.height) 
        : this.initialPosition.y
      ) : (
        this.direction === 'right' ? 
        this.initialPosition.x + (this.pathLength - this.width) 
        : this.initialPosition.x
      )

      this.endLeftUp = 
        this.sense === 'upDown' ? (
          this.direction === 'down' ? 
          this.initialPosition.y 
          : this.initialPosition.y + (this.pathLength - this.height) 
        ) : (
          this.direction === 'right' ? 
          this.initialPosition.x 
          : this.initialPosition.x - (this.pathLength - this.width) 
        )
    
    this.velocity = 1
    this.counterWait = 0
    this.waitLength = 50
    this.currentSpriteSheet = ''
    
    this.scale = 3 
    this.spritePointer = 0
    this.frameRate = 9
    this.frameBuffer = 12
    this.counterForAnimation = 0
    this.spriteSheet = batFlying
  }

  // drawNormal() {
  //   c.fillStyle = "rgba(24,245,155,1)"
  //   c.fillRect(this.position.x, this.position.y, this.width, this.height)
  // }

  draw() {
    c.imageSmoothingEnabled = false
    c.drawImage(  
      this.spriteSheet, // spriteSheet image to crop
      0, // x for cropping
      16*this.spritePointer, // y for cropping
      16, // width for cropping
      16, // height for cropping
      this.position.x, // x position on canvas
      this.position.y, // y position on canvas
      16*this.scale,
      16*this.scale
      );
    if (this.counterForAnimation >= this.frameBuffer) {
      this.spritePointer++
      this.counterForAnimation = 0
      if (this.spritePointer >= this.frameRate) this.spritePointer = 0
    } else {
      this.counterForAnimation++
    }
    }

  move() {
    if (this.sense === 'leftRight') {
          if (this.direction === 'right') {
          if (this.position.x < this.endRightDown) {
            this.position.x += this.velocity
          } else {
            if (this.counterWait < this.waitLength) {
              this.counterWait++
            } else {
              this.counterWait = 0
              this.direction = 'left'
            }
            } 
        } else if (this.direction === 'left'){
          if (this.position.x > this.endLeftUp) {
            this.position.x -= this.velocity
          } else {
            if (this.counterWait < this.waitLength) {
              this.counterWait++
            } else {
              this.counterWait = 0
              this.direction = 'right'
            }
          }
        }

    } else if (this.sense === 'upDown') {
        if (this.direction === 'up') {
          if (this.position.y < this.endRightDown) {
            this.position.y += this.velocity
          } else {
            if (this.counterWait < this.waitLength) {
              this.counterWait++
            } else {
              this.counterWait = 0
              this.direction = 'down'
            }
            } 
        } else if (this.direction === 'down'){
          if (this.position.y > this.endLeftUp) {
            this.position.y -= this.velocity
          } else {
            if (this.counterWait < this.waitLength) {
              this.counterWait++
            } else {
              this.counterWait = 0
              this.direction = 'up'
            }
          }
        }
    }
  }
}