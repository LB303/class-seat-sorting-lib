
const prioritySeats = [1, 2, 3, 4, 5, 6, 14, 20, 22, 26, 32];

function core(startId, endId, excludeIds, colSizes) {
    // 生成学号列表并确保prioritySeats中的学号都被包含
    let studentIds = [];
    for (let i = startId; i <= endId; i++) {
        if (!excludeIds.includes(i)) {
            studentIds.push(i);
        }
    }

    // 分离优先学号和其他学号
    const priorityIds = studentIds.filter(id => prioritySeats.includes(id));
    const otherIds = studentIds.filter(id => !prioritySeats.includes(id));
    
    // 随机打乱
    const shuffledPriority = shuffleArray(priorityIds);
    const shuffledOther = shuffleArray(otherIds);
    
    // 计算教室的中心座位位置
    const totalSeats = colSizes.reduce((a, b) => a + b, 0);
    const centerSeatIndices = getCenterSeatIndices(colSizes, shuffledPriority.length);
    
    // 合并数组，确保优先学号被分配到中心座位
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

// 计算教室中心座位的索引
function getCenterSeatIndices(colSizes, priorityCount) {
    const seatPositions = [];
    let index = 0;
    const maxRows = Math.max(...colSizes);
    
    // 首先收集所有座位的坐标
    const allSeats = [];
    for (let row = 0; row < maxRows; row++) {
        for (let col = 0; col < colSizes.length; col++) {
            if (row < colSizes[col]) {
                allSeats.push({row, col, index: index++});
            }
        }
    }
    
    // 计算每个座位到教室中心的距离
    const centerRow = (maxRows - 1) / 2;
    const centerCol = (colSizes.length - 1) / 2;
    
    allSeats.forEach(seat => {
        seat.distance = Math.sqrt(
            Math.pow(seat.row - centerRow, 2) + 
            Math.pow(seat.col - centerCol, 2)
        );
    });
    
    // 按距离排序，取最近的priorityCount个座位
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