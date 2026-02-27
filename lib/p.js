import * as p from '@clack/prompts';



p.updateSettings({
  aliases: {
    w: 'up',
    s: 'down',
    a: 'left',
    d: 'right',
  },
});


export default p;