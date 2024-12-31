const encoder = new TextEncoder();
const errMsg = document.getElementById('err-msg');

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

function saltgen() {
    let result = String.fromCharCode(Math.floor(Math.random() * 26) + (Math.random() < 0.5 ? 65 : 97));
    for (let i = 0; i < 7; i++) {
        result += String.fromCharCode(Math.floor(Math.random() * 90)+37);
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

console.log("Hash: " + hash1);
return hash2;

}

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    return strength;
}

function signUp(){
    const name = document.getElementById('name').value;
    const userId = document.getElementById('user-id').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    

    if (!userId || !password || !name || !userId || !email || !confirmPassword) {
        errMsg.textContent = "Please enter both username and password.";
        return;
    }

    if(password != confirmPassword){
        errMsg.textContent = "Passwords are not matching";
        return;
    } 
    if(checkPasswordStrength(password)<5){
        errMsg.textContent ="Elevate your Standards You can remember better passwords";
        return;
    }
    if(checkPasswordStrength(userId)>4){
        errMsg.textContent ="Hey You seems to confused for user ID and password Make it simplier to remember";
        return;
    }

    fetch('passwordsdata.json')
    .then(response => response.json())
    .then(data => {
        let user = data.users.find(user => user.userid === userId);
        if (user) {
            errMsg.textContent = "Sry 😢😢 Chose a different Id Someone already took it ";
            return;
        }
        user = data.users.find(user => user.email === email);
        if (user) {
            errMsg.innerHTML = `you already have an account ${user.name}; your userid is ${user.userid}`
            return;
        }     
        
        const salt = saltgen();
        const hashedPassword = hash(password, salt);

        change(data,{
            name: name,
            userid: userId,
            email: email,
            password: hashedPassword,
            hash : salt
        });
        

        
    })
.catch(error => {
        console.error('Error fetching JSON:', error);
});

/* 

dataren.users.push({
    name: name,
    userid: userId,
    email: email,
    password: hashedPassword,
    hash : salt
});

fetch('passwordsdata.json', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(response => {
    if (response.ok) {
        errMsg.textContent = "Sign up successful!";
    } else {
        errMsg.textContent = "Error saving data.";
    }
})
.catch(error => {
    console.error('Error saving JSON:', error);
    errMsg.textContent = "Error saving data.";
 */
}

function change(newData,user){
    newData.users.push(user);
    console.log(newData);

    fetch('passwordsdata.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
    })
    .then(response => {
        if (response.ok) {
            errMsg.textContent = "Sign up successful!";
        } else {
            errMsg.textContent = "Error saving data.";
        }
    })
    .catch(error => {
        console.error('Error saving JSON:', error);
        errMsg.textContent = "Error saving data.";
    });

}