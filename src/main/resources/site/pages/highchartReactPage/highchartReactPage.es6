
const {
  render
} = __non_webpack_require__('/lib/thymeleaf')
const view = resolve('./highchartReactPage.html')
const React4xp = __non_webpack_require__('/lib/enonic/react4xp')

exports.get = (req) => {
  const highchartsReactExampleEntry = new React4xp('HighchartReactExample')
    .uniqueId()

  const overrideRequest = req.mode === 'inline' || req.mode === 'edit' ?
    {
      ...req,
      mode: 'live'
    } : req

  return {
    body: highchartsReactExampleEntry.renderBody({
      body: render(view, {
        highchartsReactId: highchartsReactExampleEntry.react4xpId,
        request: overrideRequest
      })
    }),
    pageContributions: highchartsReactExampleEntry.renderPageContributions({
      request: overrideRequest
    }),
    contentType: 'text/html'
  }
}
