import forge from 'node-forge';
/**** ><> ↑ --------- Importing forge from 'node-forge' ->  */

// WARNING: changing this to `export default` will break the mock and be incredibly hard to debug. Ask me how I know.
/**** ><> ↑ --------- Warning comment ->  */
module.exports = {
  jsbn: forge.jsbn,
  util: forge.util,
  pkcs5: {
/**** ><> ↑ --------- Module export statement and high-level forge object structure initiation ->  */
    pbkdf2: forge.pkcs5.pbkdf2,
  },
/**** ><> ↑ --------- Defining the pkcs5 property within the forge object ->  */
  md: {
    sha256: forge.md.sha256,
  },
/**** ><> ↑ --------- Defining the md property within the forge object ->  */
  rsa: {
    setPublicKey() {
      return {
        encrypt(str: string) {
          return str;
        },
      };
    },
/**** ><> ↑ --------- Defining the rsa property within the forge object ->  */

    setPrivateKey() {
      return {
        decrypt(str: string) {
          return str;
        },
      };
    },
/**** ><> ↑ --------- Defining setPrivateKey function within rsa ->  */
  },
  random: {
    getBytesSync(num: number) {
      let s = '';

      for (let i = 0; i < num; i++) {
        s += 'a';
      }

      return s;
    },
  },
/**** ><> ↑ --------- Defining the random property within the forge object ->  */
  pki: {
    rsa: {
      generateKeyPair() {
        return {
          privateKey: {
            d: 'a',
            dP: 'a',
            dQ: 'a',
            e: 'a',
            n: 'a',
            p: 'a',
            q: 'a',
            qInv: 'a',
          },
          publicKey: {
            e: 'a',
            n: 'a',
          },
        };
      },
    },
  },
/**** ><> ↑ --------- Defining pki property and its nested rsa object and method within forge object ->  */
  cipher: {
    createCipher() {
      return {
        start(config) {
          this._config = config;
        },

        update(buffer) {
          this._data = buffer;
        },

        finish() {
          this.mode = {
            tag: 'tag',
          };
          this.output = this._data;
        },
      };
    },
/**** ><> ↑ --------- Defining the cipher property within the forge object ->  */

    createDecipher() {
      return {
        start(config) {
          this._config = config;
        },

        update(buffer) {
          this.output = buffer;
        },

        finish() {
          return true;
        },
      };
    },
/**** ><> ↑ --------- Defining a createDecipher function within cipher ->  */
  },
};
/**** ><> ↑ --------- End of module exports ->  */
