chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const url = new URL(tabs[0].url);
    const domain = url.hostname;

    try {
        // domains.txt dosyas�n� indirip domain listesini olu�tur
        const responseDomains = await fetch("https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/refs/heads/main/data/domains.txt");
        const dataDomains = await responseDomains.text();
        const blockedDomains = dataDomains.split("\n").filter(url => url.trim().length > 0);

        // wildcards.txt dosyas�n� indirip regex listesi olu�tur
        const responseWildcards = await fetch("https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/refs/heads/main/data/wildcards.txt");
        const dataWildcards = await responseWildcards.text();
        const wildcardPatterns = dataWildcards.split("\n").filter(wildcard => wildcard.trim().length > 0).map(wildcard => {
            // Wildcard'� regex format�na d�n��t�r
            const regexPattern = '^' + wildcard.trim().replace(/\*/g, '.*') + '$';
            return new RegExp(regexPattern);
        });

        const statusDiv = document.getElementById('status');

        // Domainin domains.txt dosyas�ndaki sabit domainlerle e�le�ip e�le�medi�ini kontrol et
        if (blockedDomains.includes(domain)) {
            statusDiv.textContent = "Address in scope";
            statusDiv.classList.add("safe");
        }
        // Domainin wildcards.txt dosyas�ndaki wildcard domainlerle e�le�ip e�le�medi�ini kontrol et
        else if (wildcardPatterns.some(regex => regex.test(domain))) {
            statusDiv.textContent = "Address in scope";
            statusDiv.classList.add("safe");
        } else {
            statusDiv.textContent = "Address out of scope";
            statusDiv.classList.add("danger");
        }
    } catch (error) {
        console.error("Bounty target list fetch error.", error);
    }
});