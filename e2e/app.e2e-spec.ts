import { StencilizerPage } from './app.po';

describe('stencilizer App', () => {
  let page: StencilizerPage;

  beforeEach(() => {
    page = new StencilizerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
