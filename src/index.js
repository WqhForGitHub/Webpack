import { log } from './add-content';
import './index.css';
import headerHtml from './header.html';
import avatarImage from './1.png';
import './1.less';
import './1.scss';
import Vue from 'vue';
console.log(avatarImage);

document.write(headerHtml);

log("message");


const set = new Set([1, 2, 3, 4, 4, 4, 4, 4, 4]);
console.log(Array.from(set));