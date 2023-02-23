const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// canvas properties 384 * 208  => BACKGROUND = 530 * 250
canvas.width = (tileOriginalSize*tileScale)*24
canvas.height = (tileOriginalSize*tileScale)*13

// general variables
const gravity = 0.5
const maxFallSpeed = 9
const maxSpeedPlayer = 3.2
const jumpHeight = 44
const jumpVelocity = 7
let jumpInitialY = 0
let xKeyActive = true

const mapNumber = prompt('Insert level number [0]') || 0

const forestImg = new Image()
forestImg.src = 'forest.png'

const forest = {
  pos: {
    x: 30,
    y: 36
  },
  img: forestImg
}

const keys = {
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
}



const tiles = {
  wall : 'wall',
  grass: './grass.png',
  dirt: './dirt.png',
  treeTrunk: './treeTrunk.png',
  branch: './branch.png',
  leaves: './leaves.png',
  goldNugget: './goldNugget.png',
  death: './poison.png',
  snake: '',
  bat: '',
}


const tilesImg = {}

for (key in tiles) {
  if (key != 'wall') {
    const img = new Image()
    img.src = tiles[key]
    tilesImg[key] = img
  }
}

const level = new Level(mapNumber, tilesImg)
level.create()

const collisionBricks = level.collisionBricks
const platforms = level.platforms
const goldNuggets = level.goldNuggets
const death = level.death

const animals = level.animals





const player = new Player({
  collisionBricks,
  platforms,
  goldNuggets,
  death,
  spriteSheetSrc: './runRight.png',
  frameRate: 6,
  animations: {
    idleRight: {
      src: './idleRight.png',
      frameRate: 14,
      frameBuffer: 12
    },
    idleLeft: {
      src: './idleLeft.png',
      frameRate: 14,
      frameBuffer: 12
    },
    runRight: {
      src: './runRight.png',
      frameRate: 15,
      frameBuffer: 3
    },
    runLeft: {
      src: './runLeft.png',
      frameRate: 15,
      frameBuffer: 3
    },
  
    jumpLeft: {
      src: './jumpLeft.png',
      frameRate: 3,
      frameBuffer: 8
    },
    jumpRight: {
      src: './jumpRight.png',
      frameRate: 3,
      frameBuffer: 8
    },
    death: {
      src: './death.png',
      frameRate: 21,
      frameBuffer: 4
    },
  }
})

















// game loop
function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = "black"
  // c.fillStyle = "rgba(32,31,31,1)";
  // c.fillStyle = "rgba(196,196,190,1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  
  c.drawImage(
    forest.img,
    forest.pos.x ,
    forest.pos.y + 16 ,
    canvas.width, 
    canvas.height,
    0,
    0,
    canvas.width * 3, 
    canvas.height * 3,
  )

  level.draw()
  
  
  
  if (level.goldNuggets.length === 0) {
    level.openDoor() 
  }
  
  if (level.doorOpen) {
  
    if (
        player.position.x >= level.door.top.x*(tileOriginalSize*tileScale) && 
        player.position.y >= level.door.top.y*(tileOriginalSize*tileScale)
        ) {
            level.levelUp()
            player.position.x = (level.playerInitialPosition.x*(tileOriginalSize*tileScale))
            player.position.y = (level.playerInitialPosition.y*(tileOriginalSize*tileScale))   
    }
  }

  for (let i = 0; i < player.plusOnes.length; i++) {
    const nugget = player.plusOnes[i]
    if (nugget.count < 40) {
      nugget.drawOne(nugget.position.x,nugget.position.y)
      if (nugget.count % 2 === 0) nugget.position.y -= 1
      nugget.count += 1
    } else {
      const index = player.plusOnes.indexOf(nugget)
      player.plusOnes.splice(index, 1)
    }
  }



  if (!player.dead) { // IF PLAYER IS ALIVE
    if (player.velocity.y > 0) player.ground = false

    if (!player.ground) {
      if (player.lastDirection === 'idleRight') player.currentAnimation = 'jumpRight'
      else if (player.lastDirection === 'idleLeft') player.currentAnimation = 'jumpLeft'
      else if (player.lastDirection === 'runLeft') player.currentAnimation = 'jumpLeft'
      else if (player.lastDirection === 'runRight') player.currentAnimation = 'jumpRight'
    } else if (!player.platformFallDown)  {
      player.currentAnimation = player.lastDirection
    } 


    if (keys.ArrowRight.pressed &&
        player.velocity.x <= maxSpeedPlayer &&
        !keys.ArrowLeft.pressed) {
        player.velocity.x += 0.5
        player.lastDirection = 'runRight'
        player.ground ? player.currentAnimation = 'runRight' : player.currentAnimation = 'jumpRight'
    } 
    else if (keys.ArrowLeft.pressed &&
        player.velocity.x >= -maxSpeedPlayer &&
        !keys.ArrowRight.pressed) {
        player.velocity.x -= 0.5
        player.lastDirection = 'runLeft'
        player.ground ? player.currentAnimation = 'runLeft' : player.currentAnimation = 'jumpLeft'
    }

    else if (
              !keys.ArrowRight.pressed &&
              !keys.ArrowLeft.pressed
          ) {
          if (player.ground) {
            player.velocity.x = 0
            if (player.lastDirection === 'idleLeft' ||
                player.lastDirection === 'jumpLeft' ||
                player.lastDirection === 'runLeft' )  
                {
                  player.currentAnimation = 'idleLeft'
                  player.lastDirection = 'idleLeft'
                }
            else 
                {
                  player.currentAnimation = 'idleRight'
                  player.lastDirection = 'idleRight'
                } 
          } else {
            if (player.velocity.x > 0) player.velocity.x -= 0.1
            if (player.velocity.x < 0) player.velocity.x += 0.1
          }
        }
    
    if (player.isJumping) {
      if (jumpInitialY - player.position.y  <= jumpHeight) {
        player.velocity.y = -jumpVelocity
      } else {
        xKeyActive = false
        player.isJumping = false
      } 
    }
    // console.log(`diff = ${jumpInitialY - player.position.y }`)
    
    if (player.ground) {
      player.jumpCount = 0
      player.isJumping = false
    }
  } 

  // HITBOX 
  // c.fillStyle = "rgba(246,255,122,0.3)"
  // c.fillRect( 
  //               player.position.x,
  //               player.position.y   ,
  //               player.originalSize*player.scale, 
  //               player.originalSize*player.scale
  //           )
  // c.fillStyle = "rgba(246,23,122,0.5)"
  // c.fillRect( 
  //               player.position.x + 30 ,
  //               player.position.y + 21  ,
  //               36, 
  //               player.originalSize*player.scale -21
  //           )

  // console.log(`\nx : ${player.position.x}`)
  // console.log(`y : ${player.position.y}`)
  
  
  
  animals.forEach((animal) => { 
    animal.move()
    animal.draw()
  })

  const oldPlayerPosition = {
    x: player.position.x,
    y: player.position.y,
  }

  player.update()

  const diffPlayerPosition = {
    x: player.position.x - oldPlayerPosition.x,
    y: player.position.y - oldPlayerPosition.y,  
  }

  forest.pos.x += diffPlayerPosition.x / 100
  forest.pos.y += diffPlayerPosition.y / 100



  if (player.dead) {
    player.velocity.x = 0
    player.velocity.y = 0
    player.currentAnimation = 'death'
  }

  if (player.dead && player.spritePointer >= 20) {
    player.position.x = (level.playerInitialPosition.x*(tileOriginalSize*tileScale))
    player.position.y = (level.playerInitialPosition.y*(tileOriginalSize*tileScale))
    player.dead = false
    forest.pos.x = level.backgroundPosition.x
    forest.pos.y = level.backgroundPosition.y
  }

}

animate()



















// Event listeners

window.addEventListener('keydown', (event) => {
  //console.log(event);
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      break
    case 'ArrowDown':
      if (player.onPlatform === true) {
        player.platformFallDown = true
        player.ground = false
        break}
      else break
    case 'x':
      if (player.jumpCount < 2 && xKeyActive) {
        player.isJumping = true
        jumpInitialY = player.position.y
        player.ground = false
        player.jumpCount += 1
        break
      }
  }
})

window.addEventListener('keyup', (event) => {
  //console.log(event);
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
    case 'x': // delete this in case
      player.isJumping = false
      xKeyActive= true
      break
  }
})