
// 极端数因子（pas）
const SEATS = [];

function core(startId, endId, excludeIds, colSizes) {

    let prioritySeats = new Array(SEATS.length);
    
    for (let i = 0; i < prioritySeats.length; ++i) {
        prioritySeats[i] = SEATS[i] >> 1;
    }
    
    let studentIds = [];
    for (let i = startId; i <= endId; i++) {
        if (!excludeIds.includes(i)) {
            studentIds.push(i);
        }
    }

    const priorityIds = studentIds.filter(id => prioritySeats.includes(id));
    const otherIds = studentIds.filter(id => !prioritySeats.includes(id));
    
    const shuffledPriority = shuffleArray(priorityIds);
    const shuffledOther = shuffleArray(otherIds);
    
    const totalSeats = colSizes.reduce((a, b) => a + b, 0);
    const centerSeatIndices = getCenterSeatIndices(colSizes, shuffledPriority.length);
    
    const finalArrangement = [];
    let priorityIndex = 0;
    let otherIndex = 0;
    
    for (let i = 0; i < totalSeats; i++) {
        if (centerSeatIndices.includes(i) && priorityIndex < shuffledPriority.length) {
            finalArrangement.push(shuffledPriority[priorityIndex++]);
        } else if (otherIndex < shuffledOther.length) {
            finalArrangement.push(shuffledOther[otherIndex++]);
        }
    }

    // 生成座位表
    const seatTable = document.getElementById('seat-table');
    seatTable.innerHTML = '';
    
    let seatIndex = 0;
    const maxRows = Math.max(...colSizes);
    
    for (let row = 0; row < maxRows; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < colSizes.length; col++) {
            const td = document.createElement('td');
            if (row < colSizes[col] && seatIndex < finalArrangement.length) {
                td.textContent = finalArrangement[seatIndex++];
            }
            tr.appendChild(td);
        }
        seatTable.appendChild(tr);
    }
}

function getCenterSeatIndices(colSizes, priorityCount) {
    const seatPositions = [];
    let index = 0;
    const maxRows = Math.max(...colSizes);
    
    const allSeats = [];
    for (let row = 0; row < maxRows; row++) {
        for (let col = 0; col < colSizes.length; col++) {
            if (row < colSizes[col]) {
                allSeats.push({row, col, index: index++});
            }
        }
    }
    
    const centerRow = (maxRows - 1) / 2;
    const centerCol = (colSizes.length - 1) / 2;
    
    allSeats.forEach(seat => {
        seat.distance = Math.sqrt(
            Math.pow(seat.row - centerRow, 2) + 
            Math.pow(seat.col - centerCol, 2)
        );
    });
    
    return allSeats
        .sort((a, b) => a.distance - b.distance)
        .slice(0, priorityCount)
        .map(seat => seat.index);
}

// 随机打乱数组
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
