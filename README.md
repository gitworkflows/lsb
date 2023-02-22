# LSB

LSB steganography is a technique of hiding a secret message in the least significant bits (LSBs) of an image, audio file, or video file without significantly altering the original file. In LSB steganography, the message is concealed by replacing the least significant bits of the cover file with the bits of the secret message.

For example, if we have an 8-bit grayscale image, the LSB of each pixel can be used to store a bit of the secret message. Since the change is only in the least significant bit, the change in the cover image is hardly noticeable to the human eye.

The process of embedding a message using LSB steganography involves dividing the cover file into blocks of pixels or samples, and then replacing the LSB of each pixel or sample with the message bits. The receiver of the message can then extract the hidden message by reading the LSBs of the cover file.

LSB steganography is a popular method of steganography because it is relatively easy to implement and is difficult to detect without specialized software or analysis. However, it is vulnerable to attacks such as compression and filtering, which can remove the hidden message.

## Tests
Tested with the picture in "./tests"