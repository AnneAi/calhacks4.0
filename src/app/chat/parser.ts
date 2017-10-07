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
      }
    });

    return parsedMsg;
  }
}
