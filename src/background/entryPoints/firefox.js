import { Background } from '../background-mv2.js';
import { Api } from '../../apis/firefox.js';


const background = new Background(new Api());

background.run();
