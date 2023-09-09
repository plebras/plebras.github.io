// utils for date string with format YYYY-MM
// comp in descending order

export const getY = (s) => {
	return s.split('-')[0];
};

export const getM = (s) => {
	return s.split('-')[1];
};

export const comp = (a, b) => {
	let aY = parseInt(a.split('-')[0]),
		bY = parseInt(b.split('-')[0]),
		aM = parseInt(a.split('-')[1]),
		bM = parseInt(b.split('-')[1]);
	if (aY === bY) {
		return bM - aM;
	} else {
		return bY - aY;
	}
};

export const byYear = (data) => {
	let count = 0;
	return Object.entries(
		data.reduce((res, cur) => {
			let y = getY(cur.date);
			res[y] = res[y] || [];
			cur.id = count++;
			res[y].push(cur);
			return res;
		}, Object.create(null))
	)
		.map((e) => {
			return {
				key: e[0].toString(),
				values: e[1].sort((a, b) => {
					return comp(a.date, b.date);
				})
			};
		})
		.sort((a, b) => {
			return b.key - a.key;
		});
};
