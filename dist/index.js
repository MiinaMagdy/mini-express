"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  IncomingMessage: () => import_http.IncomingMessage,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_http = require("http");
var http = __toESM(require("http"));
var Router = class {
  constructor(routers = []) {
    const flatRoutes = routers.flatMap((router) => [...router.routes.entries()]);
    this.routes = new Map(flatRoutes);
  }
  use(req, res) {
    return __async(this, null, function* () {
      const methodRoutes = this.routes.get(req.method || "");
      if (methodRoutes) {
        for (const endPoint of methodRoutes) {
          if (this.match(endPoint.url, req)) {
            yield this.runHandlers(endPoint.handlers, req, res);
            return;
          }
        }
      }
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify({ title: "Not Found", message: "Route Not Found" }));
      res.end();
    });
  }
  addMiddleware(middleware) {
    for (const route of this.routes) {
      route[1].forEach((endPoint) => {
        endPoint.handlers.unshift(middleware);
      });
    }
  }
  runHandlers(handlers, req, res) {
    return __async(this, null, function* () {
      let index = 0;
      const next = () => __async(this, null, function* () {
        if (index < handlers.length) {
          const handler = handlers[index++];
          yield handler(req, res, next);
        }
      });
      yield next();
    });
  }
  match(url, req) {
    var _a;
    const urlPath = url.split("/");
    const reqUrlPath = ((_a = req.url) == null ? void 0 : _a.split("/")) || [];
    if (urlPath.length !== reqUrlPath.length) return false;
    for (let i = 0; i < urlPath.length; i++) {
      if (urlPath[i][0] === ":") {
        req.params[urlPath[i].slice(1)] = reqUrlPath[i];
        continue;
      }
      if (urlPath[i] !== reqUrlPath[i]) return false;
    }
    return true;
  }
  set(method, url, handlers) {
    if (!this.routes.has(method)) {
      this.routes.set(method, []);
    }
    this.routes.get(method).push({ url, handlers });
  }
  get(url, ...handlers) {
    this.set("GET", url, handlers);
  }
  post(url, ...handlers) {
    this.set("POST", url, handlers);
  }
  put(url, ...handlers) {
    this.set("PUT", url, handlers);
  }
  delete(url, ...handlers) {
    this.set("DELETE", url, handlers);
  }
  startServer(port) {
    const server = http.createServer((req, res) => __async(this, null, function* () {
      req.params = {};
      yield this.use(req, res);
    }));
    server.listen(port, () => {
      console.log(`Server started on port: ${port}`);
    });
  }
};
var src_default = Router;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IncomingMessage
});
//# sourceMappingURL=index.js.map