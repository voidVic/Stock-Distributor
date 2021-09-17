'use strict';

const DISPLAY_DOM = {
    DISTRIBUTION: document.getElementById('reviewDistribution'),
    STOCKS: document.getElementById('reviewStocks'),
    USERS: document.getElementById('reviewUsers')
};

let stockUnitMap = [];
let clientWeightMap = [];

function addHandlers() {
    document.getElementById('distributeBtn').onclick = distribute;
    document.getElementById('addStock').onclick = addStock;
    document.getElementById('addUser').onclick = addUser;
}

function addStock() {
    stockUnitMap.push({
        name: getValue('stockNameInp'),
        unit: parseInt(getValue('stockUnitInp'))
    });
    setValue('stockNameInp', '');
    setValue('stockUnitInp', 0);
    DISPLAY_DOM.STOCKS.innerHTML = JSON.stringify(stockUnitMap);
}

function addUser() {
    clientWeightMap.push({
        name: getValue('UserNameInp'),
        weight: parseInt(getValue('UserWeightInp'))
    });
    setValue('UserNameInp', '');
    setValue('UserWeightInp', 1);
    DISPLAY_DOM.USERS.innerHTML = JSON.stringify(clientWeightMap);
}

function getValue(id) {
    return document.getElementById(id).value;
}

function setValue(id, value) {
    return document.getElementById(id).value = value;
}

function distributionTableView(dist) {
    let output = '';
    output = `<div> `
    for(let i in dist) {
        const stock = dist[i];
        const head = stock.distribution.map(i => `<td>${i.clientName}</td>`);
        const body = stock.distribution.map(i => `<td>${i.shares}</td>`);
        output += `<div class="heading">Stock: ${stock.stockName} | Units: ${stock.total}</div> `
        output += `
            <table>
                <tr>${head}</tr>
                <tr>${body}</tr>
            </table>
        `
        output += ` </div>
        `;
    }
    return output;
}

// let stockUnitMap = [
//     {
//         name: 'A',
//         unit: 200
//     },
//     {
//         name: 'B',
//         unit: 500
//     },
//     {
//         name: 'C',
//         unit: 380
//     }
// ];

// let clientWeightMap = [
//     {
//         name: 'Ankit',
//         weight: 10
//     },
//     {
//         name: 'Charu',
//         weight: 5
//     },
//     {
//         name: 'Neha',
//         weight: 8
//     },
//     {
//         name: 'Bhagwati',
//         weight: 12
//     }
// ];

const distributionArr = [];

const stockClientMap = {
    clientName: '',
    unitsAllocated: 0
};

let stockClientDistribution = [];

function distribute() {
    stockClientDistribution = [];
    DISPLAY_DOM.DISTRIBUTION.innerHTML = '';
    clientWeightMap = clientWeightMap.sort((a,b) => a.weight < b.weight ? 1 : -1);
    for(const i in stockUnitMap) {
        const stockObj = stockUnitMap[i];
        distributeForAllClients(stockObj);
    }
    console.log({stockClientDistribution});
    DISPLAY_DOM.DISTRIBUTION.innerHTML = distributionTableView(stockClientDistribution);
}


function distributeForAllClients(stockObj) {
    const clients = clientWeightMap.length;
    let sharesArr = [];
    let unitLeft = stockObj.unit + 0;
    for(let i = 0 ; i < clients - 1 ; i++) {
        const assignShare = getRandom(unitLeft/2);
        unitLeft -= assignShare;
        sharesArr.push(assignShare);
    }

    sharesArr.push(unitLeft);

    if(!oneOfProbability(clients)) {
        sharesArr = sharesArr.sort((a, b) => a < b ? 1 : -1);
    }



    if(!oneOfProbability(clients)) {
        sharesArr = pickOneAndDistribute(sharesArr, clients);
    }


    stockClientDistribution.push({
        stockName: stockObj.name,
        total: stockObj.unit,
        distribution: getDistribution(sharesArr)
    });
}

function getDistribution(sharesArr) {
    const distribution = [];
    for(const i in clientWeightMap) {
        distribution.push({
            clientName: clientWeightMap[i].name,
            shares: sharesArr[i]
        });
    }
    return distribution;
}

function pickOneAndDistribute(sharesArr, clients) {
    const random = getRandom(clients);
    const totalAmount = sharesArr[random];
    const shareAmount = Math.floor(totalAmount/(clients - 1));
    sharesArr[random] = 0;
    for( const i in sharesArr) {
        if(i != random) {
            sharesArr[i] += shareAmount;
        }
    }
    const difference = totalAmount - shareAmount*(clients - 1);
    let newRandom = getRandom(clients);
    if(shareAmount*(difference > 0)) {
        while(newRandom === random) {
            newRandom = getRandom(clients); 
        }
        sharesArr[newRandom] += difference;
    }

    return sharesArr;
}

function getRandom(total) {
    return Math.floor(Math.random()*total);
}

function oneOfProbability(number) {
    const randomNum = Math.ceil(Math.random()*(number + 1));
    let x = randomNum > number;
    return x;
}

//distribute();
addHandlers();