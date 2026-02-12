import { Background } from '../background-mv3.js';
import { Api } from '../../apis/chrome.js';


const background = new Background(new Api());

background.run();
