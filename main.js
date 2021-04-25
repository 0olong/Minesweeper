const log = console.log.bind(console)

const e = selector => document.querySelector(selector)

const es = selector => document.querySelectorAll(selector)

const putMapInHTML = (map) => {
    let square = map.square
    let g = e('.gameCanvas');
    for (let i = 0; i <= square.length; i++) {
        g.innerHTML += `<ul class="row i-${i}" data-i="${i}"></ul>`
    }

    let row = es('.row');
    for (let i = 0; i < row.length - 1; i++) {
        for (let j = 0; j < square[0].length; j++) {
            let m = square[i][j]
            if (m === 0) {
                m = ''
            }
            row[i].innerHTML += `
                <li class="col j-${j} num-${m}" data-j="${j}">
                    <span>${m}</span>
                </li>`
        }
    }
}

const checkRevealedSafeBlock = (map) => {
    let sbs = es('.reveal')
    // log('checkRevealedSafeBlock', numberOfSafeBlock, sbs.length)
    if (sbs.length - 1 === map.numberOfSafeBlock) {
        log('游戏胜利')
        let a = e('.alert')
        a.innerHTML = 'YOU WIN'
        a.classList.remove('hide')
    }
}

const revealBlocks = (map, span) => {
    // 保证第一次点击到空白
    if (isFirstClick && span.innerText !== '') {
        restartGame(map)
        let [i, j] = getIJofBlock(span)
        let li = e(`.row.i-${i}`).children[j]
        let element = li.children[0]
        revealBlocks(map, element)
        isFirstClick = false
    } else if (span.innerText === '9') {
        let a = e('.alert')
        a.classList.remove('hide')
        revealAllBomb()
    } else if (span.innerText === '') {
        revealBlockAroundBlank(span)
    } else if (span.style.display === '') {
        revealBlock(span)
    }

    checkRevealedSafeBlock(map)
    isFirstClick = false
}

const bindEventsToBlocks = (map) => {
    let rows = es('.row')
    for (const row of rows) {
        row.addEventListener('click', (event) => {
            let target = event.target
            // log('target', target)
            let span = target.children[0]

            revealBlocks(map, span)
        })

        row.addEventListener('contextmenu', (event) => {
            event.preventDefault()
            let self = event.target
            self.classList.toggle('flag')
        })
    }
}

const revealAllBomb = () => {
    let bombs = es('.num-9')
    for (const bomb of bombs) {
        let span = bomb.children[0]
        span.parentElement.classList.add('mine')
        // span.style.display = 'inline-block'
        // span.style.background = '#e4c1a1'
        // span.parentElement.style.border = '1px solid #e4c1a1'
    }
}

const revealBlock = (element) => {
    // element.style.display = 'inline-block'
    // element.style.background = '#e4c1a1'
    element.classList.add('reveal')
    element.parentElement.style.border = '1px solid #e4c1a1'
}

const getIJofBlock = (element) => {
    let i = parseInt(element.closest('.row').dataset['i'])
    let j = parseInt(element.closest('.col').dataset['j'])
    return [i, j]
}

const revealBlockAroundBlank = (element) => {
    let [i, j] = getIJofBlock(element)

    revealBlockByIJ(i, j)
    revealBlockByIJ(i + 1, j)
    revealBlockByIJ(i - 1, j)
    revealBlockByIJ(i, j - 1)
    revealBlockByIJ(i, j + 1)
    revealBlockByIJ(i + 1, j - 1)
    revealBlockByIJ(i + 1, j + 1)
    revealBlockByIJ(i - 1, j - 1)
    revealBlockByIJ(i - 1, j + 1)
}

const revealBlockByIJ = (i, j) => {
    let rNodes = es(`.row`)
    let cNodes = es(`.col`)
    let col = rNodes.length - 1
    let row = cNodes.length / col

    if (i >= 0 && i < row && j >= 0 && j < col) {
        let li = e(`.row.i-${i}`).children[j]
        let span = li.children[0]
        // if (span.innerText === '' && span.style.display === '' && span.style.background === '') {
        if (span.innerText === '' && !span.classList.contains('reveal')) {
            revealBlock(span)
            revealBlockAroundBlank(span)
        } else {
            revealBlock(span)
        }
    }
}

const clearCanvas = () => {
    let c = e('.gameCanvas')
    c.innerHTML = ''
    let a = e('.alert')
    a.classList.add('hide')
}

const restartGame = (map) => {
    clearCanvas()
    initGame(map.row, map.col, map.numberOfMines)
}

const bindEvents = (map) => {
    bindEventsToBlocks(map)
}

const initGame = (row, col, numberOfMines) => {
    let map = new GameMap(row, col, numberOfMines)
    putMapInHTML(map)
    bindEvents(map)
}

const __main = () => {
    let mapData = [9, 9, 10]
    initGame(...mapData)
}

let isFirstClick = true

__main()