// hitbox: x + 10, width = 25

const offsetHorizontalLeft = 45
const offsetHorizontalRight = 46

const offsetHLeft_Run = 32
const offsetHRight_Run = 32



const collisionBottom= function(player, block) {
  return (
          (player.hitboxIdle.position.x  + player.hitboxIdle.width) - 5 > block.position.x  &&
          player.hitboxIdle.position.x +  5 < (block.position.x + block.width) &&
          (player.hitboxIdle.position.y + player.hitboxIdle.height) > block.position.y &&
          (player.hitboxIdle.position.y + player.hitboxIdle.height) < block.position.y +block.height
          )
}

const collisionTop= function(player, block) {
  return (
          player.hitboxIdle.position.x  + player.hitboxIdle.width > block.position.x  &&
          player.hitboxIdle.position.x  < (block.position.x + block.width) &&
          player.hitboxIdle.position.y < (block.position.y + block.height) &&
          player.hitboxIdle.position.y > block.position.y 
          )
}

const collisionLeft= function(player, block) {
  return (
          player.hitboxRunning.position.x  < block.position.x + block.width &&
          player.hitboxRunning.position.x  > block.position.x  &&
          (player.hitboxRunning.position.y + player.hitboxRunning.height) - 10 > block.position.y &&
          player.hitboxRunning.position.y + 10 < (block.position.y + block.height) 
          )
}

const collisionRight= function(player, block) {
  return (
          (player.hitboxRunning.position.x + player.hitboxRunning.width)  > block.position.x    &&
          (player.hitboxRunning.position.x + player.hitboxRunning.width)  < (block.position.x  + block.width) &&
          (player.hitboxRunning.position.y + player.hitboxRunning.height) - 10> block.position.y &&
          player.hitboxRunning.position.y + 10 < (block.position.y + block.height) 
          )
}





const platformCollision= function({position, velocity, height, width}, platform) {
  return (
        position.y + height >= platform.position.y && 
        position.y + height  <= platform.position.y + velocity.y && 
        position.x + 42 <= platform.position.x + platform.width && 
        position.x + (width - 43)  >= platform.position.x
        )
}


const deathCollision= function({position, height, width}, object2) {
  return (
        position.y + (height - 30) >= object2.position.y && 
        position.y + 14 <= object2.position.y + object2.height && 
        position.x + 42  <= object2.position.x + object2.width && 
        position.x + (width - 43) >= object2.position.x    
  )
}