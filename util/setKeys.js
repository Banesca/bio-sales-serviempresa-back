export const addKeys = (rows) => {
	for (const row in rows) {
		if (rows[row].id) {
			rows[row].key = rows[row].id;
		} else {
			rows[row].key = row;
		}
	}
};

export const removeKeys = (rows) => {
	for (const row of rows) {
		delete row.key;
		console.log(row);
	}
	return rows;
};

export const setTabs = (rows) => {
	for (const row of rows) {
		row.label = row.nombre;
		row.key = row.idSucursal;
	}
};
