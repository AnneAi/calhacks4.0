import { TeachatbotPage } from './app.po';

describe('teachatbot App', () => {
  let page: TeachatbotPage;

  beforeEach(() => {
    page = new TeachatbotPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
