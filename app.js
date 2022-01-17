let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

let width = canvas.width
let height = canvas.height

let blockSize = 10
let widthInBlocks = width / blockSize
let heightInBlocks = height / blockSize

let score = 0
let timeSet = 100
let flag = true




let circle = function (x, y, radius, fillOrFill) {
	ctx.beginPath()
	ctx.arc(x, y, radius, 0, Math.PI * 2, false)
	if (fillOrFill) {
		ctx.fill()
	} else {
		ctx.stroke()
	}
}

let drawBorder = function () {
	ctx.fillStyle = 'grey'
	ctx.fillRect(0, 0, width, blockSize)
	ctx.fillRect(0, 0, blockSize, height)
	ctx.fillRect(width - blockSize, 0, blockSize, height)
	ctx.fillRect(0, height - blockSize, width, blockSize)
	ctx.lineWidth = 5
	ctx.strokeStyle = 'blue'
	ctx.strokeRect(0, 0, width, height)
}


let drawScore = function () {
	ctx.font = '20px Arial'
	ctx.textBaseline = 'top'
	ctx.textAlign = 'left'
	ctx.fillStyle = 'blue'
	ctx.fillText('Счет: ' + score, blockSize, blockSize)
}


let gameOver = function () {
	ctx.font = '40px Arial'
	ctx.textBaseline = 'middle'
	ctx.textAlign = 'center'
	ctx.fillStyle = 'blue'
	ctx.fillText('Игра окончена!!!', width / 2, height / 2)
}


let Block = function (col, row) {
	this.col = col
	this.row = row
}
Block.prototype.drawSquare = function (color) {
	let x = this.col * blockSize
	let y = this.row * blockSize
	ctx.fillStyle = color
	ctx.fillRect(x, y, blockSize, blockSize)
}
Block.prototype.drawCircle = function (color) {
	let x = this.col * blockSize + blockSize / 2
	let y = this.row * blockSize + blockSize / 2
	ctx.fillStyle = color
	circle(x, y, blockSize / 2, true)
}
Block.prototype.enuble = function (obj) {
	return this.col === obj.col && this.row === obj.row
}


let Snake = function () {
	this.segments = [
		new Block(10, 10),
		new Block(9, 10),
		new Block(8, 10),
		new Block(7, 10)
	]
	this.direction = 'right'
	this.nextDirection = 'right'
}
Snake.prototype.drawSnake = function () {
	for (let j = 0; j < this.segments.length; j++) {
		if (j % 2 === 0) {
			this.segments[j].drawSquare('green')
		} else if (j % 2 !== 0) {
			this.segments[j].drawSquare('yellow')
		}
		this.segments[0].drawSquare('blue')
	}
}
Snake.prototype.collision = function (head) {
	let rightWallCollision
	let downWallCollision
	let leftWallCollision
	let upWallCollision
	if (head.col === widthInBlocks - 1) {
		rightWallCollision = true
	} else if (head.row === heightInBlocks - 1) {
		downWallCollision = true
	} else if (head.col === 0) {
		leftWallCollision = true
	} else if (head.row === 0) {
		upWallCollision = true
	}
	let collisionBody = false

	for (let i = 0; i < this.segments.length; i++) {
		if (head.enuble(this.segments[i])) {
			collisionBody = true
		}
	}
	return rightWallCollision || downWallCollision || leftWallCollision || upWallCollision || collisionBody
}
Snake.prototype.setDirection = function (newDir) {
	if (this.direction === 'right' && newDir === 'left') {
		return
	} else if (this.direction === 'down' && newDir === 'up') {
		return
	} else if (this.direction === 'left' && newDir === 'right') {
		return
	} else if (this.direction === 'up' && newDir === 'down') {
		return
	} else {
		this.nextDirection = newDir
	}
}
Snake.prototype.move = function () {
	let head = this.segments[0]
	let newHead

	this.direction = this.nextDirection


	if (this.nextDirection === 'right') {
		newHead = new Block(head.col + 1, head.row)
	} else if (this.nextDirection === 'down') {
		newHead = new Block(head.col, head.row + 1)
	} else if (this.nextDirection === 'left') {
		newHead = new Block(head.col - 1, head.row)
	} else if (this.nextDirection === 'up') {
		newHead = new Block(head.col, head.row - 1)
	}

	if (this.collision(newHead)) {
		gameOver()
		flag = false
		return
	}

	this.segments.unshift(newHead)

	if (newHead.enuble(apple.direction)) {
		score++
		timeSet = timeSet - 1
		apple.move()
		for(let t = 0; t < this.segments.length; t++){
			while(apple.direction.enuble(this.segments[t])){
				console.log('попал на змею')
				apple.move()
			}
		}
	} else {
		this.segments.pop()
	}
}


let Apple = function (x, y) {
	this.direction = new Block(x, y)
}
Apple.prototype.drawApple = function (color) {
	this.direction.drawCircle(color)
}
Apple.prototype.move = function () {
	let newX = Math.floor(Math.random() * (widthInBlocks - 2) + 1)
	let newY = Math.floor(Math.random() * (heightInBlocks - 2) + 1)
	this.direction = new Block(newX, newY)
}
let apple = new Apple(5, 5)
let snake = new Snake()

let dir = {
	38: 'up',
	39: 'right',
	40: 'down',
	37: 'left'
}

$("body").keydown(function (event) {
	snake.setDirection(dir[event.keyCode])
})


animate()
function animate() {
	ctx.clearRect(0, 0, width, height)
	drawScore()
	snake.drawSnake()
	snake.move()
	apple.drawApple('red')
	drawBorder()
	if(flag){
		setTimeout(animate, timeSet)
	}
}


