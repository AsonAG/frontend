export function toBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = (event) => {
        try {
            const [_, base64] = event.target.result.split(";");
            resolve(base64.slice(7));
        }
        catch(e) {
            reject(e);
        }
        };

        fileReader.onerror = (error) => {
        reject(error);
        };

        fileReader.readAsDataURL(file);
    });
};