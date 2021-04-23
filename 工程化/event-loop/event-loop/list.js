function getCurrent() {
	const title = document.querySelector('.timu-text').innerText;
	const list = document.querySelectorAll('.answer-w p');
	const ops = [];
	let right;
	for (let op of list) {
		ops.push(op.innerText);
		if (op.classList[0] === 'success') {
			right = op.innerText[0];
		}
	}
	return {
		title, ops, right
	}
}


const results = [];
let count = 1455;

function progress () {
	// 1. click 一下
	const op1 = document.querySelector('.answer-w p');
	op1.click();

	// 2. 获取当前这道题
	setTimeout(() => {
		const res = getCurrent();
		results.push(res);

		// 3. 进入下一题
		const nextBtn = document.querySelectorAll('.btn-bar .left.gl')[1];
		nextBtn.click();

		setTimeout(() => {
			if (count--) progress();
		}, 200);

	}, 200);
}





