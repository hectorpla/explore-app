import { storeCategories } from "./fetch";
import setup = require('../common/setup');

const queryCountry = 'Japan';

setup.then(() => storeCategories(queryCountry));
