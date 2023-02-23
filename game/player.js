class Player {
  constructor({
    position = {
      x: (level.playerInitialPosition.x*(tileOriginalSize*tileScale)),
      y: (level.playerInitialPosition.y*(tileOriginalSize*tileScale)) 
    },
    collisionBricks,
    platforms,
    goldNuggets,
    death,
    spriteSheetSrc,
    frameRate,
    scale = 3,
    animations,
  })
  
  {
    this.position = {
      x: position.x,
      y: position.y,
    },
    this.velocity = {
      x: 0,
      y: 3
    }
    this.originalSize = 32
   
    this.width = this.originalSize*scale
    this.height = this.originalSize*scale
    this.jump = false
    this.ground = false
    this.collisionBricks = collisionBricks
    this.platforms = platforms
    this.jumpCount = 0
    this.platformFallDown = false
    this.goldNuggets = goldNuggets
    this.plusOnes = []
    this.death = death
    this.dead = false
    this.isJumping = false
    this.onPlatform = false
    
    // load spriteSheet
    this.loaded = false
    this.spriteSheet = new Image()
    this.spriteSheet.onload = () => { 
      this.loaded = true 
    }
    this.spriteSheet.src = spriteSheetSrc
    
    // size of sprite
    this.sprite = {
      width: this.spriteSheet.width
    }

    // pointers and variables for animation
    this.spritePointer = 0
    this.frameRate = frameRate
    this.scale = scale
    this.countForFrames = 0
    this.frameBuffer = 6

    this.animations = animations
    this.currentAnimation = 'idleRight'
    this.lastDirection = 'idleRight'

    this.hitboxIdle = {
      position : {
        x: this.position.x + 42,
        y: this.position.y + 21,
        },
      width: 12,
      height: this.height -21,
    }

    this.hitboxRunning = {
       position : {
        x: this.position.x + 30,
        y: this.position.y + 21,
        },
      width: 36,
      height: this.height -21,
    }
    
    for (let key in this.animations) {
      const img = new Image()
      // img.onload = () => {console.log(`Image loaded = ${key}`)};
      img.src = this.animations[key].src
      this.animations[key].spriteSheet = img
    }
  }


  drawSprite() {
    // console.log(`countForFrames = ${this.countForFrames}`);
    if (!this.loaded) return
    c.imageSmoothingEnabled = false
    c.drawImage(  
      this.spriteSheet, // spriteSheet image to crop
      0, // x for cropping
      32*this.spritePointer, // y for cropping
      32, // width for cropping
      32, // height for cropping
      this.position.x, // x position on canvas
      this.position.y, // y position on canvas
      32*this.scale,
      32*this.scale
    );
  }

  switchSheet(key) {
    if (this.spriteSheet === this.animations[key].spriteSheet) return
    this.spritePointer = 0
    this.spriteSheet = this.animations[key].spriteSheet
    this.frameBuffer = this.animations[key].frameBuffer
    this.frameRate = this.animations[key].frameRate
  }
  
  updateSpritePointer() {
    this.countForFrames++

    if (this.countForFrames >= this.frameBuffer) {
      this.spritePointer === this.frameRate - 1 ? this.spritePointer = 0 : this.spritePointer++
      this.countForFrames = 0
    }
  }


  draw() {
    c.fillStyle = 'rgba(0, 120, 255,1)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  
  updateHitbox() {
    this.hitboxIdle.position.x = this.position.x + 42,
    this.hitboxIdle.position.y = this.position.y + 21,
    this.hitboxRunning.position.x = this.position.x + 30,
    this.hitboxRunning.position.y = this.position.y + 21
  }
  
  checkForGoldNuggets() {
    for (let i= 0; i < this.goldNuggets.length; i++) {
      const nugget = this.goldNuggets[i]
      
      if ( //collision(this, nugget)
          collisionBottom(this, nugget) ||
          collisionTop(this, nugget) ||
          collisionLeft(this, nugget) ||
          collisionRight(this, nugget)
      ) {
        this.plusOnes.push(nugget)
        // console.log(this.plusOnes);
        const index = this.goldNuggets.indexOf(nugget)
        this.goldNuggets.splice(index,1)
      }
    }
  }
  

checkForCollisions(){
  for (let i = 0; i < this.collisionBricks.length; i++) {
    const brick = this.collisionBricks[i]

    if (collisionTop(this, brick) && player.velocity.y < 0) {
      this.onPlatform = false
      this.ground = false
      this.isJumping = false
      this.velocity.y = 0
      this.position.y = brick.position.y + brick.height - 21 + 0.05
    }

    if (collisionBottom(this, brick) && player.velocity.y > 0) {
      this.velocity.y = 0
      this.isJumping = false
      this.onPlatform = false
      this.ground = true
      this.position.y = (brick.position.y - this.height) + 0.01
    }

    if (collisionLeft(this, brick) && player.velocity.x < 0) {
      this.velocity.x = 0
      this.position.x = (brick.position.x + brick.width + 0.01) -30
    }
    if (collisionRight(this, brick) && player.velocity.x > 0) {
      this.velocity.x = 0
      this.position.x = brick.position.x - (this.hitboxRunning.width + 30)
    }
  }
}



  checkForPlatformCollision() {
    for (let i = 0; i < this.platforms.length; i++) {
     
      const platform = this.platforms[i]
      
      if (platformCollision(this, platform)) {
        this.onPlatform = true
        this.ground = true
        this.velocity.y = 0
        this.position.y = (platform.position.y - this.height) - 0.01
      }
    }
  }

  checkForDeathCollision() {
    for (let i = 0; i < this.death.length; i++) {
      const death = this.death[i]

      if (deathCollision(this, death)) this.dead = true
    }
  }


  update() {
    // this.draw()
    this.switchSheet(this.currentAnimation)
    this.updateSpritePointer()
    this.drawSprite()
    this.updateHitbox()
    this.position.x += this.velocity.x
    this.checkForGoldNuggets()
    this.checkForCollisions()
    // this.checkForHorizontalCollision()
    this.applyGravity()
    this.checkForDeathCollision()
    if (!player.platformFallDown) this.checkForPlatformCollision()
    for (const platform of level.platforms) {
      if (player.position.y > (platform.position.y - player.height/2) -5 &&
      player.position.y < platform.position.y + (player.height/2) + 5) player.platformFallDown = false
    }
    this.checkForCollisions()
    // this.checkForVerticalCollision()

  }


  applyGravity() {
     if (!player.dead) {  
      if (this.velocity.y <= maxFallSpeed) {
          this.velocity.y += gravity;
        }
        // this.velocity.y += gravity
        this.position.y += this.velocity.y;
    }
  }  
}

