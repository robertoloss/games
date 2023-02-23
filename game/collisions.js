class Brick {
  constructor({ gridPosition, position, kind, tilesList }){
    this.gridPosition = {
      x: gridPosition.x,
      y: gridPosition.y
    }
    this.position = {
      x: position.x,
      y: position.y,
    }
    this.width = (tileOriginalSize*tileScale)
    this.height = (tileOriginalSize*tileScale)
    this.kind = kind
    this.tilesList = tilesList
  }

  draw() {
    if (this.kind != 'wall') {;;
      c.drawImage(this.tilesList[this.kind] ,this.position.x, this.position.y, this.width, this.height)
    } else {
      c.fillStyle = 'rgba(255, 0 , 0, 1)'
      c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
  }
}





class Platform {
  constructor({ gridPosition, position, img }){
    this.gridPosition = {
      x: gridPosition.x,
      y: gridPosition.y
    }
    this.position = {
      x: position.x,
      y: position.y,
    }
    this.width = (tileOriginalSize*tileScale)
    this.height = (tileOriginalSize*tileScale)
    this.img = img
  }

  draw() {
    c.drawImage(this.img, this.position.x, this.position.y, this.width, this.height)
    // c.fillStyle = 'rgba(181, 117, 33, 1)'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}


const plusOne = new Image()
plusOne.src = './plusOne.png'



class Gold {
  constructor({ gridPosition, position, img }){
    this.gridPosition = {
      x: gridPosition.x,
      y: gridPosition.y
    }
    this.position = {
      x: position.x,
      y: position.y,
    }
    this.width = (tileOriginalSize*tileScale)
    this.height = (tileOriginalSize*tileScale)
    this.count = 0
    this.img = img

    this.frameRate = 4
    this.frameBuffer = 6
    this.spritePointer = 0
    this.frameCounter = 0
    this.frameElapsed = 0


    this.oneScale = 2 
    this.oneSpritePointer = 0
    this.oneFrameRate = 4
    this.oneFrameBuffer = 2
    this.oneCounterForAnimation = 0
    this.oneSpriteSheet = plusOne
 
    this.onePosition = {
      x: 0,
      y: 0
    }
  }

  draw() {
    this.frameCounter++
    if (this.frameCounter >= this.frameBuffer) {
      this.spritePointer++
      this.frameCounter = 0
    } 
    if (this.spritePointer >= this.frameRate) this.spritePointer = 0
    c.drawImage(this.img,
                0, 16*this.spritePointer, 16, 16,
                this.position.x, this.position.y, this.width, this.height)
    // c.fillStyle = 'rgba(237,237,50,1)'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  drawOneNormal(x,y) {
    c.fillStyle = "rgba(237,237,50,1)";
    c.font = "bold 36px sans-serif";
    c.fillText("+1", x, y);
  }

 drawOne(x,y) {
    c.imageSmoothingEnabled = false
    c.drawImage(  
      this.oneSpriteSheet, // spriteSheet image to crop
      0, // x for cropping
      16*this.oneSpritePointer, // y for cropping
      16, // width for cropping
      16, // height for cropping
      x, // x position on canvas
      y, // y position on canvas
      16*this.oneScale,
      16*this.oneScale
      );
    if (this.oneCounterForAnimation >= this.oneFrameBuffer) {
      this.oneSpritePointer++
      if (this.oneSpritePointer >= this.oneFrameRate) this.oneSpritePointer = 0
      this.oneCounterForAnimation = 0
    } else {
      this.oneCounterForAnimation++
    }
    }


}



class Death {
  constructor({ gridPosition, position, img }){
    this.gridPosition = {
      x: gridPosition.x,
      y: gridPosition.y
    }
    this.position = {
      x: position.x,
      y: position.y,
    }
    this.width = (tileOriginalSize*tileScale)
    this.height = (tileOriginalSize*tileScale)
    this.img = img

    this.frameRate = 11
    this.frameBuffer = 7
    this.spritePointer = 0
    this.frameCounter = 0
    this.frameElapsed = 0

  }
  draw() {
    this.frameCounter++
    if (this.frameCounter >= this.frameBuffer) {
      this.spritePointer++
      this.frameCounter = 0
      } 
    if (this.spritePointer >= this.frameRate) this.spritePointer = 0
    c.drawImage(this.img,
                0, 16*this.spritePointer, 16, 16,
                this.position.x, this.position.y, this.width, this.height)
  }
}


