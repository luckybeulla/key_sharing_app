***✨ Bryan Yang'24 ✨***

***✨ Lucky Beulla Muhoza'26 ✨***

## Diffie-Hellman interactive web app ##

### Current bugs in the code ###

* AES key algorithm can not generate a key from 0 so when the user choses number that leads to the secret key being 0, the AES key generation button will not work

* The backend code in script.js doing the Diffie-Hellman calculations does not handle large integers so when Alice chooses big numbers, the returned values are NaN


> **Note**: `pip install Flask pycryptodome` depedency to simulate AES key transformation in python



