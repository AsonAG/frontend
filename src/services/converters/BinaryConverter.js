export function toBase64(file) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();

		fileReader.onload = (event) => {
			try {
				const [_, base64] = event.target.result.split(";");
				resolve(base64.slice(7));
			} catch (e) {
				reject(e);
			}
		};

		fileReader.onerror = (error) => {
			reject(error);
		};

		fileReader.readAsDataURL(file);
	});
}

function base64ToBytes(base64) {
	const binString = atob(base64);
	return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

export function base64Decode(base64String) {
	return new TextDecoder().decode(base64ToBytes(base64String));
}
