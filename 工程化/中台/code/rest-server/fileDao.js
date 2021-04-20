const fs = require('fs');
const path = require('path');

/**
 * GET /api/:table/ table 的列表页
 */
exports.list = (table, id) => {
    const list = readData(table);
    // TODO: limit 不需要把所有的数据都返回
    return list;
};

/**
 * GET /api/:table/:id 获取数据详情接口
 */
exports.get = (table, id) => {
    const list = readData(table);
    const res = list.find((item) => item.id === id);
    if (res) {
        return res.data;
    }
    return null;
};

/**
 * PUT /api/:table/:id 更新数据接口
 */
exports.set = (table, id, data) => {
    const list = readData(table);
    const res = list.find((item) => item.id === id);
    if (res) {
        res.data = data;
    } else {
        list.push({ id, data });
    }
    setData(table, list);
};

/**
 * POST /api/:table/ 新增数据接口
 */
exports.add = (table, data) => {
    const list = readData(table);
    let maxId = 1;
    for (const {id} of list) {
        if (id > maxId) {
            maxId = id;
        }
    }
    list.push({ id: maxId + 1, data });
    setData(table, list);
};

/**
 * DELETE /api/:table/:id 删除数据接口
 */
exports.del = (table, id) => {
    const list = readData(table);
    setData(table, list.filter((item) => item.id !== id));
};

function readData(table) {
    const file = path.join(__dirname, `./data/${table}.json`);
    if (!fs.existsSync(file)) {
        return [];
    }
    const buf = fs.readFileSync(file);
    return JSON.parse(buf.toString());
}

function setData(table, data) {
    const file = path.join(__dirname, `./data/${table}.json`);
    fs.writeFileSync(file, JSON.stringify(data));
}
