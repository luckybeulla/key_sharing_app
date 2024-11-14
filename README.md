***Bryan Yang '24***

***Lucky Beulla Muhoza '26***

***Prof. Jeff Ondich***

***CS338: Computer Security***

# Diffie-Hellman key exchange interactive web app

This web application is an engaging way to understand the steps of generating a shared secret key using the Diffie-Hellman key exchange protocol. Users can simulate the roles of Alice and Bob, exchanging values and calculating a shared secret, while an eavesdropper Eve observes this public communication.
When Alice and Bob obtain secret keys that match at the end, a recap of the key exchange is provided. Additionally, there is an option to convert the shared key into an AES key, accompanied by a brief description of AES encryption and its importance in secure communications.


## Features

- **Step-by-step Diffie-Hellman key exchange**: Users are guided through each step to understand and complete a Diffie-Hellman key exchange.
- **Eavesdropper's (Eve) view**: Display what Eve observes as the communication takes place to show which elements of the exchange are public.
- **AES key conversion**: An option to convert the shared key into an AES key and learn about AES encryption.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python with Flask
- **Cryptography**: PyCryptodome (for AES encryption)

## Dependencies

```bash
pip install flask pycryptodome
```
## Documentation used

[PyCryptodome 3.220b0 documentation](https://www.pycryptodome.org/src/examples#encrypt-data-with-aes)

## Demo

<div>
    <a href="https://www.loom.com/share/14d0db3de48d4927a9337b059371e71c">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/14d0db3de48d4927a9337b059371e71c-7d06e36598f99ffc-full-play.gif">
    </a>
    <a href="https://www.loom.com/share/14d0db3de48d4927a9337b059371e71c">
      <p>Diffie-Hellman interactive app - Watch Video</p>
    </a>
</div>




