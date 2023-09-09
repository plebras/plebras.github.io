// utils for date string with format YYYY-MM
// comp in descending order

export default {
	getY: (s) => {
		return s.split('-')[0];
	},
	getM: (s) => {
		return s.split('-')[1];
	},
	comp: (a, b) => {
		let aY = parseInt(a.split('-')[0]),
			bY = parseInt(b.split('-')[0]),
			aM = parseInt(a.split('-')[1]),
			bM = parseInt(b.split('-')[1]);
		if (aY === bY) {
			return bM - aM;
		} else {
			return bY - aY;
		}
	}
};
