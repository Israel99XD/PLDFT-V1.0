importScripts('https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js');

self.onmessage = function (e) {
    fetch(e.data)
        .then(response => response.text())
        .then(csvData => {
            Papa.parse(csvData, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    self.postMessage(result.data);
                }
            });
        })
        .catch(error => self.postMessage({ error }));
};
