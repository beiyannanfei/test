/**
 * Created by chenjie on 2015/4/20.
 */

var CONFIG = {
    follow: {followed: 1, unfollowed: 2, all: 3},
    goods: {
        type: {score: 1, cashRedPager: 2, goods: 3, chargeCard: 4, empty: 5, shoppingCard: 6, redPager: 7, selfShoppingCard: 8, card: 9, coupon: 10, live: 102, demand: 103, demandPackage: 104, vip: 105, salon: 106, other: 999},
        use: {lottery: 1, pay: 2},
        play: {exchange: 1, buy: 2, timeDown: 3, oneYuan: 4, lottery: 5, raise: 6},
        state: {up: 1, down: 2, storage: 3, soldout: 10}
    }
}
module.exports = CONFIG
