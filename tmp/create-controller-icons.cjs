const fs = require('fs');
const dir = 'output/controller-icons'; fs.mkdirSync(dir, {recursive:true});
const chars = {
 L:'<path d="M0 0h5v25h9v5H0Z"/>',
 R:'<path fill-rule="evenodd" d="M0 0h10l5 5v9l-4 4 5 12h-6L6 19H5v11H0Zm5 5v9h4l1-1V6L9 5Z"/>',
 B:'<path fill-rule="evenodd" d="M0 0h10l4 4v8l-3 3 4 4v7l-4 4H0Zm5 5v8h4l1-1V6L9 5Zm0 13v7h4l1-1v-5l-1-1Z"/>',
 Y:'<path d="M0 0h6v10l4 4 4-4V0h6v12l-7 8v10H7V20l-7-8Z"/>',
 A:'<path fill-rule="evenodd" d="M5 0h10l5 5v25h-6V20H6v10H0V5Zm2 5L6 6v9h8V6l-1-1Z"/>'
};
const badge='<path d="M8 6h48l4 4v44l-4 4H8l-4-4V10Z" fill="#fff"/>';
const oct='<path d="M18 5h28l13 13v28L46 59H18L5 46V18Z" fill="#fff"/>';
const stick='<path d="M11 8h42a5 5 0 0 1 5 5v7a4 4 0 0 1-4 4h-5v31H15V24h-5a4 4 0 0 1-4-4v-7a5 5 0 0 1 5-5Z" fill="#fff"/>';
const designs={
 'lb':badge+`<g fill="#000" transform="translate(14 17)">${chars.L}</g><g fill="#000" transform="translate(33 17)">${chars.B}</g>`,
 'rb':badge+`<g fill="#000" transform="translate(13 17)">${chars.R}</g><g fill="#000" transform="translate(34 17)">${chars.B}</g>`,
 'y':oct+`<g fill="#000" transform="translate(22 17)">${chars.Y}</g>`,
 'a':oct+`<g fill="#000" transform="translate(22 17)">${chars.A}</g>`,
 'l-stick':stick+`<g fill="#000" transform="translate(26 21)">${chars.L}</g>`,
 'r-stick':stick+`<g fill="#000" transform="translate(25 21)">${chars.R}</g>`
};
for(const [id,art] of Object.entries(designs)) fs.writeFileSync(`${dir}/${id}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="${id}">${art}</svg>\n`);
let preview='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 150"><rect width="660" height="150" fill="#1b2028"/>';
let i=0; for(const [id,art] of Object.entries(designs)){preview+=`<g transform="translate(${20+i*105} 18)">${art}</g><text x="${52+i*105}" y="115" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="13">${id.toUpperCase()}</text>`;i++} preview+='</svg>';fs.writeFileSync(`${dir}/vista-previa.svg`,preview);
