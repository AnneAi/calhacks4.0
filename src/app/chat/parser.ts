export class Parser {

  static format(raw: any) {
    if (!raw
      ||!raw.result
      || !raw.result.fulfillment
      || !raw.result.fulfillment.messages) {
      return;
    }

    let messages = raw.result.fulfillment.messages;
    let parsedMsg = [];
    let align = 'left';
    messages.forEach(msg => {
      switch (msg.type) {
        case 0: // text message
          parsedMsg.push({
            align,
            type: 'text',
            text: msg.speech
          });
          break;

        case 4: // custom payload
          let pld = msg.payload
          if (pld.type === 'video' && pld.platform === 'vimeo') {
            parsedMsg.push({
              align,
              type: 'video',
              url: `https://player.vimeo.com/video/${pld.id}`
            });
          } else if (pld.type === 'exercise' && pld.exotype === 'mcq') {
            parsedMsg.push({
              align,
              type: 'mcq',
              answer: pld.answer,
              choices: pld.choices,
              explanation: pld.explanation,
              wording: pld.wording
            });
          }
          break;
      }
    });

    return parsedMsg;
  }
}
