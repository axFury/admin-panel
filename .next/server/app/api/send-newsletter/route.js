/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/send-newsletter/route";
exports.ids = ["app/api/send-newsletter/route"];
exports.modules = {

/***/ "(rsc)/./app/api/send-newsletter/route.ts":
/*!******************************************!*\
  !*** ./app/api/send-newsletter/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nodemailer */ \"(rsc)/./node_modules/nodemailer/lib/nodemailer.js\");\n\nasync function POST(req) {\n    try {\n        const { subject, html, recipients } = await req.json();\n        if (!subject || !html || !Array.isArray(recipients)) {\n            return new Response(JSON.stringify({\n                error: \"Invalid payload\"\n            }), {\n                status: 400\n            });\n        }\n        const SMTP_HOST = process.env.SMTP_HOST;\n        const SMTP_PORT = parseInt(process.env.SMTP_PORT || \"587\", 10);\n        const SMTP_USER = process.env.SMTP_USER;\n        const SMTP_PASS = process.env.SMTP_PASS;\n        const SMTP_FROM = process.env.SMTP_FROM;\n        if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {\n            return new Response(JSON.stringify({\n                error: \"SMTP environment variables missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.\"\n            }), {\n                status: 500\n            });\n        }\n        const transporter = nodemailer__WEBPACK_IMPORTED_MODULE_0__.createTransport({\n            host: SMTP_HOST,\n            port: SMTP_PORT,\n            secure: SMTP_PORT === 465,\n            auth: {\n                user: SMTP_USER,\n                pass: SMTP_PASS\n            }\n        });\n        // Optional: basic recipient sanitation\n        const uniqueRecipients = Array.from(new Set(recipients.filter(Boolean))).slice(0, 5000);\n        // Chunk into batches to avoid very long headers or provider limits.\n        const chunks = [];\n        const batchSize = 90;\n        for(let i = 0; i < uniqueRecipients.length; i += batchSize){\n            chunks.push(uniqueRecipients.slice(i, i + batchSize));\n        }\n        let sent = 0;\n        for (const chunk of chunks){\n            await transporter.sendMail({\n                from: SMTP_FROM,\n                to: SMTP_FROM,\n                bcc: chunk,\n                subject,\n                html\n            });\n            sent += chunk.length;\n            // Small delay can help rate limiting on some providers\n            await new Promise((r)=>setTimeout(r, 200));\n        }\n        return new Response(JSON.stringify({\n            ok: true,\n            sent,\n            batches: chunks.length\n        }), {\n            status: 200\n        });\n    } catch (e) {\n        console.error(e);\n        return new Response(JSON.stringify({\n            error: e?.message || \"Internal error\"\n        }), {\n            status: 500\n        });\n    }\n} /*\nSecurity note:\nFor production, protect this endpoint by verifying a Firebase ID token\nand authorizing only admin users before sending. Consider Firebase Admin SDK\nto verify the token server-side.\n*/ \n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3NlbmQtbmV3c2xldHRlci9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUNtQztBQVE1QixlQUFlQyxLQUFLQyxHQUFnQjtJQUN6QyxJQUFJO1FBQ0YsTUFBTSxFQUFFQyxPQUFPLEVBQUVDLElBQUksRUFBRUMsVUFBVSxFQUFFLEdBQUksTUFBTUgsSUFBSUksSUFBSTtRQUNyRCxJQUFJLENBQUNILFdBQVcsQ0FBQ0MsUUFBUSxDQUFDRyxNQUFNQyxPQUFPLENBQUNILGFBQWE7WUFDbkQsT0FBTyxJQUFJSSxTQUFTQyxLQUFLQyxTQUFTLENBQUM7Z0JBQUVDLE9BQU87WUFBa0IsSUFBSTtnQkFBRUMsUUFBUTtZQUFJO1FBQ2xGO1FBQ0EsTUFBTUMsWUFBWUMsUUFBUUMsR0FBRyxDQUFDRixTQUFTO1FBQ3ZDLE1BQU1HLFlBQVlDLFNBQVNILFFBQVFDLEdBQUcsQ0FBQ0MsU0FBUyxJQUFJLE9BQU87UUFDM0QsTUFBTUUsWUFBWUosUUFBUUMsR0FBRyxDQUFDRyxTQUFTO1FBQ3ZDLE1BQU1DLFlBQVlMLFFBQVFDLEdBQUcsQ0FBQ0ksU0FBUztRQUN2QyxNQUFNQyxZQUFZTixRQUFRQyxHQUFHLENBQUNLLFNBQVM7UUFFdkMsSUFBSSxDQUFDUCxhQUFhLENBQUNLLGFBQWEsQ0FBQ0MsYUFBYSxDQUFDQyxXQUFXO1lBQ3hELE9BQU8sSUFBSVosU0FDVEMsS0FBS0MsU0FBUyxDQUFDO2dCQUNiQyxPQUNFO1lBQ0osSUFDQTtnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsTUFBTVMsY0FBY3RCLHVEQUEwQixDQUFDO1lBQzdDd0IsTUFBTVY7WUFDTlcsTUFBTVI7WUFDTlMsUUFBUVQsY0FBYztZQUN0QlUsTUFBTTtnQkFBRUMsTUFBTVQ7Z0JBQVdVLE1BQU1UO1lBQVU7UUFDM0M7UUFFQSx1Q0FBdUM7UUFDdkMsTUFBTVUsbUJBQW1CdkIsTUFBTXdCLElBQUksQ0FBQyxJQUFJQyxJQUFJM0IsV0FBVzRCLE1BQU0sQ0FBQ0MsV0FBV0MsS0FBSyxDQUFDLEdBQUc7UUFFbEYsb0VBQW9FO1FBQ3BFLE1BQU1DLFNBQXFCLEVBQUU7UUFDN0IsTUFBTUMsWUFBWTtRQUNsQixJQUFLLElBQUlDLElBQUksR0FBR0EsSUFBSVIsaUJBQWlCUyxNQUFNLEVBQUVELEtBQUtELFVBQVc7WUFDM0RELE9BQU9JLElBQUksQ0FBQ1YsaUJBQWlCSyxLQUFLLENBQUNHLEdBQUdBLElBQUlEO1FBQzVDO1FBRUEsSUFBSUksT0FBTztRQUNYLEtBQUssTUFBTUMsU0FBU04sT0FBUTtZQUMxQixNQUFNZCxZQUFZcUIsUUFBUSxDQUFDO2dCQUN6QlosTUFBTVY7Z0JBQ051QixJQUFJdkI7Z0JBQ0p3QixLQUFLSDtnQkFDTHZDO2dCQUNBQztZQUNGO1lBQ0FxQyxRQUFRQyxNQUFNSCxNQUFNO1lBQ3BCLHVEQUF1RDtZQUN2RCxNQUFNLElBQUlPLFFBQVEsQ0FBQ0MsSUFBTUMsV0FBV0QsR0FBRztRQUN6QztRQUVBLE9BQU8sSUFBSXRDLFNBQVNDLEtBQUtDLFNBQVMsQ0FBQztZQUFFc0MsSUFBSTtZQUFNUjtZQUFNUyxTQUFTZCxPQUFPRyxNQUFNO1FBQUMsSUFBSTtZQUFFMUIsUUFBUTtRQUFJO0lBQ2hHLEVBQUUsT0FBT3NDLEdBQVE7UUFDZkMsUUFBUXhDLEtBQUssQ0FBQ3VDO1FBQ2QsT0FBTyxJQUFJMUMsU0FBU0MsS0FBS0MsU0FBUyxDQUFDO1lBQUVDLE9BQU91QyxHQUFHRSxXQUFXO1FBQWlCLElBQUk7WUFBRXhDLFFBQVE7UUFBSTtJQUMvRjtBQUNGLEVBRUE7Ozs7O0FBS0EiLCJzb3VyY2VzIjpbIi9Vc2Vycy9heGVsbGVtYWlyZS9EZXNrdG9wL2FkbWlucGFuZWwvYXBwL2FwaS9zZW5kLW5ld3NsZXR0ZXIvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIlxuaW1wb3J0IG5vZGVtYWlsZXIgZnJvbSBcIm5vZGVtYWlsZXJcIlxuXG50eXBlIEJvZHkgPSB7XG4gIHN1YmplY3Q6IHN0cmluZ1xuICBodG1sOiBzdHJpbmdcbiAgcmVjaXBpZW50czogc3RyaW5nW11cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxOiBOZXh0UmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgc3ViamVjdCwgaHRtbCwgcmVjaXBpZW50cyB9ID0gKGF3YWl0IHJlcS5qc29uKCkpIGFzIEJvZHlcbiAgICBpZiAoIXN1YmplY3QgfHwgIWh0bWwgfHwgIUFycmF5LmlzQXJyYXkocmVjaXBpZW50cykpIHtcbiAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogXCJJbnZhbGlkIHBheWxvYWRcIiB9KSwgeyBzdGF0dXM6IDQwMCB9KVxuICAgIH1cbiAgICBjb25zdCBTTVRQX0hPU1QgPSBwcm9jZXNzLmVudi5TTVRQX0hPU1RcbiAgICBjb25zdCBTTVRQX1BPUlQgPSBwYXJzZUludChwcm9jZXNzLmVudi5TTVRQX1BPUlQgfHwgXCI1ODdcIiwgMTApXG4gICAgY29uc3QgU01UUF9VU0VSID0gcHJvY2Vzcy5lbnYuU01UUF9VU0VSXG4gICAgY29uc3QgU01UUF9QQVNTID0gcHJvY2Vzcy5lbnYuU01UUF9QQVNTXG4gICAgY29uc3QgU01UUF9GUk9NID0gcHJvY2Vzcy5lbnYuU01UUF9GUk9NXG5cbiAgICBpZiAoIVNNVFBfSE9TVCB8fCAhU01UUF9VU0VSIHx8ICFTTVRQX1BBU1MgfHwgIVNNVFBfRlJPTSkge1xuICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGVycm9yOlxuICAgICAgICAgICAgXCJTTVRQIGVudmlyb25tZW50IHZhcmlhYmxlcyBtaXNzaW5nLiBTZXQgU01UUF9IT1NULCBTTVRQX1BPUlQsIFNNVFBfVVNFUiwgU01UUF9QQVNTLCBTTVRQX0ZST00uXCIsXG4gICAgICAgIH0pLFxuICAgICAgICB7IHN0YXR1czogNTAwIH1cbiAgICAgIClcbiAgICB9XG5cbiAgICBjb25zdCB0cmFuc3BvcnRlciA9IG5vZGVtYWlsZXIuY3JlYXRlVHJhbnNwb3J0KHtcbiAgICAgIGhvc3Q6IFNNVFBfSE9TVCxcbiAgICAgIHBvcnQ6IFNNVFBfUE9SVCxcbiAgICAgIHNlY3VyZTogU01UUF9QT1JUID09PSA0NjUsXG4gICAgICBhdXRoOiB7IHVzZXI6IFNNVFBfVVNFUiwgcGFzczogU01UUF9QQVNTIH0sXG4gICAgfSlcblxuICAgIC8vIE9wdGlvbmFsOiBiYXNpYyByZWNpcGllbnQgc2FuaXRhdGlvblxuICAgIGNvbnN0IHVuaXF1ZVJlY2lwaWVudHMgPSBBcnJheS5mcm9tKG5ldyBTZXQocmVjaXBpZW50cy5maWx0ZXIoQm9vbGVhbikpKS5zbGljZSgwLCA1MDAwKVxuXG4gICAgLy8gQ2h1bmsgaW50byBiYXRjaGVzIHRvIGF2b2lkIHZlcnkgbG9uZyBoZWFkZXJzIG9yIHByb3ZpZGVyIGxpbWl0cy5cbiAgICBjb25zdCBjaHVua3M6IHN0cmluZ1tdW10gPSBbXVxuICAgIGNvbnN0IGJhdGNoU2l6ZSA9IDkwXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1bmlxdWVSZWNpcGllbnRzLmxlbmd0aDsgaSArPSBiYXRjaFNpemUpIHtcbiAgICAgIGNodW5rcy5wdXNoKHVuaXF1ZVJlY2lwaWVudHMuc2xpY2UoaSwgaSArIGJhdGNoU2l6ZSkpXG4gICAgfVxuXG4gICAgbGV0IHNlbnQgPSAwXG4gICAgZm9yIChjb25zdCBjaHVuayBvZiBjaHVua3MpIHtcbiAgICAgIGF3YWl0IHRyYW5zcG9ydGVyLnNlbmRNYWlsKHtcbiAgICAgICAgZnJvbTogU01UUF9GUk9NLFxuICAgICAgICB0bzogU01UUF9GUk9NLCAvLyBQcmltYXJ5IHJlY2lwaWVudCAoc2VuZGVyKSwgcmVhbCByZWNpcGllbnRzIGluIEJDQ1xuICAgICAgICBiY2M6IGNodW5rLFxuICAgICAgICBzdWJqZWN0LFxuICAgICAgICBodG1sLFxuICAgICAgfSlcbiAgICAgIHNlbnQgKz0gY2h1bmsubGVuZ3RoXG4gICAgICAvLyBTbWFsbCBkZWxheSBjYW4gaGVscCByYXRlIGxpbWl0aW5nIG9uIHNvbWUgcHJvdmlkZXJzXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCAyMDApKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoeyBvazogdHJ1ZSwgc2VudCwgYmF0Y2hlczogY2h1bmtzLmxlbmd0aCB9KSwgeyBzdGF0dXM6IDIwMCB9KVxuICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICBjb25zb2xlLmVycm9yKGUpXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShKU09OLnN0cmluZ2lmeSh7IGVycm9yOiBlPy5tZXNzYWdlIHx8IFwiSW50ZXJuYWwgZXJyb3JcIiB9KSwgeyBzdGF0dXM6IDUwMCB9KVxuICB9XG59XG5cbi8qXG5TZWN1cml0eSBub3RlOlxuRm9yIHByb2R1Y3Rpb24sIHByb3RlY3QgdGhpcyBlbmRwb2ludCBieSB2ZXJpZnlpbmcgYSBGaXJlYmFzZSBJRCB0b2tlblxuYW5kIGF1dGhvcml6aW5nIG9ubHkgYWRtaW4gdXNlcnMgYmVmb3JlIHNlbmRpbmcuIENvbnNpZGVyIEZpcmViYXNlIEFkbWluIFNES1xudG8gdmVyaWZ5IHRoZSB0b2tlbiBzZXJ2ZXItc2lkZS5cbiovXG4iXSwibmFtZXMiOlsibm9kZW1haWxlciIsIlBPU1QiLCJyZXEiLCJzdWJqZWN0IiwiaHRtbCIsInJlY2lwaWVudHMiLCJqc29uIiwiQXJyYXkiLCJpc0FycmF5IiwiUmVzcG9uc2UiLCJKU09OIiwic3RyaW5naWZ5IiwiZXJyb3IiLCJzdGF0dXMiLCJTTVRQX0hPU1QiLCJwcm9jZXNzIiwiZW52IiwiU01UUF9QT1JUIiwicGFyc2VJbnQiLCJTTVRQX1VTRVIiLCJTTVRQX1BBU1MiLCJTTVRQX0ZST00iLCJ0cmFuc3BvcnRlciIsImNyZWF0ZVRyYW5zcG9ydCIsImhvc3QiLCJwb3J0Iiwic2VjdXJlIiwiYXV0aCIsInVzZXIiLCJwYXNzIiwidW5pcXVlUmVjaXBpZW50cyIsImZyb20iLCJTZXQiLCJmaWx0ZXIiLCJCb29sZWFuIiwic2xpY2UiLCJjaHVua3MiLCJiYXRjaFNpemUiLCJpIiwibGVuZ3RoIiwicHVzaCIsInNlbnQiLCJjaHVuayIsInNlbmRNYWlsIiwidG8iLCJiY2MiLCJQcm9taXNlIiwiciIsInNldFRpbWVvdXQiLCJvayIsImJhdGNoZXMiLCJlIiwiY29uc29sZSIsIm1lc3NhZ2UiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/send-newsletter/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsend-newsletter%2Froute&page=%2Fapi%2Fsend-newsletter%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsend-newsletter%2Froute.ts&appDir=%2FUsers%2Faxellemaire%2FDesktop%2Fadminpanel%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Faxellemaire%2FDesktop%2Fadminpanel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsend-newsletter%2Froute&page=%2Fapi%2Fsend-newsletter%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsend-newsletter%2Froute.ts&appDir=%2FUsers%2Faxellemaire%2FDesktop%2Fadminpanel%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Faxellemaire%2FDesktop%2Fadminpanel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_axellemaire_Desktop_adminpanel_app_api_send_newsletter_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/send-newsletter/route.ts */ \"(rsc)/./app/api/send-newsletter/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/send-newsletter/route\",\n        pathname: \"/api/send-newsletter\",\n        filename: \"route\",\n        bundlePath: \"app/api/send-newsletter/route\"\n    },\n    resolvedPagePath: \"/Users/axellemaire/Desktop/adminpanel/app/api/send-newsletter/route.ts\",\n    nextConfigOutput,\n    userland: _Users_axellemaire_Desktop_adminpanel_app_api_send_newsletter_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzZW5kLW5ld3NsZXR0ZXIlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnNlbmQtbmV3c2xldHRlciUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnNlbmQtbmV3c2xldHRlciUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmF4ZWxsZW1haXJlJTJGRGVza3RvcCUyRmFkbWlucGFuZWwlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGYXhlbGxlbWFpcmUlMkZEZXNrdG9wJTJGYWRtaW5wYW5lbCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDc0I7QUFDbkc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9heGVsbGVtYWlyZS9EZXNrdG9wL2FkbWlucGFuZWwvYXBwL2FwaS9zZW5kLW5ld3NsZXR0ZXIvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3NlbmQtbmV3c2xldHRlci9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3NlbmQtbmV3c2xldHRlclwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvc2VuZC1uZXdzbGV0dGVyL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2F4ZWxsZW1haXJlL0Rlc2t0b3AvYWRtaW5wYW5lbC9hcHAvYXBpL3NlbmQtbmV3c2xldHRlci9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsend-newsletter%2Froute&page=%2Fapi%2Fsend-newsletter%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsend-newsletter%2Froute.ts&appDir=%2FUsers%2Faxellemaire%2FDesktop%2Fadminpanel%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Faxellemaire%2FDesktop%2Fadminpanel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "dns":
/*!**********************!*\
  !*** external "dns" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("dns");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/nodemailer"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsend-newsletter%2Froute&page=%2Fapi%2Fsend-newsletter%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsend-newsletter%2Froute.ts&appDir=%2FUsers%2Faxellemaire%2FDesktop%2Fadminpanel%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Faxellemaire%2FDesktop%2Fadminpanel&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();