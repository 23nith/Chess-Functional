
const ShadowStyleChesBoard =
    `
      slot[name='chess-board-slot'] {
          width:              100%;
          height:             100%;
          display:            flex;
          flex-wrap:          wrap;
     }

     div {
          width:              calc(100% / 8);
          height:             calc(100% / 8);
     }

     div:nth-child(n+1):nth-child(odd):nth-child(-n+8) {
          background-color:   lightGreen;
     }

     div:nth-child(n+1):nth-child(even):nth-child(-n+8) {
          background-color:   lightYellow;
     }

     div:nth-child(n+9):nth-child(even):nth-child(-n+16) {
          background-color:   lightGreen;
     }

     div:nth-child(n+9):nth-child(odd):nth-child(-n+16) {
          background-color:   lightYellow;
     }

     div:nth-child(n+17):nth-child(even):nth-child(-n+24) {
          background-color:   lightYellow;
     }

     div:nth-child(n+17):nth-child(odd):nth-child(-n+24) {
          background-color:   lightGreen;
     }

     div:nth-child(n+25):nth-child(even):nth-child(-n+32) {
          background-color:   lightGreen;
     }

     div:nth-child(n+25):nth-child(odd):nth-child(-n+32) {
          background-color:   lightYellow;
     }

     div:nth-child(n+33):nth-child(even):nth-child(-n+40) {
          background-color:   lightYellow;
     }

     div:nth-child(n+33):nth-child(odd):nth-child(-n+40) {
          background-color:   lightGreen;
     }

     div:nth-child(n+41):nth-child(even):nth-child(-n+48) {
          background-color:   lightGreen;
     }

     div:nth-child(n+41):nth-child(odd):nth-child(-n+48) {
          background-color:   lightYellow;
     }

     div:nth-child(n+49):nth-child(even):nth-child(-n+56) {
          background-color:   lightYellow;
     }

     div:nth-child(n+49):nth-child(odd):nth-child(-n+56) {
          background-color:   lightGreen;
     }

     div:nth-child(n+57):nth-child(even):nth-child(-n+64) {
          background-color:   lightGreen;
     }

     div:nth-child(n+57):nth-child(odd):nth-child(-n+64) {
          background-color:   lightYellow;
     }

    `;
export {
    ShadowStyleChesBoard,
};
