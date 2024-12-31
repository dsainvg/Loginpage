
const encoder = new TextEncoder();

function sortByNthElement(arr, n) {
    let result = new Uint8Array(arr.length);
    let index = 0;
    let arrCopy = Array.from(arr.slice());

    for (let i = 0; i < arr.length; i++) {
        index = (index + n - 1) % arrCopy.length;
        result[i] = arrCopy.splice(index, 1)[0];
    }

    return result;
}

function hash(password,salt){
    console.log("Salt: " + salt);
    pass = salt + "$" + password;
    passlen = pass.length;
    let hash1 ='';
    let codStr = encoder.encode(pass);
    let voila = codStr[0];
    let voil = 0;
    if (voila > 96) {voila-=70;}
    else {voila-=64;}
    for (let i = 0; i < passlen; i++) {
        voil = voila*128;
        voil += codStr[i];
        voila+=2;
        if(voila > 48){voila -= 20;}
        hash1 += String.fromCharCode((voil%90)+37);
        hash1 += String.fromCharCode(((Math.floor(voil/90)))+37);
    }
    
    codedStrHash = encoder.encode(hash1);
    let hash2 = '';
    voil = 0;
    let sortedArrayHash = sortByNthElement(codedStrHash, (voila%5));

    for (let i = 0; i < sortedArrayHash.length; i++) {
        voil*=500;
        voil += sortedArrayHash[i];
        while(voil > 128){
            hash2 += String.fromCharCode((voil%90)+37);
            voil = Math.floor(voil/90);
        }
    }
    hash2 += String.fromCharCode((voil%90)+37);
    hash2 = "$" + salt +"$/$"+ hash2;

return hash2;

}

function check() {
    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;
    const errMsg = document.getElementById('err-msg');

    if (!username || !password) {
        errMsg.textContent = "Please enter both username and password.";
        return;
    }

    try{
        let storedData = localStorage.getItem('userData');
        if (storedData) { 
            let data = JSON.parse(storedData);
            const user = data.users.find(user => user.userid === username);
        if (!user) {
            errMsg.textContent = "User not found.";
            return;
        }
        const hashedPassword = hash(password, user.hash);
        if (hashedPassword !== user.password) {
            errMsg.textContent = "Incorrect password.";
            return;
        }
        errMsg.textContent = "Login successful!";
        return;
        }
        
    }
    catch(error){
        console.error('t7dfyg');
    }
    
    fetch('passwordsdata.json')
      .then(response => response.json())
      .then(data => {
        const user = data.users.find(user => user.userid === username);
        if (!user) {
            errMsg.textContent = "User not found.";
            return;
        }
        const hashedPassword = hash(password, user.hash);
        if (hashedPassword !== user.password) {
            errMsg.textContent = "Incorrect password.";
            return;
        }
        errMsg.textContent = "Login successful!";
        
      })
      .catch(error => {
        console.error('Error fetching JSON:', error);
      });
    
    
    
}