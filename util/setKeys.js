export const setKeys = (rows) => {
	for (const row in rows) {
		if (rows[row].id) {
			rows[row].key = rows[row].id;
		} else {
			rows[row].key = row;
		}
	}
};
