// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

// 1️⃣ Make a contract called Calculator
// 2️⃣ Create Result variable to store result
// 3️⃣ Create functions to add, subtract, and multiply to result
// 4️⃣ Create a function to get result

contract Calculator {
    uint256 public result;
    
    function addit(uint256 a) public {
        result +=a;
    }
    function subtract(uint256 a) public {
        result -=a;
    }
    function multiply(uint256 a) public {
        result *=a;
    }
    function divide(uint256 a) public {
        result = result/a;
    }
    function clear() public {
        result = 0;
    }
    function square() public {
        result = result*result;
    }
    
    function show() public view returns(uint256 ){
        return result;
    }
}
