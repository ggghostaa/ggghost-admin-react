/**
 * 获取随机数
 * @param start
 * @param end
 */
function getRandomNumberByRange(start: number, end: number) {
    return Math.round(Math.random() * (end - start) + start);
}

/**
 * 求和
 * @param x
 * @param y
 */
function sum(x: number, y: number) {
    return x + y;
}

/**
 * 平方
 * @param x
 */
function square(x: number) {
    return x * x;
}

export { getRandomNumberByRange, sum, square };