function core(startId, endId, excludeIds, colSizes, seatTableElementId = 'seat-table') {
    
    // 生成学号列表
    let studentIds = [];
    for (let i = startId; i <= endId; i++) {
        if (!excludeIds.includes(i)) {
            studentIds.push(i);
        }
    }
    // 随机打乱学号
    studentIds = shuffleArray(studentIds);
    // 生成座位表
    const seatTable = document.getElementById(seatTableElementId);
    seatTable.innerHTML = ''; // 清空之前的座位表
    let index = 0;
    const maxRows = Math.max(...colSizes); // 最大行数
    for (let i = 0; i < maxRows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < colSizes.length; j++) {
            const cell = document.createElement('td');
            if (i < colSizes[j] && index < studentIds.length) {
                cell.textContent = studentIds[index];
                index++;
            } else {
                cell.textContent = ''; // 空座位
            }
            row.appendChild(cell);
        }
        seatTable.appendChild(row);
    }
}

// 随机打乱数组
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
