// const {
//   getVersion
// } = __non_webpack_require__('/lib/xp/admin')

export function post(req) {
  log.info(req.body)
}

// export function get(req) {
//   const contentType = 'application/xml'
//   const body = `<ping>
//             <version>${app.version}</version>
//             <XPversion>${getVersion()}</XPversion>
// </ping > `
//   return {
//     body,
//     contentType,
//     status: 200
//   }
// }
