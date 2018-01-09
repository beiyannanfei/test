/**
 * Created by wyq on 18/1/9.
 */
//链表节点
class Node {
	constructor(e) {
		this.e = e;
		this.next = null;
	}
}

//链表
class LinkList {
	constructor() {
		this.head = null;
		this.length = 0;
	}

	//追加元素
	append(e) {
		let node = new Node(e);   //新建一个节点
		this.length++;
		if (!this.head) { //当前链表为空
			return this.head = node;
		}
		let t = this.head;
		while (!!t.next) {  //循环找到最后一个元素
			t = t.next;
		}
		t.next = node;  //将最后一个节点的下一个节点设置为当前节点
	}

	//任意位置插入
	insert(p, e) {
		let tp = +p;
		if (isNaN(tp) || tp < 0 || tp > this.length) {
			console.warn("position err p:%j", p);
			return 0;
		}
		p = +p;
		let node = new Node(e);
		this.length++;
		let t = this.head;
		if (0 === p) {  //插入在链表头部
			this.head = node;
			return node.next = t;
		}
		let index = 0;
		let pre = null;   //前一个节点
		while (index++ < p) {
			pre = t;
			t = t.next;
		}
		pre.next = node;
		return node.next = t;
	}

	remoteAt(p) {
		let tp = +p;
		if (isNaN(tp) || tp < 0 || tp >= this.length) {
			console.warn("position err p:%j", p);
			return 0;
		}
		p = +p;
		this.length--;
		if (0 === p) {
			return this.head = this.head.next;
		}
		let t = this.head;
		let pre = null;
		let index = 0;
		while (index++ < p) {
			pre = t;
			t = t.next;
		}
		return pre.next = t.next;
	}

	show() {  //方便打印
		let t = this.head;
		let str = "";
		while (!!t) {
			str += ` ${t.e} `;
			t = t.next;
		}
		return str;
	}
}

let l = new LinkList();
console.log("list: %j", l.show());
l.append(10);
l.append(20);
l.append(30);
l.append(40);
console.log("list: %j", l.show());
l.insert(0, 5);
console.log("list: %j", l.show());
// l.insert("a", 10);  //error
l.insert(2, 15);
console.log("list: %j", l.show());
l.remoteAt(0);
console.log("list: %j", l.show());
l.remoteAt(2);
console.log("list: %j", l.show());