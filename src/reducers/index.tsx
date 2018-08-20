import { combineReducers } from 'redux';

import counter from './counter';
import players  from './players';
import match from './match';
import swarmEditorConfig from './swarmEditorConfig';

let reduce = combineReducers({
    counter: counter,
    players: players,
    match: match,
    swarmEditorConfig: swarmEditorConfig
})


export default reduce;

