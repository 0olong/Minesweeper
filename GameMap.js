class GameMap {
    constructor(row, col, numberOfMines) {
        this.row = row
        this.col = col
        this.numberOfMines = numberOfMines
        this.numberOfSafeBlock = this.row * this.col - numberOfMines
        this.square = this.generateNewSquare()
    }
    generateNewSquare() {
        return this.markedSquare(this.shuffleSquare(this.generateSquare(this.row, this.col, this.numberOfMines)))
    }
    generateSquare(row, col, numberOfMines) {
        let square = new Array(row)
        for (let i = 0; i < square.length; i++) {
            square[i] = new Array(col).fill(0)
        }
        this.generateMinesInSquare(square, row, col, numberOfMines)
        return square
    }
    generateMinesInSquare(square, row, col, numberOfMines) {
        for (let i = 0; i < numberOfMines; i++) {
            let r = this.getRandomInt(row)
            let c = this.getRandomInt(col)
            if (square[r][c] !== 9) {
                square[r][c] = 9
            } else {
                this.generateMinesInSquare()
            }
        }
    }
    shuffleSquare(square) {
        let result = []
        for (let i = 0; i < square.length; i++) {
            let line = this.shuffleArray(square[i])
            result.push(line)
        }
        return result
    }
    shuffleArray(arr) {
        let result = []
        let random
        while (arr.length > 0) {
            random = Math.floor(Math.random() * arr.length)
            result.push(arr[random])
            arr.splice(random, 1)
        }
        return result
    }
    markAround(square, i, j) {
        if (square[i][j] === 9) {
            this.plus1(square, i + 1, j)
            this.plus1(square, i - 1, j)
            this.plus1(square, i, j - 1)
            this.plus1(square, i, j + 1)
            this.plus1(square, i + 1, j - 1)
            this.plus1(square, i + 1, j + 1)
            this.plus1(square, i - 1, j - 1)
            this.plus1(square, i - 1, j + 1)
        }
    }
    markedSquare(array) {
        let square = this.clonedSquare(array)
        for (let i = 0; i < square.length; i++) {
            for (let j = 0; j < square.length; j++) {
                this.markAround(square, i, j)
            }
        }
        // log('markedSquare', square)
        return square
    }
    clonedSquare(array) {
        let l = []
        for (const a of array) {
            l.push(a.slice(0))
        }
        return l
    }
    plus1(square, i, j) {
        if (i >= 0 && i < square.length && j >= 0 && j < square[0].length) {
            square[i][j] = square[i][j] === 9 ? 9 : square[i][j] + 1
        }
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max))
    }
}