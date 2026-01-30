import { Popup } from '../popup.js';
import { Api } from '../../apis/chrome-popup.js';

const popup = new Popup(new Api());

popup.run();
