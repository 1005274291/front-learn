const fs = require('fs');

exports.get = (id) => {
    const list = readData();
    const res = list.find((item) => item.id === id);
    if (res) {
        return res.data;
    }
    return null;
};

exports.set = (id, data) => {
    const list = readData();
    const res = list.find((item) => item.id === id);
    if (res) {
        res.data = data;
    } else {
        list.push({ id, data });
    }
    setData(list);
};

function readData() {
    const buf = fs.readFileSync('./data.json');
    return JSON.parse(buf.toString());
}

function setData(data) {
    fs.writeFileSync('./data.json', JSON.stringify(data));
}
