// This file will add both p5 instanced and global intellisence 
import * as p5Global from 'p5/global' 
import module = require('p5');
export = module;
export as namespace p5;

// import * as __munkres from 'munkres-algorithm'
//
// declare global {
//     const munkres: typeof __munkres
// }

// window.minWeightAssign = minWeightAssign;

declare global {
    interface Window {
        draw: () => void;
        setup: () => void;
        p5: typeof p5Global;
    }
}
