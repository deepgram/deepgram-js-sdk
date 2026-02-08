"use strict";
var Deepgram = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : /* @__PURE__ */ Symbol.for("Symbol." + name);
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __pow = Math.pow;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
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
  var __await = function(promise, isYieldStar) {
    this[0] = promise;
    this[1] = isYieldStar;
  };
  var __yieldStar = (value) => {
    var obj = value[__knownSymbol("asyncIterator")], isAwait = false, method, it = {};
    if (obj == null) {
      obj = value[__knownSymbol("iterator")]();
      method = (k) => it[k] = (x) => obj[k](x);
    } else {
      obj = obj.call(value);
      method = (k) => it[k] = (v) => {
        if (isAwait) {
          isAwait = false;
          if (k === "throw") throw v;
          return v;
        }
        isAwait = true;
        return {
          done: false,
          value: new __await(new Promise((resolve) => {
            var x = obj[k](v);
            if (!(x instanceof Object)) __typeError("Object expected");
            resolve(x);
          }), 1)
        };
      };
    }
    return it[__knownSymbol("iterator")] = () => it, method("next"), "throw" in obj ? method("throw") : it.throw = (x) => {
      throw x;
    }, "return" in obj && method("return"), it;
  };

  // (disabled):fs
  var require_fs = __commonJS({
    "(disabled):fs"() {
      "use strict";
    }
  });

  // node_modules/.pnpm/ws@8.19.0/node_modules/ws/browser.js
  var require_browser = __commonJS({
    "node_modules/.pnpm/ws@8.19.0/node_modules/ws/browser.js"(exports, module) {
      "use strict";
      module.exports = function() {
        throw new Error(
          "ws does not work in the browser. Browser clients must use the native WebSocket object"
        );
      };
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    Deepgram: () => api_exports,
    DeepgramClient: () => CustomDeepgramClient,
    DeepgramEnvironment: () => DeepgramEnvironment,
    DeepgramError: () => DeepgramError,
    DeepgramTimeoutError: () => DeepgramTimeoutError,
    DefaultDeepgramClient: () => DeepgramClient,
    logging: () => logging
  });

  // src/api/index.ts
  var api_exports = {};
  __export(api_exports, {
    Anthropic: () => Anthropic,
    AwsBedrockThinkProvider: () => AwsBedrockThinkProvider,
    AwsPollySpeakProvider: () => AwsPollySpeakProvider,
    BadRequestError: () => BadRequestError,
    Cartesia: () => Cartesia,
    Deepgram: () => Deepgram,
    ElevenLabsSpeakProvider: () => ElevenLabsSpeakProvider,
    Google: () => Google,
    ListBillingFieldsV1Response: () => ListBillingFieldsV1Response,
    ListenV1CallbackMethod: () => ListenV1CallbackMethod,
    ListenV1DetectEntities: () => ListenV1DetectEntities,
    ListenV1Diarize: () => ListenV1Diarize,
    ListenV1Dictation: () => ListenV1Dictation,
    ListenV1Encoding: () => ListenV1Encoding,
    ListenV1InterimResults: () => ListenV1InterimResults,
    ListenV1Model: () => ListenV1Model,
    ListenV1Multichannel: () => ListenV1Multichannel,
    ListenV1Numerals: () => ListenV1Numerals,
    ListenV1ProfanityFilter: () => ListenV1ProfanityFilter,
    ListenV1Punctuate: () => ListenV1Punctuate,
    ListenV1Redact: () => ListenV1Redact,
    ListenV1SmartFormat: () => ListenV1SmartFormat,
    ListenV1VadEvents: () => ListenV1VadEvents,
    ListenV2Encoding: () => ListenV2Encoding,
    OpenAi: () => OpenAi,
    SpeakV1Encoding: () => SpeakV1Encoding,
    SpeakV1Model: () => SpeakV1Model,
    SpeakV1SampleRate: () => SpeakV1SampleRate,
    agent: () => agent_exports,
    auth: () => auth_exports,
    listen: () => listen_exports,
    manage: () => manage_exports,
    read: () => read_exports,
    selfHosted: () => selfHosted_exports,
    speak: () => speak_exports
  });

  // src/core/json.ts
  var toJson = (value, replacer, space) => {
    return JSON.stringify(value, replacer, space);
  };
  function fromJson(text, reviver) {
    return JSON.parse(text, reviver);
  }

  // src/errors/DeepgramError.ts
  var DeepgramError = class extends Error {
    constructor({
      message,
      statusCode,
      body,
      rawResponse
    }) {
      super(buildMessage({ message, statusCode, body }));
      Object.setPrototypeOf(this, new.target.prototype);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      this.body = body;
      this.rawResponse = rawResponse;
    }
  };
  function buildMessage({
    message,
    statusCode,
    body
  }) {
    const lines = [];
    if (message != null) {
      lines.push(message);
    }
    if (statusCode != null) {
      lines.push(`Status code: ${statusCode.toString()}`);
    }
    if (body != null) {
      lines.push(`Body: ${toJson(body, void 0, 2)}`);
    }
    return lines.join("\n");
  }

  // src/errors/DeepgramTimeoutError.ts
  var DeepgramTimeoutError = class extends Error {
    constructor(message) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.name = this.constructor.name;
    }
  };

  // src/api/errors/BadRequestError.ts
  var BadRequestError = class extends DeepgramError {
    constructor(body, rawResponse) {
      super({
        message: "BadRequestError",
        statusCode: 400,
        body,
        rawResponse
      });
      Object.setPrototypeOf(this, new.target.prototype);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.name = this.constructor.name;
    }
  };

  // src/api/resources/agent/index.ts
  var agent_exports = {};
  __export(agent_exports, {
    AgentV1ConversationText: () => AgentV1ConversationText,
    AgentV1Settings: () => AgentV1Settings,
    v1: () => v1_exports
  });

  // src/api/resources/agent/resources/v1/index.ts
  var v1_exports = {};
  __export(v1_exports, {
    AgentV1ConversationText: () => AgentV1ConversationText,
    AgentV1Settings: () => AgentV1Settings,
    settings: () => settings_exports
  });

  // src/api/resources/agent/resources/v1/resources/settings/index.ts
  var settings_exports = {};
  __export(settings_exports, {
    think: () => think_exports
  });

  // src/api/resources/agent/resources/v1/resources/settings/resources/think/index.ts
  var think_exports = {};
  __export(think_exports, {
    models: () => models_exports
  });

  // src/api/resources/agent/resources/v1/resources/settings/resources/think/resources/models/index.ts
  var models_exports = {};

  // src/api/resources/agent/resources/v1/types/AgentV1ConversationText.ts
  var AgentV1ConversationText;
  ((AgentV1ConversationText2) => {
    AgentV1ConversationText2.Role = {
      User: "user",
      Assistant: "assistant"
    };
  })(AgentV1ConversationText || (AgentV1ConversationText = {}));

  // src/api/resources/agent/resources/v1/types/AgentV1Settings.ts
  var AgentV1Settings;
  ((AgentV1Settings2) => {
    let Audio;
    ((Audio2) => {
      let Input;
      ((Input2) => {
        Input2.Encoding = {
          Linear16: "linear16",
          Linear32: "linear32",
          Flac: "flac",
          Alaw: "alaw",
          Mulaw: "mulaw",
          AmrNb: "amr-nb",
          AmrWb: "amr-wb",
          Opus: "opus",
          OggOpus: "ogg-opus",
          Speex: "speex",
          G729: "g729"
        };
      })(Input = Audio2.Input || (Audio2.Input = {}));
      let Output;
      ((Output2) => {
        Output2.Encoding = {
          Linear16: "linear16",
          Mulaw: "mulaw",
          Alaw: "alaw"
        };
      })(Output = Audio2.Output || (Audio2.Output = {}));
    })(Audio = AgentV1Settings2.Audio || (AgentV1Settings2.Audio = {}));
  })(AgentV1Settings || (AgentV1Settings = {}));

  // src/api/resources/auth/index.ts
  var auth_exports = {};
  __export(auth_exports, {
    v1: () => v1_exports2
  });

  // src/api/resources/auth/resources/v1/index.ts
  var v1_exports2 = {};
  __export(v1_exports2, {
    tokens: () => tokens_exports
  });

  // src/api/resources/auth/resources/v1/resources/tokens/index.ts
  var tokens_exports = {};

  // src/api/resources/listen/index.ts
  var listen_exports = {};
  __export(listen_exports, {
    ListenV1CloseStream: () => ListenV1CloseStream,
    ListenV1Finalize: () => ListenV1Finalize,
    ListenV1KeepAlive: () => ListenV1KeepAlive,
    ListenV2CloseStream: () => ListenV2CloseStream,
    ListenV2TurnInfo: () => ListenV2TurnInfo,
    v1: () => v1_exports3,
    v2: () => v2_exports
  });

  // src/api/resources/listen/resources/v1/index.ts
  var v1_exports3 = {};
  __export(v1_exports3, {
    ListenV1CloseStream: () => ListenV1CloseStream,
    ListenV1Finalize: () => ListenV1Finalize,
    ListenV1KeepAlive: () => ListenV1KeepAlive,
    MediaTranscribeRequestCallbackMethod: () => MediaTranscribeRequestCallbackMethod,
    MediaTranscribeRequestCustomIntentMode: () => MediaTranscribeRequestCustomIntentMode,
    MediaTranscribeRequestCustomTopicMode: () => MediaTranscribeRequestCustomTopicMode,
    MediaTranscribeRequestEncoding: () => MediaTranscribeRequestEncoding,
    MediaTranscribeRequestModel: () => MediaTranscribeRequestModel,
    MediaTranscribeRequestSummarize: () => MediaTranscribeRequestSummarize,
    MediaTranscribeRequestVersion: () => MediaTranscribeRequestVersion,
    media: () => media_exports
  });

  // src/api/resources/listen/resources/v1/resources/media/index.ts
  var media_exports = {};
  __export(media_exports, {
    MediaTranscribeRequestCallbackMethod: () => MediaTranscribeRequestCallbackMethod,
    MediaTranscribeRequestCustomIntentMode: () => MediaTranscribeRequestCustomIntentMode,
    MediaTranscribeRequestCustomTopicMode: () => MediaTranscribeRequestCustomTopicMode,
    MediaTranscribeRequestEncoding: () => MediaTranscribeRequestEncoding,
    MediaTranscribeRequestModel: () => MediaTranscribeRequestModel,
    MediaTranscribeRequestSummarize: () => MediaTranscribeRequestSummarize,
    MediaTranscribeRequestVersion: () => MediaTranscribeRequestVersion
  });

  // src/api/resources/listen/resources/v1/resources/media/types/MediaTranscribeRequestCallbackMethod.ts
  var MediaTranscribeRequestCallbackMethod = {
    Post: "POST",
    Put: "PUT"
  };

  // src/api/resources/listen/resources/v1/resources/media/types/MediaTranscribeRequestCustomIntentMode.ts
  var MediaTranscribeRequestCustomIntentMode = {
    Extended: "extended",
    Strict: "strict"
  };

  // src/api/resources/listen/resources/v1/resources/media/types/MediaTranscribeRequestCustomTopicMode.ts
  var MediaTranscribeRequestCustomTopicMode = {
    Extended: "extended",
    Strict: "strict"
  };

  // src/api/resources/listen/resources/v1/resources/media/types/MediaTranscribeRequestEncoding.ts
  var MediaTranscribeRequestEncoding = {
    Linear16: "linear16",
    Flac: "flac",
    Mulaw: "mulaw",
    AmrNb: "amr-nb",
    AmrWb: "amr-wb",
    Opus: "opus",
    Speex: "speex",
    G729: "g729"
  };

  // src/api/resources/listen/resources/v1/resources/media/types/MediaTranscribeRequestModel.ts
  var MediaTranscribeRequestModel = {
    Nova3: "nova-3",
    Nova3General: "nova-3-general",
    Nova3Medical: "nova-3-medical",
    Nova2: "nova-2",
    Nova2General: "nova-2-general",
    Nova2Meeting: "nova-2-meeting",
    Nova2Finance: "nova-2-finance",
    Nova2Conversationalai: "nova-2-conversationalai",
    Nova2Voicemail: "nova-2-voicemail",
    Nova2Video: "nova-2-video",
    Nova2Medical: "nova-2-medical",
    Nova2Drivethru: "nova-2-drivethru",
    Nova2Automotive: "nova-2-automotive",
    Nova: "nova",
    NovaGeneral: "nova-general",
    NovaPhonecall: "nova-phonecall",
    NovaMedical: "nova-medical",
    Enhanced: "enhanced",
    EnhancedGeneral: "enhanced-general",
    EnhancedMeeting: "enhanced-meeting",
    EnhancedPhonecall: "enhanced-phonecall",
    EnhancedFinance: "enhanced-finance",
    Base: "base",
    Meeting: "meeting",
    Phonecall: "phonecall",
    Finance: "finance",
    Conversationalai: "conversationalai",
    Voicemail: "voicemail",
    Video: "video"
  };

  // src/api/resources/listen/resources/v1/resources/media/types/MediaTranscribeRequestSummarize.ts
  var MediaTranscribeRequestSummarize = {
    V2: "v2"
  };

  // src/api/resources/listen/resources/v1/resources/media/types/MediaTranscribeRequestVersion.ts
  var MediaTranscribeRequestVersion = {
    Latest: "latest"
  };

  // src/api/resources/listen/resources/v1/types/ListenV1CloseStream.ts
  var ListenV1CloseStream;
  ((ListenV1CloseStream2) => {
    ListenV1CloseStream2.Type = {
      Finalize: "Finalize",
      CloseStream: "CloseStream",
      KeepAlive: "KeepAlive"
    };
  })(ListenV1CloseStream || (ListenV1CloseStream = {}));

  // src/api/resources/listen/resources/v1/types/ListenV1Finalize.ts
  var ListenV1Finalize;
  ((ListenV1Finalize2) => {
    ListenV1Finalize2.Type = {
      Finalize: "Finalize",
      CloseStream: "CloseStream",
      KeepAlive: "KeepAlive"
    };
  })(ListenV1Finalize || (ListenV1Finalize = {}));

  // src/api/resources/listen/resources/v1/types/ListenV1KeepAlive.ts
  var ListenV1KeepAlive;
  ((ListenV1KeepAlive2) => {
    ListenV1KeepAlive2.Type = {
      Finalize: "Finalize",
      CloseStream: "CloseStream",
      KeepAlive: "KeepAlive"
    };
  })(ListenV1KeepAlive || (ListenV1KeepAlive = {}));

  // src/api/resources/listen/resources/v2/index.ts
  var v2_exports = {};
  __export(v2_exports, {
    ListenV2CloseStream: () => ListenV2CloseStream,
    ListenV2TurnInfo: () => ListenV2TurnInfo
  });

  // src/api/resources/listen/resources/v2/types/ListenV2CloseStream.ts
  var ListenV2CloseStream;
  ((ListenV2CloseStream2) => {
    ListenV2CloseStream2.Type = {
      Finalize: "Finalize",
      CloseStream: "CloseStream",
      KeepAlive: "KeepAlive"
    };
  })(ListenV2CloseStream || (ListenV2CloseStream = {}));

  // src/api/resources/listen/resources/v2/types/ListenV2TurnInfo.ts
  var ListenV2TurnInfo;
  ((ListenV2TurnInfo2) => {
    ListenV2TurnInfo2.Event = {
      Update: "Update",
      StartOfTurn: "StartOfTurn",
      EagerEndOfTurn: "EagerEndOfTurn",
      TurnResumed: "TurnResumed",
      EndOfTurn: "EndOfTurn"
    };
  })(ListenV2TurnInfo || (ListenV2TurnInfo = {}));

  // src/api/resources/manage/index.ts
  var manage_exports = {};
  __export(manage_exports, {
    v1: () => v1_exports4
  });

  // src/api/resources/manage/resources/v1/index.ts
  var v1_exports4 = {};
  __export(v1_exports4, {
    models: () => models_exports2,
    projects: () => projects_exports
  });

  // src/api/resources/manage/resources/v1/resources/models/index.ts
  var models_exports2 = {};

  // src/api/resources/manage/resources/v1/resources/projects/index.ts
  var projects_exports = {};
  __export(projects_exports, {
    KeysListRequestStatus: () => KeysListRequestStatus,
    RequestsListRequestDeployment: () => RequestsListRequestDeployment,
    RequestsListRequestEndpoint: () => RequestsListRequestEndpoint,
    RequestsListRequestMethod: () => RequestsListRequestMethod,
    RequestsListRequestStatus: () => RequestsListRequestStatus,
    UsageGetRequestDeployment: () => UsageGetRequestDeployment,
    UsageGetRequestEndpoint: () => UsageGetRequestEndpoint,
    UsageGetRequestMethod: () => UsageGetRequestMethod,
    billing: () => billing_exports,
    keys: () => keys_exports,
    members: () => members_exports,
    models: () => models_exports3,
    requests: () => requests_exports,
    usage: () => usage_exports
  });

  // src/api/resources/manage/resources/v1/resources/projects/resources/billing/index.ts
  var billing_exports = {};
  __export(billing_exports, {
    BreakdownListRequestDeployment: () => BreakdownListRequestDeployment,
    BreakdownListRequestGroupingItem: () => BreakdownListRequestGroupingItem,
    balances: () => balances_exports,
    breakdown: () => breakdown_exports,
    fields: () => fields_exports,
    purchases: () => purchases_exports
  });

  // src/api/resources/manage/resources/v1/resources/projects/resources/billing/resources/balances/index.ts
  var balances_exports = {};

  // src/api/resources/manage/resources/v1/resources/projects/resources/billing/resources/breakdown/index.ts
  var breakdown_exports = {};
  __export(breakdown_exports, {
    BreakdownListRequestDeployment: () => BreakdownListRequestDeployment,
    BreakdownListRequestGroupingItem: () => BreakdownListRequestGroupingItem
  });

  // src/api/resources/manage/resources/v1/resources/projects/resources/billing/resources/breakdown/types/BreakdownListRequestDeployment.ts
  var BreakdownListRequestDeployment = {
    Hosted: "hosted",
    Beta: "beta",
    SelfHosted: "self-hosted"
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/billing/resources/breakdown/types/BreakdownListRequestGroupingItem.ts
  var BreakdownListRequestGroupingItem = {
    Accessor: "accessor",
    Deployment: "deployment",
    LineItem: "line_item",
    Tags: "tags"
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/billing/resources/fields/index.ts
  var fields_exports = {};

  // src/api/resources/manage/resources/v1/resources/projects/resources/billing/resources/purchases/index.ts
  var purchases_exports = {};

  // src/api/resources/manage/resources/v1/resources/projects/resources/keys/index.ts
  var keys_exports = {};
  __export(keys_exports, {
    KeysListRequestStatus: () => KeysListRequestStatus
  });

  // src/api/resources/manage/resources/v1/resources/projects/resources/keys/types/KeysListRequestStatus.ts
  var KeysListRequestStatus = {
    Active: "active",
    Expired: "expired"
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/members/index.ts
  var members_exports = {};
  __export(members_exports, {
    invites: () => invites_exports,
    scopes: () => scopes_exports
  });

  // src/api/resources/manage/resources/v1/resources/projects/resources/members/resources/invites/index.ts
  var invites_exports = {};

  // src/api/resources/manage/resources/v1/resources/projects/resources/members/resources/scopes/index.ts
  var scopes_exports = {};

  // src/api/resources/manage/resources/v1/resources/projects/resources/models/index.ts
  var models_exports3 = {};

  // src/api/resources/manage/resources/v1/resources/projects/resources/requests/index.ts
  var requests_exports = {};
  __export(requests_exports, {
    RequestsListRequestDeployment: () => RequestsListRequestDeployment,
    RequestsListRequestEndpoint: () => RequestsListRequestEndpoint,
    RequestsListRequestMethod: () => RequestsListRequestMethod,
    RequestsListRequestStatus: () => RequestsListRequestStatus
  });

  // src/api/resources/manage/resources/v1/resources/projects/resources/requests/types/RequestsListRequestDeployment.ts
  var RequestsListRequestDeployment = {
    Hosted: "hosted",
    Beta: "beta",
    SelfHosted: "self-hosted"
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/requests/types/RequestsListRequestEndpoint.ts
  var RequestsListRequestEndpoint = {
    Listen: "listen",
    Read: "read",
    Speak: "speak",
    Agent: "agent"
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/requests/types/RequestsListRequestMethod.ts
  var RequestsListRequestMethod = {
    Sync: "sync",
    Async: "async",
    Streaming: "streaming"
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/requests/types/RequestsListRequestStatus.ts
  var RequestsListRequestStatus = {
    Succeeded: "succeeded",
    Failed: "failed"
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/usage/index.ts
  var usage_exports = {};
  __export(usage_exports, {
    BreakdownGetRequestDeployment: () => BreakdownGetRequestDeployment,
    BreakdownGetRequestEndpoint: () => BreakdownGetRequestEndpoint,
    BreakdownGetRequestGrouping: () => BreakdownGetRequestGrouping,
    BreakdownGetRequestMethod: () => BreakdownGetRequestMethod,
    UsageGetRequestDeployment: () => UsageGetRequestDeployment,
    UsageGetRequestEndpoint: () => UsageGetRequestEndpoint,
    UsageGetRequestMethod: () => UsageGetRequestMethod,
    breakdown: () => breakdown_exports2,
    fields: () => fields_exports2
  });

  // src/api/resources/manage/resources/v1/resources/projects/resources/usage/resources/breakdown/index.ts
  var breakdown_exports2 = {};
  __export(breakdown_exports2, {
    BreakdownGetRequestDeployment: () => BreakdownGetRequestDeployment,
    BreakdownGetRequestEndpoint: () => BreakdownGetRequestEndpoint,
    BreakdownGetRequestGrouping: () => BreakdownGetRequestGrouping,
    BreakdownGetRequestMethod: () => BreakdownGetRequestMethod
  });

  // src/api/resources/manage/resources/v1/resources/projects/resources/usage/resources/breakdown/types/BreakdownGetRequestDeployment.ts
  var BreakdownGetRequestDeployment = {
    Hosted: "hosted",
    Beta: "beta",
    SelfHosted: "self-hosted"
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/usage/resources/breakdown/types/BreakdownGetRequestEndpoint.ts
  var BreakdownGetRequestEndpoint = {
    Listen: "listen",
    Read: "read",
    Speak: "speak",
    Agent: "agent"
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/usage/resources/breakdown/types/BreakdownGetRequestGrouping.ts
  var BreakdownGetRequestGrouping = {
    Accessor: "accessor",
    Endpoint: "endpoint",
    FeatureSet: "feature_set",
    Models: "models",
    Method: "method",
    Tags: "tags",
    Deployment: "deployment"
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/usage/resources/breakdown/types/BreakdownGetRequestMethod.ts
  var BreakdownGetRequestMethod = {
    Sync: "sync",
    Async: "async",
    Streaming: "streaming"
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/usage/resources/fields/index.ts
  var fields_exports2 = {};

  // src/api/resources/manage/resources/v1/resources/projects/resources/usage/types/UsageGetRequestDeployment.ts
  var UsageGetRequestDeployment = {
    Hosted: "hosted",
    Beta: "beta",
    SelfHosted: "self-hosted"
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/usage/types/UsageGetRequestEndpoint.ts
  var UsageGetRequestEndpoint = {
    Listen: "listen",
    Read: "read",
    Speak: "speak",
    Agent: "agent"
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/usage/types/UsageGetRequestMethod.ts
  var UsageGetRequestMethod = {
    Sync: "sync",
    Async: "async",
    Streaming: "streaming"
  };

  // src/api/resources/read/index.ts
  var read_exports = {};
  __export(read_exports, {
    v1: () => v1_exports5
  });

  // src/api/resources/read/resources/v1/index.ts
  var v1_exports5 = {};
  __export(v1_exports5, {
    TextAnalyzeRequestCallbackMethod: () => TextAnalyzeRequestCallbackMethod,
    TextAnalyzeRequestCustomIntentMode: () => TextAnalyzeRequestCustomIntentMode,
    TextAnalyzeRequestCustomTopicMode: () => TextAnalyzeRequestCustomTopicMode,
    TextAnalyzeRequestSummarize: () => TextAnalyzeRequestSummarize,
    text: () => text_exports
  });

  // src/api/resources/read/resources/v1/resources/text/index.ts
  var text_exports = {};
  __export(text_exports, {
    TextAnalyzeRequestCallbackMethod: () => TextAnalyzeRequestCallbackMethod,
    TextAnalyzeRequestCustomIntentMode: () => TextAnalyzeRequestCustomIntentMode,
    TextAnalyzeRequestCustomTopicMode: () => TextAnalyzeRequestCustomTopicMode,
    TextAnalyzeRequestSummarize: () => TextAnalyzeRequestSummarize
  });

  // src/api/resources/read/resources/v1/resources/text/types/TextAnalyzeRequestCallbackMethod.ts
  var TextAnalyzeRequestCallbackMethod = {
    Post: "POST",
    Put: "PUT"
  };

  // src/api/resources/read/resources/v1/resources/text/types/TextAnalyzeRequestCustomIntentMode.ts
  var TextAnalyzeRequestCustomIntentMode = {
    Extended: "extended",
    Strict: "strict"
  };

  // src/api/resources/read/resources/v1/resources/text/types/TextAnalyzeRequestCustomTopicMode.ts
  var TextAnalyzeRequestCustomTopicMode = {
    Extended: "extended",
    Strict: "strict"
  };

  // src/api/resources/read/resources/v1/resources/text/types/TextAnalyzeRequestSummarize.ts
  var TextAnalyzeRequestSummarize = {
    V2: "v2"
  };

  // src/api/resources/selfHosted/index.ts
  var selfHosted_exports = {};
  __export(selfHosted_exports, {
    v1: () => v1_exports6
  });

  // src/api/resources/selfHosted/resources/v1/index.ts
  var v1_exports6 = {};
  __export(v1_exports6, {
    DistributionCredentialsCreateRequestScopesItem: () => DistributionCredentialsCreateRequestScopesItem,
    distributionCredentials: () => distributionCredentials_exports
  });

  // src/api/resources/selfHosted/resources/v1/resources/distributionCredentials/index.ts
  var distributionCredentials_exports = {};
  __export(distributionCredentials_exports, {
    DistributionCredentialsCreateRequestScopesItem: () => DistributionCredentialsCreateRequestScopesItem
  });

  // src/api/resources/selfHosted/resources/v1/resources/distributionCredentials/types/DistributionCredentialsCreateRequestScopesItem.ts
  var DistributionCredentialsCreateRequestScopesItem = {
    SelfHostedProducts: "self-hosted:products",
    SelfHostedProductApi: "self-hosted:product:api",
    SelfHostedProductEngine: "self-hosted:product:engine",
    SelfHostedProductLicenseProxy: "self-hosted:product:license-proxy",
    SelfHostedProductDgtools: "self-hosted:product:dgtools",
    SelfHostedProductBilling: "self-hosted:product:billing",
    SelfHostedProductHotpepper: "self-hosted:product:hotpepper",
    SelfHostedProductMetricsServer: "self-hosted:product:metrics-server"
  };

  // src/api/resources/speak/index.ts
  var speak_exports = {};
  __export(speak_exports, {
    SpeakV1Clear: () => SpeakV1Clear,
    SpeakV1Cleared: () => SpeakV1Cleared,
    SpeakV1Close: () => SpeakV1Close,
    SpeakV1Flush: () => SpeakV1Flush,
    SpeakV1Flushed: () => SpeakV1Flushed,
    v1: () => v1_exports7
  });

  // src/api/resources/speak/resources/v1/index.ts
  var v1_exports7 = {};
  __export(v1_exports7, {
    AudioGenerateRequestCallbackMethod: () => AudioGenerateRequestCallbackMethod,
    AudioGenerateRequestContainer: () => AudioGenerateRequestContainer,
    AudioGenerateRequestEncoding: () => AudioGenerateRequestEncoding,
    AudioGenerateRequestModel: () => AudioGenerateRequestModel,
    SpeakV1Clear: () => SpeakV1Clear,
    SpeakV1Cleared: () => SpeakV1Cleared,
    SpeakV1Close: () => SpeakV1Close,
    SpeakV1Flush: () => SpeakV1Flush,
    SpeakV1Flushed: () => SpeakV1Flushed,
    audio: () => audio_exports
  });

  // src/api/resources/speak/resources/v1/resources/audio/index.ts
  var audio_exports = {};
  __export(audio_exports, {
    AudioGenerateRequestCallbackMethod: () => AudioGenerateRequestCallbackMethod,
    AudioGenerateRequestContainer: () => AudioGenerateRequestContainer,
    AudioGenerateRequestEncoding: () => AudioGenerateRequestEncoding,
    AudioGenerateRequestModel: () => AudioGenerateRequestModel
  });

  // src/api/resources/speak/resources/v1/resources/audio/types/AudioGenerateRequestCallbackMethod.ts
  var AudioGenerateRequestCallbackMethod = {
    Post: "POST",
    Put: "PUT"
  };

  // src/api/resources/speak/resources/v1/resources/audio/types/AudioGenerateRequestContainer.ts
  var AudioGenerateRequestContainer = {
    None: "none",
    Wav: "wav",
    Ogg: "ogg"
  };

  // src/api/resources/speak/resources/v1/resources/audio/types/AudioGenerateRequestEncoding.ts
  var AudioGenerateRequestEncoding = {
    Linear16: "linear16",
    Flac: "flac",
    Mulaw: "mulaw",
    Alaw: "alaw",
    Mp3: "mp3",
    Opus: "opus",
    Aac: "aac"
  };

  // src/api/resources/speak/resources/v1/resources/audio/types/AudioGenerateRequestModel.ts
  var AudioGenerateRequestModel = {
    AuraAsteriaEn: "aura-asteria-en",
    AuraLunaEn: "aura-luna-en",
    AuraStellaEn: "aura-stella-en",
    AuraAthenaEn: "aura-athena-en",
    AuraHeraEn: "aura-hera-en",
    AuraOrionEn: "aura-orion-en",
    AuraArcasEn: "aura-arcas-en",
    AuraPerseusEn: "aura-perseus-en",
    AuraAngusEn: "aura-angus-en",
    AuraOrpheusEn: "aura-orpheus-en",
    AuraHeliosEn: "aura-helios-en",
    AuraZeusEn: "aura-zeus-en",
    Aura2AmaltheaEn: "aura-2-amalthea-en",
    Aura2AndromedaEn: "aura-2-andromeda-en",
    Aura2ApolloEn: "aura-2-apollo-en",
    Aura2ArcasEn: "aura-2-arcas-en",
    Aura2AriesEn: "aura-2-aries-en",
    Aura2AsteriaEn: "aura-2-asteria-en",
    Aura2AthenaEn: "aura-2-athena-en",
    Aura2AtlasEn: "aura-2-atlas-en",
    Aura2AuroraEn: "aura-2-aurora-en",
    Aura2CallistaEn: "aura-2-callista-en",
    Aura2CordeliaEn: "aura-2-cordelia-en",
    Aura2CoraEn: "aura-2-cora-en",
    Aura2DeliaEn: "aura-2-delia-en",
    Aura2DracoEn: "aura-2-draco-en",
    Aura2ElectraEn: "aura-2-electra-en",
    Aura2HarmoniaEn: "aura-2-harmonia-en",
    Aura2HelenaEn: "aura-2-helena-en",
    Aura2HeraEn: "aura-2-hera-en",
    Aura2HermesEn: "aura-2-hermes-en",
    Aura2HyperionEn: "aura-2-hyperion-en",
    Aura2IrisEn: "aura-2-iris-en",
    Aura2JanusEn: "aura-2-janus-en",
    Aura2JunoEn: "aura-2-juno-en",
    Aura2JupiterEn: "aura-2-jupiter-en",
    Aura2LunaEn: "aura-2-luna-en",
    Aura2MarsEn: "aura-2-mars-en",
    Aura2MinervaEn: "aura-2-minerva-en",
    Aura2NeptuneEn: "aura-2-neptune-en",
    Aura2OdysseusEn: "aura-2-odysseus-en",
    Aura2OpheliaEn: "aura-2-ophelia-en",
    Aura2OrionEn: "aura-2-orion-en",
    Aura2OrpheusEn: "aura-2-orpheus-en",
    Aura2PandoraEn: "aura-2-pandora-en",
    Aura2PhoebeEn: "aura-2-phoebe-en",
    Aura2PlutoEn: "aura-2-pluto-en",
    Aura2SaturnEn: "aura-2-saturn-en",
    Aura2SeleneEn: "aura-2-selene-en",
    Aura2ThaliaEn: "aura-2-thalia-en",
    Aura2TheiaEn: "aura-2-theia-en",
    Aura2VestaEn: "aura-2-vesta-en",
    Aura2ZeusEn: "aura-2-zeus-en",
    Aura2SirioEs: "aura-2-sirio-es",
    Aura2NestorEs: "aura-2-nestor-es",
    Aura2CarinaEs: "aura-2-carina-es",
    Aura2CelesteEs: "aura-2-celeste-es",
    Aura2AlvaroEs: "aura-2-alvaro-es",
    Aura2DianaEs: "aura-2-diana-es",
    Aura2AquilaEs: "aura-2-aquila-es",
    Aura2SelenaEs: "aura-2-selena-es",
    Aura2EstrellaEs: "aura-2-estrella-es",
    Aura2JavierEs: "aura-2-javier-es"
  };

  // src/api/resources/speak/resources/v1/types/SpeakV1Clear.ts
  var SpeakV1Clear;
  ((SpeakV1Clear2) => {
    SpeakV1Clear2.Type = {
      Flush: "Flush",
      Clear: "Clear",
      Close: "Close"
    };
  })(SpeakV1Clear || (SpeakV1Clear = {}));

  // src/api/resources/speak/resources/v1/types/SpeakV1Cleared.ts
  var SpeakV1Cleared;
  ((SpeakV1Cleared2) => {
    SpeakV1Cleared2.Type = {
      Flushed: "Flushed",
      Cleared: "Cleared"
    };
  })(SpeakV1Cleared || (SpeakV1Cleared = {}));

  // src/api/resources/speak/resources/v1/types/SpeakV1Close.ts
  var SpeakV1Close;
  ((SpeakV1Close2) => {
    SpeakV1Close2.Type = {
      Flush: "Flush",
      Clear: "Clear",
      Close: "Close"
    };
  })(SpeakV1Close || (SpeakV1Close = {}));

  // src/api/resources/speak/resources/v1/types/SpeakV1Flush.ts
  var SpeakV1Flush;
  ((SpeakV1Flush2) => {
    SpeakV1Flush2.Type = {
      Flush: "Flush",
      Clear: "Clear",
      Close: "Close"
    };
  })(SpeakV1Flush || (SpeakV1Flush = {}));

  // src/api/resources/speak/resources/v1/types/SpeakV1Flushed.ts
  var SpeakV1Flushed;
  ((SpeakV1Flushed2) => {
    SpeakV1Flushed2.Type = {
      Flushed: "Flushed",
      Cleared: "Cleared"
    };
  })(SpeakV1Flushed || (SpeakV1Flushed = {}));

  // src/api/types/Anthropic.ts
  var Anthropic;
  ((Anthropic2) => {
    Anthropic2.Model = {
      Claude35HaikuLatest: "claude-3-5-haiku-latest",
      ClaudeSonnet420250514: "claude-sonnet-4-20250514"
    };
  })(Anthropic || (Anthropic = {}));

  // src/api/types/AwsBedrockThinkProvider.ts
  var AwsBedrockThinkProvider;
  ((AwsBedrockThinkProvider2) => {
    AwsBedrockThinkProvider2.Model = {
      AnthropicClaude35Sonnet20240620V10: "anthropic/claude-3-5-sonnet-20240620-v1:0",
      AnthropicClaude35Haiku20240307V10: "anthropic/claude-3-5-haiku-20240307-v1:0"
    };
    let Credentials;
    ((Credentials2) => {
      Credentials2.Type = {
        Sts: "sts",
        Iam: "iam"
      };
    })(Credentials = AwsBedrockThinkProvider2.Credentials || (AwsBedrockThinkProvider2.Credentials = {}));
  })(AwsBedrockThinkProvider || (AwsBedrockThinkProvider = {}));

  // src/api/types/AwsPollySpeakProvider.ts
  var AwsPollySpeakProvider;
  ((AwsPollySpeakProvider2) => {
    AwsPollySpeakProvider2.Voice = {
      Matthew: "Matthew",
      Joanna: "Joanna",
      Amy: "Amy",
      Emma: "Emma",
      Brian: "Brian",
      Arthur: "Arthur",
      Aria: "Aria",
      Ayanda: "Ayanda"
    };
    AwsPollySpeakProvider2.Engine = {
      Generative: "generative",
      LongForm: "long-form",
      Standard: "standard",
      Neural: "neural"
    };
    let Credentials;
    ((Credentials2) => {
      Credentials2.Type = {
        Sts: "sts",
        Iam: "iam"
      };
    })(Credentials = AwsPollySpeakProvider2.Credentials || (AwsPollySpeakProvider2.Credentials = {}));
  })(AwsPollySpeakProvider || (AwsPollySpeakProvider = {}));

  // src/api/types/Cartesia.ts
  var Cartesia;
  ((Cartesia2) => {
    Cartesia2.ModelId = {
      Sonic2: "sonic-2",
      SonicMultilingual: "sonic-multilingual"
    };
  })(Cartesia || (Cartesia = {}));

  // src/api/types/Deepgram.ts
  var Deepgram;
  ((Deepgram2) => {
    Deepgram2.Model = {
      AuraAsteriaEn: "aura-asteria-en",
      AuraLunaEn: "aura-luna-en",
      AuraStellaEn: "aura-stella-en",
      AuraAthenaEn: "aura-athena-en",
      AuraHeraEn: "aura-hera-en",
      AuraOrionEn: "aura-orion-en",
      AuraArcasEn: "aura-arcas-en",
      AuraPerseusEn: "aura-perseus-en",
      AuraAngusEn: "aura-angus-en",
      AuraOrpheusEn: "aura-orpheus-en",
      AuraHeliosEn: "aura-helios-en",
      AuraZeusEn: "aura-zeus-en",
      Aura2AmaltheaEn: "aura-2-amalthea-en",
      Aura2AndromedaEn: "aura-2-andromeda-en",
      Aura2ApolloEn: "aura-2-apollo-en",
      Aura2ArcasEn: "aura-2-arcas-en",
      Aura2AriesEn: "aura-2-aries-en",
      Aura2AsteriaEn: "aura-2-asteria-en",
      Aura2AthenaEn: "aura-2-athena-en",
      Aura2AtlasEn: "aura-2-atlas-en",
      Aura2AuroraEn: "aura-2-aurora-en",
      Aura2CallistaEn: "aura-2-callista-en",
      Aura2CoraEn: "aura-2-cora-en",
      Aura2CordeliaEn: "aura-2-cordelia-en",
      Aura2DeliaEn: "aura-2-delia-en",
      Aura2DracoEn: "aura-2-draco-en",
      Aura2ElectraEn: "aura-2-electra-en",
      Aura2HarmoniaEn: "aura-2-harmonia-en",
      Aura2HelenaEn: "aura-2-helena-en",
      Aura2HeraEn: "aura-2-hera-en",
      Aura2HermesEn: "aura-2-hermes-en",
      Aura2HyperionEn: "aura-2-hyperion-en",
      Aura2IrisEn: "aura-2-iris-en",
      Aura2JanusEn: "aura-2-janus-en",
      Aura2JunoEn: "aura-2-juno-en",
      Aura2JupiterEn: "aura-2-jupiter-en",
      Aura2LunaEn: "aura-2-luna-en",
      Aura2MarsEn: "aura-2-mars-en",
      Aura2MinervaEn: "aura-2-minerva-en",
      Aura2NeptuneEn: "aura-2-neptune-en",
      Aura2OdysseusEn: "aura-2-odysseus-en",
      Aura2OpheliaEn: "aura-2-ophelia-en",
      Aura2OrionEn: "aura-2-orion-en",
      Aura2OrpheusEn: "aura-2-orpheus-en",
      Aura2PandoraEn: "aura-2-pandora-en",
      Aura2PhoebeEn: "aura-2-phoebe-en",
      Aura2PlutoEn: "aura-2-pluto-en",
      Aura2SaturnEn: "aura-2-saturn-en",
      Aura2SeleneEn: "aura-2-selene-en",
      Aura2ThaliaEn: "aura-2-thalia-en",
      Aura2TheiaEn: "aura-2-theia-en",
      Aura2VestaEn: "aura-2-vesta-en",
      Aura2ZeusEn: "aura-2-zeus-en",
      Aura2SirioEs: "aura-2-sirio-es",
      Aura2NestorEs: "aura-2-nestor-es",
      Aura2CarinaEs: "aura-2-carina-es",
      Aura2CelesteEs: "aura-2-celeste-es",
      Aura2AlvaroEs: "aura-2-alvaro-es",
      Aura2DianaEs: "aura-2-diana-es",
      Aura2AquilaEs: "aura-2-aquila-es",
      Aura2SelenaEs: "aura-2-selena-es",
      Aura2EstrellaEs: "aura-2-estrella-es",
      Aura2JavierEs: "aura-2-javier-es"
    };
  })(Deepgram || (Deepgram = {}));

  // src/api/types/ElevenLabsSpeakProvider.ts
  var ElevenLabsSpeakProvider;
  ((ElevenLabsSpeakProvider2) => {
    ElevenLabsSpeakProvider2.ModelId = {
      ElevenTurboV25: "eleven_turbo_v2_5",
      ElevenMonolingualV1: "eleven_monolingual_v1",
      ElevenMultilingualV2: "eleven_multilingual_v2"
    };
  })(ElevenLabsSpeakProvider || (ElevenLabsSpeakProvider = {}));

  // src/api/types/Google.ts
  var Google;
  ((Google2) => {
    Google2.Model = {
      Gemini20Flash: "gemini-2.0-flash",
      Gemini20FlashLite: "gemini-2.0-flash-lite",
      Gemini25Flash: "gemini-2.5-flash"
    };
  })(Google || (Google = {}));

  // src/api/types/ListBillingFieldsV1Response.ts
  var ListBillingFieldsV1Response;
  ((ListBillingFieldsV1Response2) => {
    let Deployments;
    ((Deployments2) => {
      Deployments2.Item = {
        Hosted: "hosted",
        Beta: "beta",
        SelfHosted: "self-hosted",
        Dedicated: "dedicated"
      };
    })(Deployments = ListBillingFieldsV1Response2.Deployments || (ListBillingFieldsV1Response2.Deployments = {}));
  })(ListBillingFieldsV1Response || (ListBillingFieldsV1Response = {}));

  // src/api/types/ListenV1CallbackMethod.ts
  var ListenV1CallbackMethod = {
    Post: "POST",
    Get: "GET",
    Put: "PUT",
    Delete: "DELETE"
  };

  // src/api/types/ListenV1DetectEntities.ts
  var ListenV1DetectEntities = {
    True: "true",
    False: "false"
  };

  // src/api/types/ListenV1Diarize.ts
  var ListenV1Diarize = {
    True: "true",
    False: "false"
  };

  // src/api/types/ListenV1Dictation.ts
  var ListenV1Dictation = {
    True: "true",
    False: "false"
  };

  // src/api/types/ListenV1Encoding.ts
  var ListenV1Encoding = {
    Linear16: "linear16",
    Linear32: "linear32",
    Flac: "flac",
    Alaw: "alaw",
    Mulaw: "mulaw",
    AmrNb: "amr-nb",
    AmrWb: "amr-wb",
    Opus: "opus",
    OggOpus: "ogg-opus",
    Speex: "speex",
    G729: "g729"
  };

  // src/api/types/ListenV1InterimResults.ts
  var ListenV1InterimResults = {
    True: "true",
    False: "false"
  };

  // src/api/types/ListenV1Model.ts
  var ListenV1Model = {
    Nova3: "nova-3",
    Nova3General: "nova-3-general",
    Nova3Medical: "nova-3-medical",
    Nova2: "nova-2",
    Nova2General: "nova-2-general",
    Nova2Meeting: "nova-2-meeting",
    Nova2Finance: "nova-2-finance",
    Nova2Conversationalai: "nova-2-conversationalai",
    Nova2Voicemail: "nova-2-voicemail",
    Nova2Video: "nova-2-video",
    Nova2Medical: "nova-2-medical",
    Nova2Drivethru: "nova-2-drivethru",
    Nova2Automotive: "nova-2-automotive",
    Nova: "nova",
    NovaGeneral: "nova-general",
    NovaPhonecall: "nova-phonecall",
    NovaMedical: "nova-medical",
    Enhanced: "enhanced",
    EnhancedGeneral: "enhanced-general",
    EnhancedMeeting: "enhanced-meeting",
    EnhancedPhonecall: "enhanced-phonecall",
    EnhancedFinance: "enhanced-finance",
    Base: "base",
    Meeting: "meeting",
    Phonecall: "phonecall",
    Finance: "finance",
    Conversationalai: "conversationalai",
    Voicemail: "voicemail",
    Video: "video",
    Custom: "custom"
  };

  // src/api/types/ListenV1Multichannel.ts
  var ListenV1Multichannel = {
    True: "true",
    False: "false"
  };

  // src/api/types/ListenV1Numerals.ts
  var ListenV1Numerals = {
    True: "true",
    False: "false"
  };

  // src/api/types/ListenV1ProfanityFilter.ts
  var ListenV1ProfanityFilter = {
    True: "true",
    False: "false"
  };

  // src/api/types/ListenV1Punctuate.ts
  var ListenV1Punctuate = {
    True: "true",
    False: "false"
  };

  // src/api/types/ListenV1Redact.ts
  var ListenV1Redact = {
    True: "true",
    False: "false",
    Pci: "pci",
    Numbers: "numbers",
    AggressiveNumbers: "aggressive_numbers",
    Ssn: "ssn"
  };

  // src/api/types/ListenV1SmartFormat.ts
  var ListenV1SmartFormat = {
    True: "true",
    False: "false"
  };

  // src/api/types/ListenV1VadEvents.ts
  var ListenV1VadEvents = {
    True: "true",
    False: "false"
  };

  // src/api/types/ListenV2Encoding.ts
  var ListenV2Encoding = {
    Linear16: "linear16",
    Linear32: "linear32",
    Mulaw: "mulaw",
    Alaw: "alaw",
    Opus: "opus",
    OggOpus: "ogg-opus"
  };

  // src/api/types/OpenAi.ts
  var OpenAi;
  ((OpenAi2) => {
    OpenAi2.Model = {
      Tts1: "tts-1",
      Tts1Hd: "tts-1-hd"
    };
    OpenAi2.Voice = {
      Alloy: "alloy",
      Echo: "echo",
      Fable: "fable",
      Onyx: "onyx",
      Nova: "nova",
      Shimmer: "shimmer"
    };
  })(OpenAi || (OpenAi = {}));

  // src/api/types/SpeakV1Encoding.ts
  var SpeakV1Encoding = {
    Linear16: "linear16",
    Mulaw: "mulaw",
    Alaw: "alaw"
  };

  // src/api/types/SpeakV1Model.ts
  var SpeakV1Model = {
    AuraAsteriaEn: "aura-asteria-en",
    AuraLunaEn: "aura-luna-en",
    AuraStellaEn: "aura-stella-en",
    AuraAthenaEn: "aura-athena-en",
    AuraHeraEn: "aura-hera-en",
    AuraOrionEn: "aura-orion-en",
    AuraArcasEn: "aura-arcas-en",
    AuraPerseusEn: "aura-perseus-en",
    AuraAngusEn: "aura-angus-en",
    AuraOrpheusEn: "aura-orpheus-en",
    AuraHeliosEn: "aura-helios-en",
    AuraZeusEn: "aura-zeus-en",
    Aura2AmaltheaEn: "aura-2-amalthea-en",
    Aura2AndromedaEn: "aura-2-andromeda-en",
    Aura2ApolloEn: "aura-2-apollo-en",
    Aura2ArcasEn: "aura-2-arcas-en",
    Aura2AriesEn: "aura-2-aries-en",
    Aura2AsteriaEn: "aura-2-asteria-en",
    Aura2AthenaEn: "aura-2-athena-en",
    Aura2AtlasEn: "aura-2-atlas-en",
    Aura2AuroraEn: "aura-2-aurora-en",
    Aura2CallistaEn: "aura-2-callista-en",
    Aura2CordeliaEn: "aura-2-cordelia-en",
    Aura2CoraEn: "aura-2-cora-en",
    Aura2DeliaEn: "aura-2-delia-en",
    Aura2DracoEn: "aura-2-draco-en",
    Aura2ElectraEn: "aura-2-electra-en",
    Aura2HarmoniaEn: "aura-2-harmonia-en",
    Aura2HelenaEn: "aura-2-helena-en",
    Aura2HeraEn: "aura-2-hera-en",
    Aura2HermesEn: "aura-2-hermes-en",
    Aura2HyperionEn: "aura-2-hyperion-en",
    Aura2IrisEn: "aura-2-iris-en",
    Aura2JanusEn: "aura-2-janus-en",
    Aura2JunoEn: "aura-2-juno-en",
    Aura2JupiterEn: "aura-2-jupiter-en",
    Aura2LunaEn: "aura-2-luna-en",
    Aura2MarsEn: "aura-2-mars-en",
    Aura2MinervaEn: "aura-2-minerva-en",
    Aura2NeptuneEn: "aura-2-neptune-en",
    Aura2OdysseusEn: "aura-2-odysseus-en",
    Aura2OpheliaEn: "aura-2-ophelia-en",
    Aura2OrionEn: "aura-2-orion-en",
    Aura2OrpheusEn: "aura-2-orpheus-en",
    Aura2PandoraEn: "aura-2-pandora-en",
    Aura2PhoebeEn: "aura-2-phoebe-en",
    Aura2PlutoEn: "aura-2-pluto-en",
    Aura2SaturnEn: "aura-2-saturn-en",
    Aura2SeleneEn: "aura-2-selene-en",
    Aura2ThaliaEn: "aura-2-thalia-en",
    Aura2TheiaEn: "aura-2-theia-en",
    Aura2VestaEn: "aura-2-vesta-en",
    Aura2ZeusEn: "aura-2-zeus-en",
    Aura2SirioEs: "aura-2-sirio-es",
    Aura2NestorEs: "aura-2-nestor-es",
    Aura2CarinaEs: "aura-2-carina-es",
    Aura2CelesteEs: "aura-2-celeste-es",
    Aura2AlvaroEs: "aura-2-alvaro-es",
    Aura2DianaEs: "aura-2-diana-es",
    Aura2AquilaEs: "aura-2-aquila-es",
    Aura2SelenaEs: "aura-2-selena-es",
    Aura2EstrellaEs: "aura-2-estrella-es",
    Aura2JavierEs: "aura-2-javier-es"
  };

  // src/api/types/SpeakV1SampleRate.ts
  var SpeakV1SampleRate = {
    EightThousand: "8000",
    SixteenThousand: "16000",
    TwentyFourThousand: "24000",
    ThirtyTwoThousand: "32000",
    FortyEightThousand: "48000"
  };

  // src/core/auth/NoOpAuthProvider.ts
  var NoOpAuthProvider = class {
    getAuthRequest() {
      return Promise.resolve({ headers: {} });
    }
  };

  // src/core/fetcher/EndpointSupplier.ts
  var EndpointSupplier = {
    get: (supplier, arg) => __async(null, null, function* () {
      if (typeof supplier === "function") {
        return supplier(arg);
      } else {
        return supplier;
      }
    })
  };

  // src/core/logging/logger.ts
  var LogLevel = {
    Debug: "debug",
    Info: "info",
    Warn: "warn",
    Error: "error"
  };
  var logLevelMap = {
    [LogLevel.Debug]: 1,
    [LogLevel.Info]: 2,
    [LogLevel.Warn]: 3,
    [LogLevel.Error]: 4
  };
  var ConsoleLogger = class {
    debug(message, ...args) {
      console.debug(message, ...args);
    }
    info(message, ...args) {
      console.info(message, ...args);
    }
    warn(message, ...args) {
      console.warn(message, ...args);
    }
    error(message, ...args) {
      console.error(message, ...args);
    }
  };
  var Logger = class {
    /**
     * Creates a new logger instance.
     * @param config - Logger configuration
     */
    constructor(config) {
      this.level = logLevelMap[config.level];
      this.logger = config.logger;
      this.silent = config.silent;
    }
    /**
     * Checks if a log level should be output based on configuration.
     * @param level - The log level to check
     * @returns True if the level should be logged
     */
    shouldLog(level) {
      return !this.silent && this.level <= logLevelMap[level];
    }
    /**
     * Checks if debug logging is enabled.
     * @returns True if debug logs should be output
     */
    isDebug() {
      return this.shouldLog(LogLevel.Debug);
    }
    /**
     * Logs a debug message if debug logging is enabled.
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    debug(message, ...args) {
      if (this.isDebug()) {
        this.logger.debug(message, ...args);
      }
    }
    /**
     * Checks if info logging is enabled.
     * @returns True if info logs should be output
     */
    isInfo() {
      return this.shouldLog(LogLevel.Info);
    }
    /**
     * Logs an info message if info logging is enabled.
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    info(message, ...args) {
      if (this.isInfo()) {
        this.logger.info(message, ...args);
      }
    }
    /**
     * Checks if warning logging is enabled.
     * @returns True if warning logs should be output
     */
    isWarn() {
      return this.shouldLog(LogLevel.Warn);
    }
    /**
     * Logs a warning message if warning logging is enabled.
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    warn(message, ...args) {
      if (this.isWarn()) {
        this.logger.warn(message, ...args);
      }
    }
    /**
     * Checks if error logging is enabled.
     * @returns True if error logs should be output
     */
    isError() {
      return this.shouldLog(LogLevel.Error);
    }
    /**
     * Logs an error message if error logging is enabled.
     * @param message - The message to log
     * @param args - Additional arguments to log
     */
    error(message, ...args) {
      if (this.isError()) {
        this.logger.error(message, ...args);
      }
    }
  };
  function createLogger(config) {
    var _a, _b, _c;
    if (config == null) {
      return defaultLogger;
    }
    if (config instanceof Logger) {
      return config;
    }
    config = config != null ? config : {};
    (_a = config.level) != null ? _a : config.level = LogLevel.Info;
    (_b = config.logger) != null ? _b : config.logger = new ConsoleLogger();
    (_c = config.silent) != null ? _c : config.silent = true;
    return new Logger(config);
  }
  var defaultLogger = new Logger({
    level: LogLevel.Info,
    logger: new ConsoleLogger(),
    silent: true
  });

  // src/core/url/qs.ts
  var defaultQsOptions = {
    arrayFormat: "indices",
    encode: true
  };
  function encodeValue(value, shouldEncode) {
    if (value === void 0) {
      return "";
    }
    if (value === null) {
      return "";
    }
    const stringValue = String(value);
    return shouldEncode ? encodeURIComponent(stringValue) : stringValue;
  }
  function stringifyObject(obj, prefix = "", options) {
    const parts = [];
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}[${key}]` : key;
      if (value === void 0) {
        continue;
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          continue;
        }
        for (let i = 0; i < value.length; i++) {
          const item = value[i];
          if (item === void 0) {
            continue;
          }
          if (typeof item === "object" && !Array.isArray(item) && item !== null) {
            const arrayKey = options.arrayFormat === "indices" ? `${fullKey}[${i}]` : fullKey;
            parts.push(...stringifyObject(item, arrayKey, options));
          } else {
            const arrayKey = options.arrayFormat === "indices" ? `${fullKey}[${i}]` : fullKey;
            const encodedKey = options.encode ? encodeURIComponent(arrayKey) : arrayKey;
            parts.push(`${encodedKey}=${encodeValue(item, options.encode)}`);
          }
        }
      } else if (typeof value === "object" && value !== null) {
        if (Object.keys(value).length === 0) {
          continue;
        }
        parts.push(...stringifyObject(value, fullKey, options));
      } else {
        const encodedKey = options.encode ? encodeURIComponent(fullKey) : fullKey;
        parts.push(`${encodedKey}=${encodeValue(value, options.encode)}`);
      }
    }
    return parts;
  }
  function toQueryString(obj, options) {
    if (obj == null || typeof obj !== "object") {
      return "";
    }
    const parts = stringifyObject(obj, "", __spreadValues(__spreadValues({}, defaultQsOptions), options));
    return parts.join("&");
  }

  // src/core/fetcher/createRequestUrl.ts
  function createRequestUrl(baseUrl, queryParameters) {
    const queryString = toQueryString(queryParameters, { arrayFormat: "repeat" });
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  // src/core/fetcher/BinaryResponse.ts
  function getBinaryResponse(response) {
    const binaryResponse = {
      get bodyUsed() {
        return response.bodyUsed;
      },
      stream: () => response.body,
      arrayBuffer: response.arrayBuffer.bind(response),
      blob: response.blob.bind(response)
    };
    if ("bytes" in response && typeof response.bytes === "function") {
      binaryResponse.bytes = response.bytes.bind(response);
    }
    return binaryResponse;
  }

  // src/core/fetcher/getResponseBody.ts
  function getResponseBody(response, responseType) {
    return __async(this, null, function* () {
      switch (responseType) {
        case "binary-response":
          return getBinaryResponse(response);
        case "blob":
          return yield response.blob();
        case "arrayBuffer":
          return yield response.arrayBuffer();
        case "sse":
          if (response.body == null) {
            return {
              ok: false,
              error: {
                reason: "body-is-null",
                statusCode: response.status
              }
            };
          }
          return response.body;
        case "streaming":
          if (response.body == null) {
            return {
              ok: false,
              error: {
                reason: "body-is-null",
                statusCode: response.status
              }
            };
          }
          return response.body;
        case "text":
          return yield response.text();
      }
      const text = yield response.text();
      if (text.length > 0) {
        try {
          const responseBody = fromJson(text);
          return responseBody;
        } catch (_err) {
          return {
            ok: false,
            error: {
              reason: "non-json",
              statusCode: response.status,
              rawBody: text
            }
          };
        }
      }
      return void 0;
    });
  }

  // src/core/fetcher/getErrorResponseBody.ts
  function getErrorResponseBody(response) {
    return __async(this, null, function* () {
      var _a, _b, _c;
      let contentType = (_a = response.headers.get("Content-Type")) == null ? void 0 : _a.toLowerCase();
      if (contentType == null || contentType.length === 0) {
        return getResponseBody(response);
      }
      if (contentType.indexOf(";") !== -1) {
        contentType = (_c = (_b = contentType.split(";")[0]) == null ? void 0 : _b.trim()) != null ? _c : "";
      }
      switch (contentType) {
        case "application/hal+json":
        case "application/json":
        case "application/ld+json":
        case "application/problem+json":
        case "application/vnd.api+json":
        case "text/json": {
          const text = yield response.text();
          return text.length > 0 ? fromJson(text) : void 0;
        }
        default:
          if (contentType.startsWith("application/vnd.") && contentType.endsWith("+json")) {
            const text = yield response.text();
            return text.length > 0 ? fromJson(text) : void 0;
          }
          return yield response.text();
      }
    });
  }

  // src/core/fetcher/getFetchFn.ts
  function getFetchFn() {
    return __async(this, null, function* () {
      return fetch;
    });
  }

  // src/core/fetcher/getRequestBody.ts
  function getRequestBody(_0) {
    return __async(this, arguments, function* ({ body, type }) {
      if (type === "form") {
        return toQueryString(body, { arrayFormat: "repeat", encode: true });
      }
      if (type.includes("json")) {
        return toJson(body);
      } else {
        return body;
      }
    });
  }

  // src/core/fetcher/Headers.ts
  var Headers;
  if (typeof globalThis.Headers !== "undefined") {
    Headers = globalThis.Headers;
  } else {
    Headers = class Headers2 {
      constructor(init) {
        this.headers = /* @__PURE__ */ new Map();
        if (init) {
          if (init instanceof Headers2) {
            init.forEach((value, key) => this.append(key, value));
          } else if (Array.isArray(init)) {
            for (const [key, value] of init) {
              if (typeof key === "string" && typeof value === "string") {
                this.append(key, value);
              } else {
                throw new TypeError("Each header entry must be a [string, string] tuple");
              }
            }
          } else {
            for (const [key, value] of Object.entries(init)) {
              if (typeof value === "string") {
                this.append(key, value);
              } else {
                throw new TypeError("Header values must be strings");
              }
            }
          }
        }
      }
      append(name, value) {
        const key = name.toLowerCase();
        const existing = this.headers.get(key) || [];
        this.headers.set(key, [...existing, value]);
      }
      delete(name) {
        const key = name.toLowerCase();
        this.headers.delete(key);
      }
      get(name) {
        const key = name.toLowerCase();
        const values = this.headers.get(key);
        return values ? values.join(", ") : null;
      }
      has(name) {
        const key = name.toLowerCase();
        return this.headers.has(key);
      }
      set(name, value) {
        const key = name.toLowerCase();
        this.headers.set(key, [value]);
      }
      forEach(callbackfn, thisArg) {
        const boundCallback = thisArg ? callbackfn.bind(thisArg) : callbackfn;
        this.headers.forEach((values, key) => boundCallback(values.join(", "), key, this));
      }
      getSetCookie() {
        return this.headers.get("set-cookie") || [];
      }
      *entries() {
        for (const [key, values] of this.headers.entries()) {
          yield [key, values.join(", ")];
        }
      }
      *keys() {
        yield* __yieldStar(this.headers.keys());
      }
      *values() {
        for (const values of this.headers.values()) {
          yield values.join(", ");
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
    };
  }

  // src/core/fetcher/signals.ts
  var TIMEOUT = "timeout";
  function getTimeoutSignal(timeoutMs) {
    const controller = new AbortController();
    const abortId = setTimeout(() => controller.abort(TIMEOUT), timeoutMs);
    return { signal: controller.signal, abortId };
  }
  function anySignal(...args) {
    const signals = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
    const controller = new AbortController();
    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort(signal == null ? void 0 : signal.reason);
        break;
      }
      signal.addEventListener("abort", () => controller.abort(signal == null ? void 0 : signal.reason), {
        signal: controller.signal
      });
    }
    return controller.signal;
  }

  // src/core/fetcher/makeRequest.ts
  var makeRequest = (fetchFn, url, method, headers, requestBody, timeoutMs, abortSignal, withCredentials, duplex) => __async(null, null, function* () {
    const signals = [];
    let timeoutAbortId;
    if (timeoutMs != null) {
      const { signal, abortId } = getTimeoutSignal(timeoutMs);
      timeoutAbortId = abortId;
      signals.push(signal);
    }
    if (abortSignal != null) {
      signals.push(abortSignal);
    }
    const newSignals = anySignal(signals);
    const response = yield fetchFn(url, {
      method,
      headers,
      body: requestBody,
      signal: newSignals,
      credentials: withCredentials ? "include" : void 0,
      // @ts-ignore
      duplex
    });
    if (timeoutAbortId != null) {
      clearTimeout(timeoutAbortId);
    }
    return response;
  });

  // src/core/fetcher/RawResponse.ts
  var abortRawResponse = {
    headers: new Headers(),
    redirected: false,
    status: 499,
    statusText: "Client Closed Request",
    type: "error",
    url: ""
  };
  var unknownRawResponse = {
    headers: new Headers(),
    redirected: false,
    status: 0,
    statusText: "Unknown Error",
    type: "error",
    url: ""
  };
  function toRawResponse(response) {
    return {
      headers: response.headers,
      redirected: response.redirected,
      status: response.status,
      statusText: response.statusText,
      type: response.type,
      url: response.url
    };
  }

  // src/core/fetcher/requestWithRetries.ts
  var INITIAL_RETRY_DELAY = 1e3;
  var MAX_RETRY_DELAY = 6e4;
  var DEFAULT_MAX_RETRIES = 2;
  var JITTER_FACTOR = 0.2;
  function addPositiveJitter(delay) {
    const jitterMultiplier = 1 + Math.random() * JITTER_FACTOR;
    return delay * jitterMultiplier;
  }
  function addSymmetricJitter(delay) {
    const jitterMultiplier = 1 + (Math.random() - 0.5) * JITTER_FACTOR;
    return delay * jitterMultiplier;
  }
  function getRetryDelayFromHeaders(response, retryAttempt) {
    const retryAfter = response.headers.get("Retry-After");
    if (retryAfter) {
      const retryAfterSeconds = parseInt(retryAfter, 10);
      if (!Number.isNaN(retryAfterSeconds) && retryAfterSeconds > 0) {
        return Math.min(retryAfterSeconds * 1e3, MAX_RETRY_DELAY);
      }
      const retryAfterDate = new Date(retryAfter);
      if (!Number.isNaN(retryAfterDate.getTime())) {
        const delay = retryAfterDate.getTime() - Date.now();
        if (delay > 0) {
          return Math.min(Math.max(delay, 0), MAX_RETRY_DELAY);
        }
      }
    }
    const rateLimitReset = response.headers.get("X-RateLimit-Reset");
    if (rateLimitReset) {
      const resetTime = parseInt(rateLimitReset, 10);
      if (!Number.isNaN(resetTime)) {
        const delay = resetTime * 1e3 - Date.now();
        if (delay > 0) {
          return addPositiveJitter(Math.min(delay, MAX_RETRY_DELAY));
        }
      }
    }
    return addSymmetricJitter(Math.min(INITIAL_RETRY_DELAY * __pow(2, retryAttempt), MAX_RETRY_DELAY));
  }
  function requestWithRetries(_0) {
    return __async(this, arguments, function* (requestFn, maxRetries = DEFAULT_MAX_RETRIES) {
      let response = yield requestFn();
      for (let i = 0; i < maxRetries; ++i) {
        if ([408, 429].includes(response.status) || response.status >= 500) {
          const delay = getRetryDelayFromHeaders(response, i);
          yield new Promise((resolve) => setTimeout(resolve, delay));
          response = yield requestFn();
        } else {
          break;
        }
      }
      return response;
    });
  }

  // src/core/fetcher/Fetcher.ts
  var SENSITIVE_HEADERS = /* @__PURE__ */ new Set([
    "authorization",
    "www-authenticate",
    "x-api-key",
    "api-key",
    "apikey",
    "x-api-token",
    "x-auth-token",
    "auth-token",
    "cookie",
    "set-cookie",
    "proxy-authorization",
    "proxy-authenticate",
    "x-csrf-token",
    "x-xsrf-token",
    "x-session-token",
    "x-access-token"
  ]);
  function redactHeaders(headers) {
    const filtered = {};
    for (const [key, value] of headers instanceof Headers ? headers.entries() : Object.entries(headers)) {
      if (SENSITIVE_HEADERS.has(key.toLowerCase())) {
        filtered[key] = "[REDACTED]";
      } else {
        filtered[key] = value;
      }
    }
    return filtered;
  }
  var SENSITIVE_QUERY_PARAMS = /* @__PURE__ */ new Set([
    "api_key",
    "api-key",
    "apikey",
    "token",
    "access_token",
    "access-token",
    "auth_token",
    "auth-token",
    "password",
    "passwd",
    "secret",
    "api_secret",
    "api-secret",
    "apisecret",
    "key",
    "session",
    "session_id",
    "session-id"
  ]);
  function redactQueryParameters(queryParameters) {
    if (queryParameters == null) {
      return queryParameters;
    }
    const redacted = {};
    for (const [key, value] of Object.entries(queryParameters)) {
      if (SENSITIVE_QUERY_PARAMS.has(key.toLowerCase())) {
        redacted[key] = "[REDACTED]";
      } else {
        redacted[key] = value;
      }
    }
    return redacted;
  }
  function redactUrl(url) {
    const protocolIndex = url.indexOf("://");
    if (protocolIndex === -1) return url;
    const afterProtocol = protocolIndex + 3;
    const pathStart = url.indexOf("/", afterProtocol);
    let queryStart = url.indexOf("?", afterProtocol);
    let fragmentStart = url.indexOf("#", afterProtocol);
    const firstDelimiter = Math.min(
      pathStart === -1 ? url.length : pathStart,
      queryStart === -1 ? url.length : queryStart,
      fragmentStart === -1 ? url.length : fragmentStart
    );
    let atIndex = -1;
    for (let i = afterProtocol; i < firstDelimiter; i++) {
      if (url[i] === "@") {
        atIndex = i;
      }
    }
    if (atIndex !== -1) {
      url = `${url.slice(0, afterProtocol)}[REDACTED]@${url.slice(atIndex + 1)}`;
    }
    queryStart = url.indexOf("?");
    if (queryStart === -1) return url;
    fragmentStart = url.indexOf("#", queryStart);
    const queryEnd = fragmentStart !== -1 ? fragmentStart : url.length;
    const queryString = url.slice(queryStart + 1, queryEnd);
    if (queryString.length === 0) return url;
    const lower = queryString.toLowerCase();
    const hasSensitive = lower.includes("token") || lower.includes("key") || lower.includes("password") || lower.includes("passwd") || lower.includes("secret") || lower.includes("session") || lower.includes("auth");
    if (!hasSensitive) {
      return url;
    }
    const redactedParams = [];
    const params = queryString.split("&");
    for (const param of params) {
      const equalIndex = param.indexOf("=");
      if (equalIndex === -1) {
        redactedParams.push(param);
        continue;
      }
      const key = param.slice(0, equalIndex);
      let shouldRedact = SENSITIVE_QUERY_PARAMS.has(key.toLowerCase());
      if (!shouldRedact && key.includes("%")) {
        try {
          const decodedKey = decodeURIComponent(key);
          shouldRedact = SENSITIVE_QUERY_PARAMS.has(decodedKey.toLowerCase());
        } catch (e) {
        }
      }
      redactedParams.push(shouldRedact ? `${key}=[REDACTED]` : param);
    }
    return url.slice(0, queryStart + 1) + redactedParams.join("&") + url.slice(queryEnd);
  }
  function getHeaders(args) {
    return __async(this, null, function* () {
      var _a;
      const newHeaders = new Headers();
      newHeaders.set(
        "Accept",
        args.responseType === "json" ? "application/json" : args.responseType === "text" ? "text/plain" : "*/*"
      );
      if (args.body !== void 0 && args.contentType != null) {
        newHeaders.set("Content-Type", args.contentType);
      }
      if (args.headers == null) {
        return newHeaders;
      }
      for (const [key, value] of Object.entries(args.headers)) {
        const result = yield EndpointSupplier.get(value, { endpointMetadata: (_a = args.endpointMetadata) != null ? _a : {} });
        if (typeof result === "string") {
          newHeaders.set(key, result);
          continue;
        }
        if (result == null) {
          continue;
        }
        newHeaders.set(key, `${result}`);
      }
      return newHeaders;
    });
  }
  function fetcherImpl(args) {
    return __async(this, null, function* () {
      var _a, _b, _c;
      const url = createRequestUrl(args.url, args.queryParameters);
      const requestBody = yield getRequestBody({
        body: args.body,
        type: (_a = args.requestType) != null ? _a : "other"
      });
      const fetchFn = (_b = args.fetchFn) != null ? _b : yield getFetchFn();
      const headers = yield getHeaders(args);
      const logger = createLogger(args.logging);
      if (logger.isDebug()) {
        const metadata = {
          method: args.method,
          url: redactUrl(url),
          headers: redactHeaders(headers),
          queryParameters: redactQueryParameters(args.queryParameters),
          hasBody: requestBody != null
        };
        logger.debug("Making HTTP request", metadata);
      }
      try {
        const response = yield requestWithRetries(
          () => __async(null, null, function* () {
            return makeRequest(
              fetchFn,
              url,
              args.method,
              headers,
              requestBody,
              args.timeoutMs,
              args.abortSignal,
              args.withCredentials,
              args.duplex
            );
          }),
          args.maxRetries
        );
        if (response.status >= 200 && response.status < 400) {
          if (logger.isDebug()) {
            const metadata = {
              method: args.method,
              url: redactUrl(url),
              statusCode: response.status,
              responseHeaders: redactHeaders(response.headers)
            };
            logger.debug("HTTP request succeeded", metadata);
          }
          const body = yield getResponseBody(response, args.responseType);
          return {
            ok: true,
            body,
            headers: response.headers,
            rawResponse: toRawResponse(response)
          };
        } else {
          if (logger.isError()) {
            const metadata = {
              method: args.method,
              url: redactUrl(url),
              statusCode: response.status,
              responseHeaders: redactHeaders(Object.fromEntries(response.headers.entries()))
            };
            logger.error("HTTP request failed with error status", metadata);
          }
          return {
            ok: false,
            error: {
              reason: "status-code",
              statusCode: response.status,
              body: yield getErrorResponseBody(response)
            },
            rawResponse: toRawResponse(response)
          };
        }
      } catch (error) {
        if ((_c = args.abortSignal) == null ? void 0 : _c.aborted) {
          if (logger.isError()) {
            const metadata = {
              method: args.method,
              url: redactUrl(url)
            };
            logger.error("HTTP request was aborted", metadata);
          }
          return {
            ok: false,
            error: {
              reason: "unknown",
              errorMessage: "The user aborted a request"
            },
            rawResponse: abortRawResponse
          };
        } else if (error instanceof Error && error.name === "AbortError") {
          if (logger.isError()) {
            const metadata = {
              method: args.method,
              url: redactUrl(url),
              timeoutMs: args.timeoutMs
            };
            logger.error("HTTP request timed out", metadata);
          }
          return {
            ok: false,
            error: {
              reason: "timeout"
            },
            rawResponse: abortRawResponse
          };
        } else if (error instanceof Error) {
          if (logger.isError()) {
            const metadata = {
              method: args.method,
              url: redactUrl(url),
              errorMessage: error.message
            };
            logger.error("HTTP request failed with error", metadata);
          }
          return {
            ok: false,
            error: {
              reason: "unknown",
              errorMessage: error.message
            },
            rawResponse: unknownRawResponse
          };
        }
        if (logger.isError()) {
          const metadata = {
            method: args.method,
            url: redactUrl(url),
            error: toJson(error)
          };
          logger.error("HTTP request failed with unknown error", metadata);
        }
        return {
          ok: false,
          error: {
            reason: "unknown",
            errorMessage: toJson(error)
          },
          rawResponse: unknownRawResponse
        };
      }
    });
  }
  var fetcher = fetcherImpl;

  // src/core/fetcher/HttpResponsePromise.ts
  var HttpResponsePromise = class _HttpResponsePromise extends Promise {
    constructor(promise) {
      super((resolve) => {
        resolve(void 0);
      });
      this.innerPromise = promise;
    }
    /**
     * Creates an `HttpResponsePromise` from a function that returns a promise.
     *
     * @param fn - A function that returns a promise resolving to a `WithRawResponse` object.
     * @param args - Arguments to pass to the function.
     * @returns An `HttpResponsePromise` instance.
     */
    static fromFunction(fn, ...args) {
      return new _HttpResponsePromise(fn(...args));
    }
    /**
     * Creates a function that returns an `HttpResponsePromise` from a function that returns a promise.
     *
     * @param fn - A function that returns a promise resolving to a `WithRawResponse` object.
     * @returns A function that returns an `HttpResponsePromise` instance.
     */
    static interceptFunction(fn) {
      return (...args) => {
        return _HttpResponsePromise.fromPromise(fn(...args));
      };
    }
    /**
     * Creates an `HttpResponsePromise` from an existing promise.
     *
     * @param promise - A promise resolving to a `WithRawResponse` object.
     * @returns An `HttpResponsePromise` instance.
     */
    static fromPromise(promise) {
      return new _HttpResponsePromise(promise);
    }
    /**
     * Creates an `HttpResponsePromise` from an executor function.
     *
     * @param executor - A function that takes resolve and reject callbacks to create a promise.
     * @returns An `HttpResponsePromise` instance.
     */
    static fromExecutor(executor) {
      const promise = new Promise(executor);
      return new _HttpResponsePromise(promise);
    }
    /**
     * Creates an `HttpResponsePromise` from a resolved result.
     *
     * @param result - A `WithRawResponse` object to resolve immediately.
     * @returns An `HttpResponsePromise` instance.
     */
    static fromResult(result) {
      const promise = Promise.resolve(result);
      return new _HttpResponsePromise(promise);
    }
    unwrap() {
      if (!this.unwrappedPromise) {
        this.unwrappedPromise = this.innerPromise.then(({ data }) => data);
      }
      return this.unwrappedPromise;
    }
    /** @inheritdoc */
    then(onfulfilled, onrejected) {
      return this.unwrap().then(onfulfilled, onrejected);
    }
    /** @inheritdoc */
    catch(onrejected) {
      return this.unwrap().catch(onrejected);
    }
    /** @inheritdoc */
    finally(onfinally) {
      return this.unwrap().finally(onfinally);
    }
    /**
     * Retrieves the data and raw response.
     *
     * @returns A promise resolving to a `WithRawResponse` object.
     */
    withRawResponse() {
      return __async(this, null, function* () {
        return yield this.innerPromise;
      });
    }
  };

  // src/core/fetcher/Supplier.ts
  var Supplier = {
    get: (supplier) => __async(null, null, function* () {
      if (typeof supplier === "function") {
        return supplier();
      } else {
        return supplier;
      }
    })
  };

  // src/core/file/index.ts
  var file_exports = {};
  __export(file_exports, {
    toBinaryUploadRequest: () => toBinaryUploadRequest,
    toMultipartDataPart: () => toMultipartDataPart
  });

  // src/core/file/file.ts
  function toBinaryUploadRequest(file) {
    return __async(this, null, function* () {
      const { data, filename, contentLength, contentType } = yield getFileWithMetadata(file);
      const request = {
        body: data,
        headers: {}
      };
      if (filename) {
        request.headers["Content-Disposition"] = `attachment; filename="${filename}"`;
      }
      if (contentType) {
        request.headers["Content-Type"] = contentType;
      }
      if (contentLength != null) {
        request.headers["Content-Length"] = contentLength.toString();
      }
      return request;
    });
  }
  function toMultipartDataPart(file) {
    return __async(this, null, function* () {
      const { data, filename, contentType } = yield getFileWithMetadata(file, {
        noSniffFileSize: true
      });
      return {
        data,
        filename,
        contentType
      };
    });
  }
  function getFileWithMetadata(_0) {
    return __async(this, arguments, function* (file, { noSniffFileSize } = {}) {
      var _a, _b, _c, _d, _e;
      if (isFileLike(file)) {
        return getFileWithMetadata(
          {
            data: file
          },
          { noSniffFileSize }
        );
      }
      if ("path" in file) {
        const fs = yield Promise.resolve().then(() => __toESM(require_fs()));
        if (!fs || !fs.createReadStream) {
          throw new Error("File path uploads are not supported in this environment.");
        }
        const data = fs.createReadStream(file.path);
        const contentLength = (_a = file.contentLength) != null ? _a : noSniffFileSize === true ? void 0 : yield tryGetFileSizeFromPath(file.path);
        const filename = (_b = file.filename) != null ? _b : getNameFromPath(file.path);
        return {
          data,
          filename,
          contentType: file.contentType,
          contentLength
        };
      }
      if ("data" in file) {
        const data = file.data;
        const contentLength = (_c = file.contentLength) != null ? _c : yield tryGetContentLengthFromFileLike(data, {
          noSniffFileSize
        });
        const filename = (_d = file.filename) != null ? _d : tryGetNameFromFileLike(data);
        return {
          data,
          filename,
          contentType: (_e = file.contentType) != null ? _e : tryGetContentTypeFromFileLike(data),
          contentLength
        };
      }
      throw new Error(`Invalid FileUpload of type ${typeof file}: ${JSON.stringify(file)}`);
    });
  }
  function isFileLike(value) {
    return isBuffer(value) || isArrayBufferView(value) || isArrayBuffer(value) || isUint8Array(value) || isBlob(value) || isFile(value) || isStreamLike(value) || isReadableStream(value);
  }
  function tryGetFileSizeFromPath(path) {
    return __async(this, null, function* () {
      try {
        const fs = yield Promise.resolve().then(() => __toESM(require_fs()));
        if (!fs || !fs.promises || !fs.promises.stat) {
          return void 0;
        }
        const fileStat = yield fs.promises.stat(path);
        return fileStat.size;
      } catch (_fallbackError) {
        return void 0;
      }
    });
  }
  function tryGetNameFromFileLike(data) {
    if (isNamedValue(data)) {
      return data.name;
    }
    if (isPathedValue(data)) {
      return getNameFromPath(data.path.toString());
    }
    return void 0;
  }
  function tryGetContentLengthFromFileLike(_0) {
    return __async(this, arguments, function* (data, { noSniffFileSize } = {}) {
      if (isBuffer(data)) {
        return data.length;
      }
      if (isArrayBufferView(data)) {
        return data.byteLength;
      }
      if (isArrayBuffer(data)) {
        return data.byteLength;
      }
      if (isBlob(data)) {
        return data.size;
      }
      if (isFile(data)) {
        return data.size;
      }
      if (noSniffFileSize === true) {
        return void 0;
      }
      if (isPathedValue(data)) {
        return yield tryGetFileSizeFromPath(data.path.toString());
      }
      return void 0;
    });
  }
  function tryGetContentTypeFromFileLike(data) {
    if (isBlob(data)) {
      return data.type;
    }
    if (isFile(data)) {
      return data.type;
    }
    return void 0;
  }
  function getNameFromPath(path) {
    const lastForwardSlash = path.lastIndexOf("/");
    const lastBackSlash = path.lastIndexOf("\\");
    const lastSlashIndex = Math.max(lastForwardSlash, lastBackSlash);
    return lastSlashIndex >= 0 ? path.substring(lastSlashIndex + 1) : path;
  }
  function isNamedValue(value) {
    return typeof value === "object" && value != null && "name" in value;
  }
  function isPathedValue(value) {
    return typeof value === "object" && value != null && "path" in value;
  }
  function isStreamLike(value) {
    return typeof value === "object" && value != null && ("read" in value || "pipe" in value);
  }
  function isReadableStream(value) {
    return typeof value === "object" && value != null && "getReader" in value;
  }
  function isBuffer(value) {
    return typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(value);
  }
  function isArrayBufferView(value) {
    return typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(value);
  }
  function isArrayBuffer(value) {
    return typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer;
  }
  function isUint8Array(value) {
    return typeof Uint8Array !== "undefined" && value instanceof Uint8Array;
  }
  function isBlob(value) {
    return typeof Blob !== "undefined" && value instanceof Blob;
  }
  function isFile(value) {
    return typeof File !== "undefined" && value instanceof File;
  }

  // src/core/logging/index.ts
  var logging_exports = {};
  __export(logging_exports, {
    ConsoleLogger: () => ConsoleLogger,
    LogLevel: () => LogLevel,
    Logger: () => Logger,
    createLogger: () => createLogger
  });

  // src/core/runtime/runtime.ts
  var RUNTIME = evaluateRuntime();
  function evaluateRuntime() {
    var _a, _b, _c, _d, _e;
    const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
    if (isBrowser) {
      return {
        type: "browser",
        version: window.navigator.userAgent
      };
    }
    const isCloudflare = typeof globalThis !== "undefined" && ((_a = globalThis == null ? void 0 : globalThis.navigator) == null ? void 0 : _a.userAgent) === "Cloudflare-Workers";
    if (isCloudflare) {
      return {
        type: "workerd"
      };
    }
    const isEdgeRuntime = typeof EdgeRuntime === "string";
    if (isEdgeRuntime) {
      return {
        type: "edge-runtime"
      };
    }
    const isWebWorker = typeof self === "object" && typeof (self == null ? void 0 : self.importScripts) === "function" && (((_b = self.constructor) == null ? void 0 : _b.name) === "DedicatedWorkerGlobalScope" || ((_c = self.constructor) == null ? void 0 : _c.name) === "ServiceWorkerGlobalScope" || ((_d = self.constructor) == null ? void 0 : _d.name) === "SharedWorkerGlobalScope");
    if (isWebWorker) {
      return {
        type: "web-worker"
      };
    }
    const isDeno = typeof Deno !== "undefined" && typeof Deno.version !== "undefined" && typeof Deno.version.deno !== "undefined";
    if (isDeno) {
      return {
        type: "deno",
        version: Deno.version.deno
      };
    }
    const isBun = typeof Bun !== "undefined" && typeof Bun.version !== "undefined";
    if (isBun) {
      return {
        type: "bun",
        version: Bun.version
      };
    }
    const isReactNative = typeof navigator !== "undefined" && (navigator == null ? void 0 : navigator.product) === "ReactNative";
    if (isReactNative) {
      return {
        type: "react-native"
      };
    }
    const isNode = typeof process !== "undefined" && "version" in process && !!process.version && "versions" in process && !!((_e = process.versions) == null ? void 0 : _e.node);
    if (isNode) {
      return {
        type: "node",
        version: process.versions.node,
        parsedVersion: Number(process.versions.node.split(".")[0])
      };
    }
    return {
      type: "unknown"
    };
  }

  // src/core/url/index.ts
  var url_exports = {};
  __export(url_exports, {
    encodePathParam: () => encodePathParam,
    join: () => join,
    toQueryString: () => toQueryString
  });

  // src/core/url/encodePathParam.ts
  function encodePathParam(param) {
    if (param === null) {
      return "null";
    }
    const typeofParam = typeof param;
    switch (typeofParam) {
      case "undefined":
        return "undefined";
      case "string":
      case "number":
      case "boolean":
        break;
      default:
        param = String(param);
        break;
    }
    return encodeURIComponent(param);
  }

  // src/core/url/join.ts
  function join(base, ...segments) {
    if (!base) {
      return "";
    }
    if (segments.length === 0) {
      return base;
    }
    if (base.includes("://")) {
      let url;
      try {
        url = new URL(base);
      } catch (e) {
        return joinPath(base, ...segments);
      }
      const lastSegment = segments[segments.length - 1];
      const shouldPreserveTrailingSlash = lastSegment == null ? void 0 : lastSegment.endsWith("/");
      for (const segment of segments) {
        const cleanSegment = trimSlashes(segment);
        if (cleanSegment) {
          url.pathname = joinPathSegments(url.pathname, cleanSegment);
        }
      }
      if (shouldPreserveTrailingSlash && !url.pathname.endsWith("/")) {
        url.pathname += "/";
      }
      return url.toString();
    }
    return joinPath(base, ...segments);
  }
  function joinPath(base, ...segments) {
    if (segments.length === 0) {
      return base;
    }
    let result = base;
    const lastSegment = segments[segments.length - 1];
    const shouldPreserveTrailingSlash = lastSegment == null ? void 0 : lastSegment.endsWith("/");
    for (const segment of segments) {
      const cleanSegment = trimSlashes(segment);
      if (cleanSegment) {
        result = joinPathSegments(result, cleanSegment);
      }
    }
    if (shouldPreserveTrailingSlash && !result.endsWith("/")) {
      result += "/";
    }
    return result;
  }
  function joinPathSegments(left, right) {
    if (left.endsWith("/")) {
      return left + right;
    }
    return `${left}/${right}`;
  }
  function trimSlashes(str) {
    if (!str) return str;
    let start = 0;
    let end = str.length;
    if (str.startsWith("/")) start = 1;
    if (str.endsWith("/")) end = str.length - 1;
    return start === 0 && end === str.length ? str : str.slice(start, end);
  }

  // src/core/websocket/ws.ts
  var import_ws = __toESM(require_browser());

  // src/core/websocket/events.ts
  var Event = class {
    constructor(type, target) {
      this.target = target;
      this.type = type;
    }
  };
  var ErrorEvent = class extends Event {
    constructor(error, target) {
      super("error", target);
      this.message = error.message;
      this.error = error;
    }
  };
  var CloseEvent = class extends Event {
    constructor(code = 1e3, reason = "", target) {
      super("close", target);
      this.wasClean = true;
      this.code = code;
      this.reason = reason;
    }
  };

  // src/core/websocket/ws.ts
  var getGlobalWebSocket = () => {
    if (typeof WebSocket !== "undefined") {
      return WebSocket;
    } else if (RUNTIME.type === "node") {
      return import_ws.WebSocket;
    }
    return void 0;
  };
  var isWebSocket = (w) => typeof w !== "undefined" && !!w && w.CLOSING === 2;
  var DEFAULT_OPTIONS = {
    maxReconnectionDelay: 1e4,
    minReconnectionDelay: 1e3 + Math.random() * 4e3,
    minUptime: 5e3,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 4e3,
    maxRetries: Infinity,
    maxEnqueuedMessages: Infinity,
    startClosed: false,
    debug: false
  };
  var _ReconnectingWebSocket = class _ReconnectingWebSocket {
    constructor({ url, protocols, options, headers, queryParameters }) {
      this._listeners = {
        error: [],
        message: [],
        open: [],
        close: []
      };
      this._retryCount = -1;
      this._shouldReconnect = true;
      this._connectLock = false;
      this._binaryType = "blob";
      this._closeCalled = false;
      this._messageQueue = [];
      this.CONNECTING = _ReconnectingWebSocket.CONNECTING;
      this.OPEN = _ReconnectingWebSocket.OPEN;
      this.CLOSING = _ReconnectingWebSocket.CLOSING;
      this.CLOSED = _ReconnectingWebSocket.CLOSED;
      /**
       * An event listener to be called when the WebSocket connection's readyState changes to CLOSED
       */
      this.onclose = null;
      /**
       * An event listener to be called when an error occurs
       */
      this.onerror = null;
      /**
       * An event listener to be called when a message is received from the server
       */
      this.onmessage = null;
      /**
       * An event listener to be called when the WebSocket connection's readyState changes to OPEN;
       * this indicates that the connection is ready to send and receive data
       */
      this.onopen = null;
      this._handleOpen = (event) => {
        this._debug("open event");
        const { minUptime = DEFAULT_OPTIONS.minUptime } = this._options;
        clearTimeout(this._connectTimeout);
        this._uptimeTimeout = setTimeout(() => this._acceptOpen(), minUptime);
        this._ws.binaryType = this._binaryType;
        this._messageQueue.forEach((message) => {
          var _a;
          return (_a = this._ws) == null ? void 0 : _a.send(message);
        });
        this._messageQueue = [];
        if (this.onopen) {
          this.onopen(event);
        }
        this._listeners.open.forEach((listener) => this._callEventListener(event, listener));
      };
      this._handleMessage = (event) => {
        this._debug("message event");
        if (this.onmessage) {
          this.onmessage(event);
        }
        this._listeners.message.forEach((listener) => this._callEventListener(event, listener));
      };
      this._handleError = (event) => {
        this._debug("error event", event.message);
        this._disconnect(void 0, event.message === "TIMEOUT" ? "timeout" : void 0);
        if (this.onerror) {
          this.onerror(event);
        }
        this._debug("exec error listeners");
        this._listeners.error.forEach((listener) => this._callEventListener(event, listener));
        this._connect();
      };
      this._handleClose = (event) => {
        this._debug("close event");
        this._clearTimeouts();
        if (event.code === 1e3) {
          this._shouldReconnect = false;
        }
        if (this._shouldReconnect) {
          this._connect();
        }
        if (this.onclose) {
          this.onclose(event);
        }
        this._listeners.close.forEach((listener) => this._callEventListener(event, listener));
      };
      this._url = url;
      this._protocols = protocols;
      this._options = options != null ? options : DEFAULT_OPTIONS;
      this._headers = headers;
      this._queryParameters = queryParameters;
      if (this._options.startClosed) {
        this._shouldReconnect = false;
      }
      this._connect();
    }
    get binaryType() {
      return this._ws ? this._ws.binaryType : this._binaryType;
    }
    set binaryType(value) {
      this._binaryType = value;
      if (this._ws) {
        this._ws.binaryType = value;
      }
    }
    /**
     * Returns the number or connection retries
     */
    get retryCount() {
      return Math.max(this._retryCount, 0);
    }
    /**
     * The number of bytes of data that have been queued using calls to send() but not yet
     * transmitted to the network. This value resets to zero once all queued data has been sent.
     * This value does not reset to zero when the connection is closed; if you keep calling send(),
     * this will continue to climb. Read only
     */
    get bufferedAmount() {
      const bytes = this._messageQueue.reduce((acc, message) => {
        if (typeof message === "string") {
          acc += message.length;
        } else if (message instanceof Blob) {
          acc += message.size;
        } else {
          acc += message.byteLength;
        }
        return acc;
      }, 0);
      return bytes + (this._ws ? this._ws.bufferedAmount : 0);
    }
    /**
     * The extensions selected by the server. This is currently only the empty string or a list of
     * extensions as negotiated by the connection
     */
    get extensions() {
      return this._ws ? this._ws.extensions : "";
    }
    /**
     * A string indicating the name of the sub-protocol the server selected;
     * this will be one of the strings specified in the protocols parameter when creating the
     * WebSocket object
     */
    get protocol() {
      return this._ws ? this._ws.protocol : "";
    }
    /**
     * The current state of the connection; this is one of the Ready state constants
     */
    get readyState() {
      if (this._ws) {
        return this._ws.readyState;
      }
      return this._options.startClosed ? _ReconnectingWebSocket.CLOSED : _ReconnectingWebSocket.CONNECTING;
    }
    /**
     * The URL as resolved by the constructor
     */
    get url() {
      return this._ws ? this._ws.url : "";
    }
    /**
     * Closes the WebSocket connection or connection attempt, if any. If the connection is already
     * CLOSED, this method does nothing
     */
    close(code = 1e3, reason) {
      this._closeCalled = true;
      this._shouldReconnect = false;
      this._clearTimeouts();
      if (!this._ws) {
        this._debug("close enqueued: no ws instance");
        return;
      }
      if (this._ws.readyState === this.CLOSED) {
        this._debug("close: already closed");
        return;
      }
      this._ws.close(code, reason);
    }
    /**
     * Closes the WebSocket connection or connection attempt and connects again.
     * Resets retry counter;
     */
    reconnect(code, reason) {
      this._shouldReconnect = true;
      this._closeCalled = false;
      this._retryCount = -1;
      if (!this._ws || this._ws.readyState === this.CLOSED) {
        this._connect();
      } else {
        this._disconnect(code, reason);
        this._connect();
      }
    }
    /**
     * Enqueue specified data to be transmitted to the server over the WebSocket connection
     */
    send(data) {
      if (this._ws && this._ws.readyState === this.OPEN) {
        this._debug("send", data);
        this._ws.send(data);
      } else {
        const { maxEnqueuedMessages = DEFAULT_OPTIONS.maxEnqueuedMessages } = this._options;
        if (this._messageQueue.length < maxEnqueuedMessages) {
          this._debug("enqueue", data);
          this._messageQueue.push(data);
        }
      }
    }
    /**
     * Register an event handler of a specific event type
     */
    addEventListener(type, listener) {
      if (this._listeners[type]) {
        this._listeners[type].push(listener);
      }
    }
    dispatchEvent(event) {
      const listeners = this._listeners[event.type];
      if (listeners) {
        for (const listener of listeners) {
          this._callEventListener(event, listener);
        }
      }
      return true;
    }
    /**
     * Removes an event listener
     */
    removeEventListener(type, listener) {
      if (this._listeners[type]) {
        this._listeners[type] = this._listeners[type].filter(
          // @ts-ignore
          (l) => l !== listener
        );
      }
    }
    _debug(...args) {
      if (this._options.debug) {
        console.log.apply(console, ["RWS>", ...args]);
      }
    }
    _getNextDelay() {
      const {
        reconnectionDelayGrowFactor = DEFAULT_OPTIONS.reconnectionDelayGrowFactor,
        minReconnectionDelay = DEFAULT_OPTIONS.minReconnectionDelay,
        maxReconnectionDelay = DEFAULT_OPTIONS.maxReconnectionDelay
      } = this._options;
      let delay = 0;
      if (this._retryCount > 0) {
        delay = minReconnectionDelay * __pow(reconnectionDelayGrowFactor, this._retryCount - 1);
        if (delay > maxReconnectionDelay) {
          delay = maxReconnectionDelay;
        }
      }
      this._debug("next delay", delay);
      return delay;
    }
    _wait() {
      return new Promise((resolve) => {
        setTimeout(resolve, this._getNextDelay());
      });
    }
    _getNextUrl(urlProvider) {
      if (typeof urlProvider === "string") {
        return Promise.resolve(urlProvider);
      }
      if (typeof urlProvider === "function") {
        const url = urlProvider();
        if (typeof url === "string") {
          return Promise.resolve(url);
        }
        if (url.then) {
          return url;
        }
      }
      throw Error("Invalid URL");
    }
    _connect() {
      if (this._connectLock || !this._shouldReconnect) {
        return;
      }
      this._connectLock = true;
      const {
        maxRetries = DEFAULT_OPTIONS.maxRetries,
        connectionTimeout = DEFAULT_OPTIONS.connectionTimeout,
        WebSocket: WebSocket2 = getGlobalWebSocket()
      } = this._options;
      if (this._retryCount >= maxRetries) {
        this._debug("max retries reached", this._retryCount, ">=", maxRetries);
        return;
      }
      this._retryCount++;
      this._debug("connect", this._retryCount);
      this._removeListeners();
      if (!isWebSocket(WebSocket2)) {
        throw Error("No valid WebSocket class provided");
      }
      this._wait().then(() => this._getNextUrl(this._url)).then((url) => {
        if (this._closeCalled) {
          return;
        }
        const options = {};
        if (this._headers) {
          options.headers = this._headers;
        }
        if (this._queryParameters && Object.keys(this._queryParameters).length > 0) {
          const queryString = toQueryString(this._queryParameters, { arrayFormat: "repeat" });
          if (queryString) {
            url = `${url}?${queryString}`;
          }
        }
        this._ws = new WebSocket2(url, this._protocols, options);
        this._ws.binaryType = this._binaryType;
        this._connectLock = false;
        this._addListeners();
        this._connectTimeout = setTimeout(() => this._handleTimeout(), connectionTimeout);
      });
    }
    _handleTimeout() {
      this._debug("timeout event");
      this._handleError(new ErrorEvent(Error("TIMEOUT"), this));
    }
    _disconnect(code = 1e3, reason) {
      this._clearTimeouts();
      if (!this._ws) {
        return;
      }
      this._removeListeners();
      try {
        this._ws.close(code, reason);
        this._handleClose(new CloseEvent(code, reason, this));
      } catch (_error) {
      }
    }
    _acceptOpen() {
      this._debug("accept open");
      this._retryCount = 0;
    }
    _callEventListener(event, listener) {
      if ("handleEvent" in listener) {
        listener.handleEvent(event);
      } else {
        listener(event);
      }
    }
    _removeListeners() {
      if (!this._ws) {
        return;
      }
      this._debug("removeListeners");
      this._ws.removeEventListener("open", this._handleOpen);
      this._ws.removeEventListener("close", this._handleClose);
      this._ws.removeEventListener("message", this._handleMessage);
      this._ws.removeEventListener("error", this._handleError);
    }
    _addListeners() {
      if (!this._ws) {
        return;
      }
      this._debug("addListeners");
      this._ws.addEventListener("open", this._handleOpen);
      this._ws.addEventListener("close", this._handleClose);
      this._ws.addEventListener("message", this._handleMessage);
      this._ws.addEventListener("error", this._handleError);
    }
    _clearTimeouts() {
      clearTimeout(this._connectTimeout);
      clearTimeout(this._uptimeTimeout);
    }
  };
  _ReconnectingWebSocket.CONNECTING = 0;
  _ReconnectingWebSocket.OPEN = 1;
  _ReconnectingWebSocket.CLOSING = 2;
  _ReconnectingWebSocket.CLOSED = 3;
  var ReconnectingWebSocket = _ReconnectingWebSocket;

  // src/auth/HeaderAuthProvider.ts
  var PARAM_KEY = "apiKey";
  var ENV_HEADER_KEY = "DEEPGRAM_API_KEY";
  var HEADER_NAME = "Authorization";
  var HeaderAuthProvider = class _HeaderAuthProvider {
    constructor(options) {
      this.options = options;
    }
    static canCreate(options) {
      var _a;
      return (options == null ? void 0 : options[PARAM_KEY]) != null || ((_a = process.env) == null ? void 0 : _a[ENV_HEADER_KEY]) != null;
    }
    getAuthRequest() {
      return __async(this, arguments, function* ({
        endpointMetadata
      } = {}) {
        var _a, _b;
        const headerValue = (_b = yield Supplier.get(this.options[PARAM_KEY])) != null ? _b : (_a = process.env) == null ? void 0 : _a[ENV_HEADER_KEY];
        if (headerValue == null) {
          throw new DeepgramError({
            message: _HeaderAuthProvider.AUTH_CONFIG_ERROR_MESSAGE
          });
        }
        return {
          headers: { [HEADER_NAME]: headerValue }
        };
      });
    }
  };
  ((HeaderAuthProvider2) => {
    HeaderAuthProvider2.AUTH_SCHEME = "ApiKeyAuth";
    HeaderAuthProvider2.AUTH_CONFIG_ERROR_MESSAGE = `Please provide '${PARAM_KEY}' when initializing the client, or set the '${ENV_HEADER_KEY}' environment variable`;
    function createInstance(options) {
      return new HeaderAuthProvider2(options);
    }
    HeaderAuthProvider2.createInstance = createInstance;
  })(HeaderAuthProvider || (HeaderAuthProvider = {}));

  // src/core/headers.ts
  function mergeHeaders(...headersArray) {
    const result = {};
    for (const [key, value] of headersArray.filter((headers) => headers != null).flatMap((headers) => Object.entries(headers))) {
      const insensitiveKey = key.toLowerCase();
      if (value != null) {
        result[insensitiveKey] = value;
      } else if (insensitiveKey in result) {
        delete result[insensitiveKey];
      }
    }
    return result;
  }
  function mergeOnlyDefinedHeaders(...headersArray) {
    const result = {};
    for (const [key, value] of headersArray.filter((headers) => headers != null).flatMap((headers) => Object.entries(headers))) {
      const insensitiveKey = key.toLowerCase();
      if (value != null) {
        result[insensitiveKey] = value;
      }
    }
    return result;
  }

  // src/BaseClient.ts
  function normalizeClientOptions(options) {
    const headers = mergeHeaders(
      {
        "X-Fern-Language": "JavaScript",
        "X-Fern-SDK-Name": "",
        "X-Fern-SDK-Version": "0.0.283",
        "User-Agent": "/0.0.283",
        "X-Fern-Runtime": RUNTIME.type,
        "X-Fern-Runtime-Version": RUNTIME.version
      },
      options == null ? void 0 : options.headers
    );
    return __spreadProps(__spreadValues({}, options), {
      logging: logging_exports.createLogger(options == null ? void 0 : options.logging),
      headers
    });
  }
  function normalizeClientOptionsWithAuth(options) {
    var _a;
    const normalized = normalizeClientOptions(options);
    const normalizedWithNoOpAuthProvider = withNoOpAuthProvider(normalized);
    (_a = normalized.authProvider) != null ? _a : normalized.authProvider = new HeaderAuthProvider(normalizedWithNoOpAuthProvider);
    return normalized;
  }
  function withNoOpAuthProvider(options) {
    return __spreadProps(__spreadValues({}, options), {
      authProvider: new NoOpAuthProvider()
    });
  }

  // src/environments.ts
  var DeepgramEnvironment = {
    Production: {
      base: "https://api.deepgram.com",
      production: "wss://api.deepgram.com",
      agent: "wss://agent.deepgram.com"
    },
    Agent: {
      base: "https://agent.deepgram.com",
      production: "wss://api.deepgram.com",
      agent: "wss://agent.deepgram.com"
    }
  };

  // src/errors/handleNonStatusCodeError.ts
  function handleNonStatusCodeError(error, rawResponse, method, path) {
    switch (error.reason) {
      case "non-json":
        throw new DeepgramError({
          statusCode: error.statusCode,
          body: error.rawBody,
          rawResponse
        });
      case "body-is-null":
        throw new DeepgramError({
          statusCode: error.statusCode,
          rawResponse
        });
      case "timeout":
        throw new DeepgramTimeoutError(`Timeout exceeded when calling ${method} ${path}.`);
      case "unknown":
        throw new DeepgramError({
          message: error.errorMessage,
          rawResponse
        });
      default:
        throw new DeepgramError({
          message: "Unknown error",
          rawResponse
        });
    }
  }

  // src/api/resources/agent/resources/v1/resources/settings/resources/think/resources/models/client/Client.ts
  var ModelsClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptions(options);
    }
    /**
     * Retrieves the available think models that can be used for AI agent processing
     *
     * @param {ModelsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.agent.v1.settings.think.models.list()
     */
    list(requestOptions) {
      return HttpResponsePromise.fromPromise(this.__list(requestOptions));
    }
    __list(requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _headers = mergeHeaders((_a = this._options) == null ? void 0 : _a.headers, requestOptions == null ? void 0 : requestOptions.headers);
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            "v1/agent/settings/think/models"
          ),
          method: "GET",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/agent/settings/think/models"
        );
      });
    }
  };

  // src/api/resources/agent/resources/v1/resources/settings/resources/think/client/Client.ts
  var ThinkClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptions(options);
    }
    get models() {
      var _a;
      return (_a = this._models) != null ? _a : this._models = new ModelsClient(this._options);
    }
  };

  // src/api/resources/agent/resources/v1/resources/settings/client/Client.ts
  var SettingsClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptions(options);
    }
    get think() {
      var _a;
      return (_a = this._think) != null ? _a : this._think = new ThinkClient(this._options);
    }
  };

  // src/api/resources/agent/resources/v1/client/Socket.ts
  var V1Socket = class {
    constructor(args) {
      this.eventHandlers = {};
      this.handleOpen = () => {
        var _a, _b;
        (_b = (_a = this.eventHandlers).open) == null ? void 0 : _b.call(_a);
      };
      this.handleMessage = (event) => {
        var _a, _b;
        const data = fromJson(event.data);
        (_b = (_a = this.eventHandlers).message) == null ? void 0 : _b.call(_a, data);
      };
      this.handleClose = (event) => {
        var _a, _b;
        (_b = (_a = this.eventHandlers).close) == null ? void 0 : _b.call(_a, event);
      };
      this.handleError = (event) => {
        var _a, _b;
        const message = event.message;
        (_b = (_a = this.eventHandlers).error) == null ? void 0 : _b.call(_a, new Error(message));
      };
      this.socket = args.socket;
      this.socket.addEventListener("open", this.handleOpen);
      this.socket.addEventListener("message", this.handleMessage);
      this.socket.addEventListener("close", this.handleClose);
      this.socket.addEventListener("error", this.handleError);
    }
    /** The current state of the connection; this is one of the readyState constants. */
    get readyState() {
      return this.socket.readyState;
    }
    /**
     * @param event - The event to attach to.
     * @param callback - The callback to run when the event is triggered.
     * Usage:
     * ```typescript
     * this.on('open', () => {
     *     console.log('The websocket is open');
     * });
     * ```
     */
    on(event, callback) {
      this.eventHandlers[event] = callback;
    }
    sendSettings(message) {
      this.assertSocketIsOpen();
      this.sendJson(message);
    }
    sendUpdateSpeak(message) {
      this.assertSocketIsOpen();
      this.sendJson(message);
    }
    sendInjectUserMessage(message) {
      this.assertSocketIsOpen();
      this.sendJson(message);
    }
    sendInjectAgentMessage(message) {
      this.assertSocketIsOpen();
      this.sendJson(message);
    }
    sendFunctionCallResponse(message) {
      this.assertSocketIsOpen();
      this.sendJson(message);
    }
    sendKeepAlive(message) {
      this.assertSocketIsOpen();
      this.sendJson(message);
    }
    sendUpdatePrompt(message) {
      this.assertSocketIsOpen();
      this.sendJson(message);
    }
    sendMedia(message) {
      this.assertSocketIsOpen();
      this.sendBinary(message);
    }
    /** Connect to the websocket and register event handlers. */
    connect() {
      this.socket.reconnect();
      this.socket.addEventListener("open", this.handleOpen);
      this.socket.addEventListener("message", this.handleMessage);
      this.socket.addEventListener("close", this.handleClose);
      this.socket.addEventListener("error", this.handleError);
      return this;
    }
    /** Close the websocket and unregister event handlers. */
    close() {
      this.socket.close();
      this.handleClose({ code: 1e3 });
      this.socket.removeEventListener("open", this.handleOpen);
      this.socket.removeEventListener("message", this.handleMessage);
      this.socket.removeEventListener("close", this.handleClose);
      this.socket.removeEventListener("error", this.handleError);
    }
    /** Returns a promise that resolves when the websocket is open. */
    waitForOpen() {
      return __async(this, null, function* () {
        if (this.socket.readyState === ReconnectingWebSocket.OPEN) {
          return this.socket;
        }
        return new Promise((resolve, reject) => {
          this.socket.addEventListener("open", () => {
            resolve(this.socket);
          });
          this.socket.addEventListener("error", (event) => {
            reject(event);
          });
        });
      });
    }
    /** Asserts that the websocket is open. */
    assertSocketIsOpen() {
      if (!this.socket) {
        throw new Error("Socket is not connected.");
      }
      if (this.socket.readyState !== ReconnectingWebSocket.OPEN) {
        throw new Error("Socket is not open.");
      }
    }
    /** Send a binary payload to the websocket. */
    sendBinary(payload) {
      this.socket.send(payload);
    }
    /** Send a JSON payload to the websocket. */
    sendJson(payload) {
      const jsonPayload = toJson(payload);
      this.socket.send(jsonPayload);
    }
  };

  // src/api/resources/agent/resources/v1/client/Client.ts
  var V1Client = class {
    constructor(options = {}) {
      this._options = normalizeClientOptions(options);
    }
    get settings() {
      var _a;
      return (_a = this._settings) != null ? _a : this._settings = new SettingsClient(this._options);
    }
    connect(args) {
      return __async(this, null, function* () {
        var _a, _b;
        const { headers, debug, reconnectAttempts } = args;
        const _headers = mergeHeaders(
          mergeOnlyDefinedHeaders({ Authorization: args.Authorization }),
          headers
        );
        const socket = new ReconnectingWebSocket({
          url: url_exports.join(
            (_b = yield Supplier.get(this._options.baseUrl)) != null ? _b : ((_a = yield Supplier.get(this._options.environment)) != null ? _a : DeepgramEnvironment.Production).agent,
            "/v1/agent/converse"
          ),
          protocols: [],
          queryParameters: {},
          headers: _headers,
          options: { debug: debug != null ? debug : false, maxRetries: reconnectAttempts != null ? reconnectAttempts : 30 }
        });
        return new V1Socket({ socket });
      });
    }
  };

  // src/api/resources/agent/client/Client.ts
  var AgentClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptions(options);
    }
    get v1() {
      var _a;
      return (_a = this._v1) != null ? _a : this._v1 = new V1Client(this._options);
    }
  };

  // src/api/resources/auth/resources/v1/resources/tokens/client/Client.ts
  var TokensClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Generates a temporary JSON Web Token (JWT) with a 30-second (by default) TTL and usage::write permission for core voice APIs, requiring an API key with Member or higher authorization. Tokens created with this endpoint will not work with the Manage APIs.
     *
     * @param {Deepgram.auth.v1.GrantV1Request} request
     * @param {TokensClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.auth.v1.tokens.grant()
     */
    grant(request = {}, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__grant(request, requestOptions));
    }
    __grant() {
      return __async(this, arguments, function* (request = {}, requestOptions) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            "v1/auth/grant"
          ),
          method: "POST",
          headers: _headers,
          contentType: "application/json",
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          requestType: "json",
          body: request,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(_response.error, _response.rawResponse, "POST", "/v1/auth/grant");
      });
    }
  };

  // src/api/resources/auth/resources/v1/client/Client.ts
  var V1Client2 = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get tokens() {
      var _a;
      return (_a = this._tokens) != null ? _a : this._tokens = new TokensClient(this._options);
    }
  };

  // src/api/resources/auth/client/Client.ts
  var AuthClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get v1() {
      var _a;
      return (_a = this._v1) != null ? _a : this._v1 = new V1Client2(this._options);
    }
  };

  // src/api/resources/listen/resources/v1/resources/media/client/Client.ts
  var MediaClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Transcribe audio and video using Deepgram's speech-to-text REST API
     *
     * @param {Deepgram.listen.v1.ListenV1RequestUrl} request
     * @param {MediaClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.listen.v1.media.transcribeUrl({
     *         callback: "callback",
     *         callback_method: "POST",
     *         extra: "extra",
     *         sentiment: true,
     *         summarize: "v2",
     *         tag: "tag",
     *         topics: true,
     *         custom_topic: "custom_topic",
     *         custom_topic_mode: "extended",
     *         intents: true,
     *         custom_intent: "custom_intent",
     *         custom_intent_mode: "extended",
     *         detect_entities: true,
     *         detect_language: true,
     *         diarize: true,
     *         dictation: true,
     *         encoding: "linear16",
     *         filler_words: true,
     *         keywords: "keywords",
     *         language: "language",
     *         measurements: true,
     *         model: "nova-3",
     *         multichannel: true,
     *         numerals: true,
     *         paragraphs: true,
     *         profanity_filter: true,
     *         punctuate: true,
     *         redact: "redact",
     *         replace: "replace",
     *         search: "search",
     *         smart_format: true,
     *         utterances: true,
     *         utt_split: 1.1,
     *         version: "latest",
     *         mip_opt_out: true,
     *         url: "https://dpgr.am/spacewalk.wav"
     *     })
     */
    transcribeUrl(request, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__transcribeUrl(request, requestOptions));
    }
    __transcribeUrl(request, requestOptions) {
      return __async(this, null, function* () {
        var _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
        const _a = request, {
          callback,
          callback_method: callbackMethod,
          extra,
          sentiment,
          summarize,
          tag,
          topics,
          custom_topic: customTopic,
          custom_topic_mode: customTopicMode,
          intents,
          custom_intent: customIntent,
          custom_intent_mode: customIntentMode,
          detect_entities: detectEntities,
          detect_language: detectLanguage,
          diarize,
          dictation,
          encoding,
          filler_words: fillerWords,
          keyterm,
          keywords,
          language,
          measurements,
          model,
          multichannel,
          numerals,
          paragraphs,
          profanity_filter: profanityFilter,
          punctuate,
          redact,
          replace,
          search,
          smart_format: smartFormat,
          utterances,
          utt_split: uttSplit,
          version,
          mip_opt_out: mipOptOut
        } = _a, _body = __objRest(_a, [
          "callback",
          "callback_method",
          "extra",
          "sentiment",
          "summarize",
          "tag",
          "topics",
          "custom_topic",
          "custom_topic_mode",
          "intents",
          "custom_intent",
          "custom_intent_mode",
          "detect_entities",
          "detect_language",
          "diarize",
          "dictation",
          "encoding",
          "filler_words",
          "keyterm",
          "keywords",
          "language",
          "measurements",
          "model",
          "multichannel",
          "numerals",
          "paragraphs",
          "profanity_filter",
          "punctuate",
          "redact",
          "replace",
          "search",
          "smart_format",
          "utterances",
          "utt_split",
          "version",
          "mip_opt_out"
        ]);
        const _queryParams = {
          callback,
          callback_method: callbackMethod != null ? callbackMethod : void 0,
          extra,
          sentiment,
          summarize: summarize != null ? summarize : void 0,
          tag,
          topics,
          custom_topic: customTopic,
          custom_topic_mode: customTopicMode != null ? customTopicMode : void 0,
          intents,
          custom_intent: customIntent,
          custom_intent_mode: customIntentMode != null ? customIntentMode : void 0,
          detect_entities: detectEntities,
          detect_language: detectLanguage,
          diarize,
          dictation,
          encoding: encoding != null ? encoding : void 0,
          filler_words: fillerWords,
          keyterm,
          keywords,
          language,
          measurements,
          model: model != null ? model : void 0,
          multichannel,
          numerals,
          paragraphs,
          profanity_filter: profanityFilter,
          punctuate,
          redact,
          replace,
          search,
          smart_format: smartFormat,
          utterances,
          utt_split: uttSplit,
          version: version != null ? version : void 0,
          mip_opt_out: mipOptOut
        };
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_b = this._options) == null ? void 0 : _b.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_c = this._options.fetcher) != null ? _c : fetcher)({
          url: url_exports.join(
            (_e = yield Supplier.get(this._options.baseUrl)) != null ? _e : ((_d = yield Supplier.get(this._options.environment)) != null ? _d : DeepgramEnvironment.Production).base,
            "v1/listen"
          ),
          method: "POST",
          headers: _headers,
          contentType: "application/json",
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          requestType: "json",
          body: _body,
          timeoutMs: ((_h = (_g = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _g : (_f = this._options) == null ? void 0 : _f.timeoutInSeconds) != null ? _h : 60) * 1e3,
          maxRetries: (_j = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _j : (_i = this._options) == null ? void 0 : _i.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_k = this._options) == null ? void 0 : _k.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(_response.error, _response.rawResponse, "POST", "/v1/listen");
      });
    }
    /**
     * Transcribe audio and video using Deepgram's speech-to-text REST API
     *
     * @param {core.file.Uploadable} uploadable
     * @param {Deepgram.listen.v1.MediaTranscribeRequestOctetStream} request
     * @param {MediaClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     import { createReadStream } from "fs";
     *     await client.listen.v1.media.transcribeFile(createReadStream("path/to/file"), {})
     */
    transcribeFile(uploadable, request, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__transcribeFile(uploadable, request, requestOptions));
    }
    __transcribeFile(uploadable, request, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _queryParams = {
          callback: request.callback,
          callback_method: request.callback_method != null ? request.callback_method : void 0,
          extra: request.extra,
          sentiment: request.sentiment,
          summarize: request.summarize != null ? request.summarize : void 0,
          tag: request.tag,
          topics: request.topics,
          custom_topic: request.custom_topic,
          custom_topic_mode: request.custom_topic_mode != null ? request.custom_topic_mode : void 0,
          intents: request.intents,
          custom_intent: request.custom_intent,
          custom_intent_mode: request.custom_intent_mode != null ? request.custom_intent_mode : void 0,
          detect_entities: request.detect_entities,
          detect_language: request.detect_language,
          diarize: request.diarize,
          dictation: request.dictation,
          encoding: request.encoding != null ? request.encoding : void 0,
          filler_words: request.filler_words,
          keyterm: request.keyterm,
          keywords: request.keywords,
          language: request.language,
          measurements: request.measurements,
          model: request.model != null ? request.model : void 0,
          multichannel: request.multichannel,
          numerals: request.numerals,
          paragraphs: request.paragraphs,
          profanity_filter: request.profanity_filter,
          punctuate: request.punctuate,
          redact: request.redact,
          replace: request.replace,
          search: request.search,
          smart_format: request.smart_format,
          utterances: request.utterances,
          utt_split: request.utt_split,
          version: request.version != null ? request.version : void 0,
          mip_opt_out: request.mip_opt_out
        };
        const _binaryUploadRequest = yield file_exports.toBinaryUploadRequest(uploadable);
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          _binaryUploadRequest.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            "v1/listen"
          ),
          method: "POST",
          headers: _headers,
          contentType: "application/octet-stream",
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          requestType: "bytes",
          duplex: "half",
          body: _binaryUploadRequest.body,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(_response.error, _response.rawResponse, "POST", "/v1/listen");
      });
    }
  };

  // src/api/resources/listen/resources/v1/client/Socket.ts
  var V1Socket2 = class {
    constructor(args) {
      this.eventHandlers = {};
      this.handleOpen = () => {
        var _a, _b;
        (_b = (_a = this.eventHandlers).open) == null ? void 0 : _b.call(_a);
      };
      this.handleMessage = (event) => {
        var _a, _b;
        const data = fromJson(event.data);
        (_b = (_a = this.eventHandlers).message) == null ? void 0 : _b.call(_a, data);
      };
      this.handleClose = (event) => {
        var _a, _b;
        (_b = (_a = this.eventHandlers).close) == null ? void 0 : _b.call(_a, event);
      };
      this.handleError = (event) => {
        var _a, _b;
        const message = event.message;
        (_b = (_a = this.eventHandlers).error) == null ? void 0 : _b.call(_a, new Error(message));
      };
      this.socket = args.socket;
      this.socket.addEventListener("open", this.handleOpen);
      this.socket.addEventListener("message", this.handleMessage);
      this.socket.addEventListener("close", this.handleClose);
      this.socket.addEventListener("error", this.handleError);
    }
    /** The current state of the connection; this is one of the readyState constants. */
    get readyState() {
      return this.socket.readyState;
    }
    /**
     * @param event - The event to attach to.
     * @param callback - The callback to run when the event is triggered.
     * Usage:
     * ```typescript
     * this.on('open', () => {
     *     console.log('The websocket is open');
     * });
     * ```
     */
    on(event, callback) {
      this.eventHandlers[event] = callback;
    }
    sendMedia(message) {
      this.assertSocketIsOpen();
      this.sendBinary(message);
    }
    sendFinalize(message) {
      this.assertSocketIsOpen();
      this.sendJson(message);
    }
    sendCloseStream(message) {
      this.assertSocketIsOpen();
      this.sendJson(message);
    }
    sendKeepAlive(message) {
      this.assertSocketIsOpen();
      this.sendJson(message);
    }
    /** Connect to the websocket and register event handlers. */
    connect() {
      this.socket.reconnect();
      this.socket.addEventListener("open", this.handleOpen);
      this.socket.addEventListener("message", this.handleMessage);
      this.socket.addEventListener("close", this.handleClose);
      this.socket.addEventListener("error", this.handleError);
      return this;
    }
    /** Close the websocket and unregister event handlers. */
    close() {
      this.socket.close();
      this.handleClose({ code: 1e3 });
      this.socket.removeEventListener("open", this.handleOpen);
      this.socket.removeEventListener("message", this.handleMessage);
      this.socket.removeEventListener("close", this.handleClose);
      this.socket.removeEventListener("error", this.handleError);
    }
    /** Returns a promise that resolves when the websocket is open. */
    waitForOpen() {
      return __async(this, null, function* () {
        if (this.socket.readyState === ReconnectingWebSocket.OPEN) {
          return this.socket;
        }
        return new Promise((resolve, reject) => {
          this.socket.addEventListener("open", () => {
            resolve(this.socket);
          });
          this.socket.addEventListener("error", (event) => {
            reject(event);
          });
        });
      });
    }
    /** Asserts that the websocket is open. */
    assertSocketIsOpen() {
      if (!this.socket) {
        throw new Error("Socket is not connected.");
      }
      if (this.socket.readyState !== ReconnectingWebSocket.OPEN) {
        throw new Error("Socket is not open.");
      }
    }
    /** Send a binary payload to the websocket. */
    sendBinary(payload) {
      this.socket.send(payload);
    }
    /** Send a JSON payload to the websocket. */
    sendJson(payload) {
      const jsonPayload = toJson(payload);
      this.socket.send(jsonPayload);
    }
  };

  // src/api/resources/listen/resources/v1/client/Client.ts
  var V1Client3 = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get media() {
      var _a;
      return (_a = this._media) != null ? _a : this._media = new MediaClient(this._options);
    }
    connect(args) {
      return __async(this, null, function* () {
        var _a, _b;
        const {
          callback,
          callback_method: callbackMethod,
          channels,
          detect_entities: detectEntities,
          diarize,
          dictation,
          encoding,
          endpointing,
          extra,
          interim_results: interimResults,
          keyterm,
          keywords,
          language,
          mip_opt_out: mipOptOut,
          model,
          multichannel,
          numerals,
          profanity_filter: profanityFilter,
          punctuate,
          redact,
          replace,
          sample_rate: sampleRate,
          search,
          smart_format: smartFormat,
          tag,
          utterance_end_ms: utteranceEndMs,
          vad_events: vadEvents,
          version,
          headers,
          debug,
          reconnectAttempts
        } = args;
        const _queryParams = {
          callback,
          callback_method: callbackMethod,
          channels,
          detect_entities: detectEntities,
          diarize,
          dictation,
          encoding,
          endpointing,
          extra,
          interim_results: interimResults,
          keyterm,
          keywords,
          language,
          mip_opt_out: mipOptOut,
          model,
          multichannel,
          numerals,
          profanity_filter: profanityFilter,
          punctuate,
          redact,
          replace,
          sample_rate: sampleRate,
          search,
          smart_format: smartFormat,
          tag,
          utterance_end_ms: utteranceEndMs,
          vad_events: vadEvents,
          version
        };
        const _headers = mergeHeaders(
          mergeOnlyDefinedHeaders({ Authorization: args.Authorization }),
          headers
        );
        const socket = new ReconnectingWebSocket({
          url: url_exports.join(
            (_b = yield Supplier.get(this._options.baseUrl)) != null ? _b : ((_a = yield Supplier.get(this._options.environment)) != null ? _a : DeepgramEnvironment.Production).production,
            "/v1/listen"
          ),
          protocols: [],
          queryParameters: _queryParams,
          headers: _headers,
          options: { debug: debug != null ? debug : false, maxRetries: reconnectAttempts != null ? reconnectAttempts : 30 }
        });
        return new V1Socket2({ socket });
      });
    }
  };

  // src/api/resources/listen/resources/v2/client/Socket.ts
  var V2Socket = class {
    constructor(args) {
      this.eventHandlers = {};
      this.handleOpen = () => {
        var _a, _b;
        (_b = (_a = this.eventHandlers).open) == null ? void 0 : _b.call(_a);
      };
      this.handleMessage = (event) => {
        var _a, _b;
        const data = fromJson(event.data);
        (_b = (_a = this.eventHandlers).message) == null ? void 0 : _b.call(_a, data);
      };
      this.handleClose = (event) => {
        var _a, _b;
        (_b = (_a = this.eventHandlers).close) == null ? void 0 : _b.call(_a, event);
      };
      this.handleError = (event) => {
        var _a, _b;
        const message = event.message;
        (_b = (_a = this.eventHandlers).error) == null ? void 0 : _b.call(_a, new Error(message));
      };
      this.socket = args.socket;
      this.socket.addEventListener("open", this.handleOpen);
      this.socket.addEventListener("message", this.handleMessage);
      this.socket.addEventListener("close", this.handleClose);
      this.socket.addEventListener("error", this.handleError);
    }
    /** The current state of the connection; this is one of the readyState constants. */
    get readyState() {
      return this.socket.readyState;
    }
    /**
     * @param event - The event to attach to.
     * @param callback - The callback to run when the event is triggered.
     * Usage:
     * ```typescript
     * this.on('open', () => {
     *     console.log('The websocket is open');
     * });
     * ```
     */
    on(event, callback) {
      this.eventHandlers[event] = callback;
    }
    sendMedia(message) {
      this.assertSocketIsOpen();
      this.sendBinary(message);
    }
    sendCloseStream(message) {
      this.assertSocketIsOpen();
      this.sendJson(message);
    }
    /** Connect to the websocket and register event handlers. */
    connect() {
      this.socket.reconnect();
      this.socket.addEventListener("open", this.handleOpen);
      this.socket.addEventListener("message", this.handleMessage);
      this.socket.addEventListener("close", this.handleClose);
      this.socket.addEventListener("error", this.handleError);
      return this;
    }
    /** Close the websocket and unregister event handlers. */
    close() {
      this.socket.close();
      this.handleClose({ code: 1e3 });
      this.socket.removeEventListener("open", this.handleOpen);
      this.socket.removeEventListener("message", this.handleMessage);
      this.socket.removeEventListener("close", this.handleClose);
      this.socket.removeEventListener("error", this.handleError);
    }
    /** Returns a promise that resolves when the websocket is open. */
    waitForOpen() {
      return __async(this, null, function* () {
        if (this.socket.readyState === ReconnectingWebSocket.OPEN) {
          return this.socket;
        }
        return new Promise((resolve, reject) => {
          this.socket.addEventListener("open", () => {
            resolve(this.socket);
          });
          this.socket.addEventListener("error", (event) => {
            reject(event);
          });
        });
      });
    }
    /** Asserts that the websocket is open. */
    assertSocketIsOpen() {
      if (!this.socket) {
        throw new Error("Socket is not connected.");
      }
      if (this.socket.readyState !== ReconnectingWebSocket.OPEN) {
        throw new Error("Socket is not open.");
      }
    }
    /** Send a binary payload to the websocket. */
    sendBinary(payload) {
      this.socket.send(payload);
    }
    /** Send a JSON payload to the websocket. */
    sendJson(payload) {
      const jsonPayload = toJson(payload);
      this.socket.send(jsonPayload);
    }
  };

  // src/api/resources/listen/resources/v2/client/Client.ts
  var V2Client = class {
    constructor(options = {}) {
      this._options = normalizeClientOptions(options);
    }
    connect(args) {
      return __async(this, null, function* () {
        var _a, _b;
        const {
          model,
          encoding,
          sample_rate: sampleRate,
          eager_eot_threshold: eagerEotThreshold,
          eot_threshold: eotThreshold,
          eot_timeout_ms: eotTimeoutMs,
          keyterm,
          mip_opt_out: mipOptOut,
          tag,
          headers,
          debug,
          reconnectAttempts
        } = args;
        const _queryParams = {
          model,
          encoding,
          sample_rate: sampleRate,
          eager_eot_threshold: eagerEotThreshold,
          eot_threshold: eotThreshold,
          eot_timeout_ms: eotTimeoutMs,
          keyterm,
          mip_opt_out: mipOptOut,
          tag
        };
        const _headers = mergeHeaders(
          mergeOnlyDefinedHeaders({ Authorization: args.Authorization }),
          headers
        );
        const socket = new ReconnectingWebSocket({
          url: url_exports.join(
            (_b = yield Supplier.get(this._options.baseUrl)) != null ? _b : ((_a = yield Supplier.get(this._options.environment)) != null ? _a : DeepgramEnvironment.Production).production,
            "/v2/listen"
          ),
          protocols: [],
          queryParameters: _queryParams,
          headers: _headers,
          options: { debug: debug != null ? debug : false, maxRetries: reconnectAttempts != null ? reconnectAttempts : 30 }
        });
        return new V2Socket({ socket });
      });
    }
  };

  // src/api/resources/listen/client/Client.ts
  var ListenClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get v1() {
      var _a;
      return (_a = this._v1) != null ? _a : this._v1 = new V1Client3(this._options);
    }
    get v2() {
      var _a;
      return (_a = this._v2) != null ? _a : this._v2 = new V2Client(this._options);
    }
  };

  // src/api/resources/manage/resources/v1/resources/models/client/Client.ts
  var ModelsClient2 = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Returns metadata on all the latest public models. To retrieve custom models, use Get Project Models.
     *
     * @param {Deepgram.manage.v1.ModelsListRequest} request
     * @param {ModelsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.models.list({
     *         include_outdated: true
     *     })
     */
    list(request = {}, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__list(request, requestOptions));
    }
    __list() {
      return __async(this, arguments, function* (request = {}, requestOptions) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const { include_outdated: includeOutdated } = request;
        const _queryParams = {
          include_outdated: includeOutdated
        };
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            "v1/models"
          ),
          method: "GET",
          headers: _headers,
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(_response.error, _response.rawResponse, "GET", "/v1/models");
      });
    }
    /**
     * Returns metadata for a specific public model
     *
     * @param {string} model_id - The specific UUID of the model
     * @param {ModelsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.models.get("af6e9977-99f6-4d8f-b6f5-dfdf6fb6e291")
     */
    get(model_id, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__get(model_id, requestOptions));
    }
    __get(model_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/models/${url_exports.encodePathParam(model_id)}`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(_response.error, _response.rawResponse, "GET", "/v1/models/{model_id}");
      });
    }
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/billing/resources/balances/client/Client.ts
  var BalancesClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Generates a list of outstanding balances for the specified project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {BalancesClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.billing.balances.list("123456-7890-1234-5678-901234")
     */
    list(project_id, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__list(project_id, requestOptions));
    }
    __list(project_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/balances`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/balances"
        );
      });
    }
    /**
     * Retrieves details about the specified balance
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {string} balance_id - The unique identifier of the balance
     * @param {BalancesClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.billing.balances.get("123456-7890-1234-5678-901234", "123456-7890-1234-5678-901234")
     */
    get(project_id, balance_id, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__get(project_id, balance_id, requestOptions));
    }
    __get(project_id, balance_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/balances/${url_exports.encodePathParam(balance_id)}`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/balances/{balance_id}"
        );
      });
    }
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/billing/resources/breakdown/client/Client.ts
  var BreakdownClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Retrieves the billing summary for a specific project, with various filter options or by grouping options.
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {Deepgram.manage.v1.projects.billing.BreakdownListRequest} request
     * @param {BreakdownClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.billing.breakdown.list("123456-7890-1234-5678-901234", {
     *         start: "start",
     *         end: "end",
     *         accessor: "12345678-1234-1234-1234-123456789012",
     *         deployment: "hosted",
     *         tag: "tag1",
     *         line_item: "streaming::nova-3"
     *     })
     */
    list(project_id, request = {}, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__list(project_id, request, requestOptions));
    }
    __list(_0) {
      return __async(this, arguments, function* (project_id, request = {}, requestOptions) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const { start, end, accessor, deployment, tag, line_item: lineItem, grouping } = request;
        const _queryParams = {
          start,
          end,
          accessor,
          deployment: deployment != null ? deployment : void 0,
          tag,
          line_item: lineItem,
          grouping: Array.isArray(grouping) ? grouping.map((item) => item) : grouping != null ? grouping : void 0
        };
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/billing/breakdown`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/billing/breakdown"
        );
      });
    }
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/billing/resources/fields/client/Client.ts
  var FieldsClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Lists the accessors, deployment types, tags, and line items used for billing data in the specified time period. Use this endpoint if you want to filter your results from the Billing Breakdown endpoint and want to know what filters are available.
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {Deepgram.manage.v1.projects.billing.FieldsListRequest} request
     * @param {FieldsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.billing.fields.list("123456-7890-1234-5678-901234", {
     *         start: "start",
     *         end: "end"
     *     })
     */
    list(project_id, request = {}, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__list(project_id, request, requestOptions));
    }
    __list(_0) {
      return __async(this, arguments, function* (project_id, request = {}, requestOptions) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const { start, end } = request;
        const _queryParams = {
          start,
          end
        };
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/billing/fields`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/billing/fields"
        );
      });
    }
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/billing/resources/purchases/client/Client.ts
  var PurchasesClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Returns the original purchased amount on an order transaction
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {Deepgram.manage.v1.projects.billing.PurchasesListRequest} request
     * @param {PurchasesClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.billing.purchases.list("123456-7890-1234-5678-901234", {
     *         limit: 1.1
     *     })
     */
    list(project_id, request = {}, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__list(project_id, request, requestOptions));
    }
    __list(_0) {
      return __async(this, arguments, function* (project_id, request = {}, requestOptions) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const { limit } = request;
        const _queryParams = {
          limit
        };
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/purchases`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/purchases"
        );
      });
    }
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/billing/client/Client.ts
  var BillingClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get balances() {
      var _a;
      return (_a = this._balances) != null ? _a : this._balances = new BalancesClient(this._options);
    }
    get breakdown() {
      var _a;
      return (_a = this._breakdown) != null ? _a : this._breakdown = new BreakdownClient(this._options);
    }
    get fields() {
      var _a;
      return (_a = this._fields) != null ? _a : this._fields = new FieldsClient(this._options);
    }
    get purchases() {
      var _a;
      return (_a = this._purchases) != null ? _a : this._purchases = new PurchasesClient(this._options);
    }
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/keys/client/Client.ts
  var KeysClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Retrieves all API keys associated with the specified project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {Deepgram.manage.v1.projects.KeysListRequest} request
     * @param {KeysClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.keys.list("123456-7890-1234-5678-901234", {
     *         status: "active"
     *     })
     */
    list(project_id, request = {}, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__list(project_id, request, requestOptions));
    }
    __list(_0) {
      return __async(this, arguments, function* (project_id, request = {}, requestOptions) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const { status } = request;
        const _queryParams = {
          status: status != null ? status : void 0
        };
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/keys`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/keys"
        );
      });
    }
    /**
     * Creates a new API key with specified settings for the project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {Deepgram.CreateKeyV1RequestOne} request
     * @param {KeysClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.keys.create("project_id", {
     *         "key": "value"
     *     })
     */
    create(project_id, request, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__create(project_id, request, requestOptions));
    }
    __create(project_id, request, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/keys`
          ),
          method: "POST",
          headers: _headers,
          contentType: "application/json",
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          requestType: "json",
          body: request,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "POST",
          "/v1/projects/{project_id}/keys"
        );
      });
    }
    /**
     * Retrieves information about a specified API key
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {string} key_id - The unique identifier of the API key
     * @param {KeysClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.keys.get("123456-7890-1234-5678-901234", "123456789012345678901234")
     */
    get(project_id, key_id, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__get(project_id, key_id, requestOptions));
    }
    __get(project_id, key_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/keys/${url_exports.encodePathParam(key_id)}`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/keys/{key_id}"
        );
      });
    }
    /**
     * Deletes an API key for a specific project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {string} key_id - The unique identifier of the API key
     * @param {KeysClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.keys.delete("123456-7890-1234-5678-901234", "123456789012345678901234")
     */
    delete(project_id, key_id, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__delete(project_id, key_id, requestOptions));
    }
    __delete(project_id, key_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/keys/${url_exports.encodePathParam(key_id)}`
          ),
          method: "DELETE",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "DELETE",
          "/v1/projects/{project_id}/keys/{key_id}"
        );
      });
    }
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/members/resources/invites/client/Client.ts
  var InvitesClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Generates a list of invites for a specific project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {InvitesClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.members.invites.list("123456-7890-1234-5678-901234")
     */
    list(project_id, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__list(project_id, requestOptions));
    }
    __list(project_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/invites`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/invites"
        );
      });
    }
    /**
     * Generates an invite for a specific project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {Deepgram.manage.v1.projects.members.CreateProjectInviteV1Request} request
     * @param {InvitesClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.members.invites.create("123456-7890-1234-5678-901234", {
     *         email: "email",
     *         scope: "scope"
     *     })
     */
    create(project_id, request, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__create(project_id, request, requestOptions));
    }
    __create(project_id, request, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/invites`
          ),
          method: "POST",
          headers: _headers,
          contentType: "application/json",
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          requestType: "json",
          body: request,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "POST",
          "/v1/projects/{project_id}/invites"
        );
      });
    }
    /**
     * Deletes an invite for a specific project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {string} email - The email address of the member
     * @param {InvitesClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.members.invites.delete("123456-7890-1234-5678-901234", "john.doe@example.com")
     */
    delete(project_id, email, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__delete(project_id, email, requestOptions));
    }
    __delete(project_id, email, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/invites/${url_exports.encodePathParam(email)}`
          ),
          method: "DELETE",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "DELETE",
          "/v1/projects/{project_id}/invites/{email}"
        );
      });
    }
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/members/resources/scopes/client/Client.ts
  var ScopesClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Retrieves a list of scopes for a specific member
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {string} member_id - The unique identifier of the Member
     * @param {ScopesClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.members.scopes.list("123456-7890-1234-5678-901234", "123456789012345678901234")
     */
    list(project_id, member_id, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__list(project_id, member_id, requestOptions));
    }
    __list(project_id, member_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/members/${url_exports.encodePathParam(member_id)}/scopes`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/members/{member_id}/scopes"
        );
      });
    }
    /**
     * Updates the scopes for a specific member
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {string} member_id - The unique identifier of the Member
     * @param {Deepgram.manage.v1.projects.members.UpdateProjectMemberScopesV1Request} request
     * @param {ScopesClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.members.scopes.update("123456-7890-1234-5678-901234", "123456789012345678901234", {
     *         scope: "admin"
     *     })
     */
    update(project_id, member_id, request, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__update(project_id, member_id, request, requestOptions));
    }
    __update(project_id, member_id, request, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/members/${url_exports.encodePathParam(member_id)}/scopes`
          ),
          method: "PUT",
          headers: _headers,
          contentType: "application/json",
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          requestType: "json",
          body: request,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "PUT",
          "/v1/projects/{project_id}/members/{member_id}/scopes"
        );
      });
    }
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/members/client/Client.ts
  var MembersClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get invites() {
      var _a;
      return (_a = this._invites) != null ? _a : this._invites = new InvitesClient(this._options);
    }
    get scopes() {
      var _a;
      return (_a = this._scopes) != null ? _a : this._scopes = new ScopesClient(this._options);
    }
    /**
     * Retrieves a list of members for a given project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {MembersClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.members.list("123456-7890-1234-5678-901234")
     */
    list(project_id, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__list(project_id, requestOptions));
    }
    __list(project_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/members`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/members"
        );
      });
    }
    /**
     * Removes a member from the project using their unique member ID
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {string} member_id - The unique identifier of the Member
     * @param {MembersClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.members.delete("123456-7890-1234-5678-901234", "123456789012345678901234")
     */
    delete(project_id, member_id, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__delete(project_id, member_id, requestOptions));
    }
    __delete(project_id, member_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/members/${url_exports.encodePathParam(member_id)}`
          ),
          method: "DELETE",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "DELETE",
          "/v1/projects/{project_id}/members/{member_id}"
        );
      });
    }
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/models/client/Client.ts
  var ModelsClient3 = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Returns metadata on all the latest models that a specific project has access to, including non-public models
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {Deepgram.manage.v1.projects.ModelsListRequest} request
     * @param {ModelsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.models.list("123456-7890-1234-5678-901234", {
     *         include_outdated: true
     *     })
     */
    list(project_id, request = {}, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__list(project_id, request, requestOptions));
    }
    __list(_0) {
      return __async(this, arguments, function* (project_id, request = {}, requestOptions) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const { include_outdated: includeOutdated } = request;
        const _queryParams = {
          include_outdated: includeOutdated
        };
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/models`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/models"
        );
      });
    }
    /**
     * Returns metadata for a specific model
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {string} model_id - The specific UUID of the model
     * @param {ModelsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.models.get("123456-7890-1234-5678-901234", "af6e9977-99f6-4d8f-b6f5-dfdf6fb6e291")
     */
    get(project_id, model_id, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__get(project_id, model_id, requestOptions));
    }
    __get(project_id, model_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/models/${url_exports.encodePathParam(model_id)}`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/models/{model_id}"
        );
      });
    }
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/requests/client/Client.ts
  var RequestsClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Generates a list of requests for a specific project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {Deepgram.manage.v1.projects.RequestsListRequest} request
     * @param {RequestsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.requests.list("123456-7890-1234-5678-901234", {
     *         start: "2024-01-15T09:30:00Z",
     *         end: "2024-01-15T09:30:00Z",
     *         limit: 1.1,
     *         page: 1.1,
     *         accessor: "12345678-1234-1234-1234-123456789012",
     *         request_id: "12345678-1234-1234-1234-123456789012",
     *         deployment: "hosted",
     *         endpoint: "listen",
     *         method: "sync",
     *         status: "succeeded"
     *     })
     */
    list(project_id, request = {}, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__list(project_id, request, requestOptions));
    }
    __list(_0) {
      return __async(this, arguments, function* (project_id, request = {}, requestOptions) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const {
          start,
          end,
          limit,
          page,
          accessor,
          request_id: requestId,
          deployment,
          endpoint,
          method,
          status
        } = request;
        const _queryParams = {
          start: start != null ? start : void 0,
          end: end != null ? end : void 0,
          limit,
          page,
          accessor,
          request_id: requestId,
          deployment: deployment != null ? deployment : void 0,
          endpoint: endpoint != null ? endpoint : void 0,
          method: method != null ? method : void 0,
          status: status != null ? status : void 0
        };
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/requests`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/requests"
        );
      });
    }
    /**
     * Retrieves a specific request for a specific project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {string} request_id - The unique identifier of the request
     * @param {RequestsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.requests.get("123456-7890-1234-5678-901234", "123456-7890-1234-5678-901234")
     */
    get(project_id, request_id, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__get(project_id, request_id, requestOptions));
    }
    __get(project_id, request_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/requests/${url_exports.encodePathParam(request_id)}`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/requests/{request_id}"
        );
      });
    }
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/usage/resources/breakdown/client/Client.ts
  var BreakdownClient2 = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Retrieves the usage breakdown for a specific project, with various filter options by API feature or by groupings. Setting a feature (e.g. diarize) to true includes requests that used that feature, while false excludes requests that used it. Multiple true filters are combined with OR logic, while false filters use AND logic.
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {Deepgram.manage.v1.projects.usage.BreakdownGetRequest} request
     * @param {BreakdownClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.usage.breakdown.get("123456-7890-1234-5678-901234", {
     *         start: "start",
     *         end: "end",
     *         grouping: "accessor",
     *         accessor: "12345678-1234-1234-1234-123456789012",
     *         alternatives: true,
     *         callback_method: true,
     *         callback: true,
     *         channels: true,
     *         custom_intent_mode: true,
     *         custom_intent: true,
     *         custom_topic_mode: true,
     *         custom_topic: true,
     *         deployment: "hosted",
     *         detect_entities: true,
     *         detect_language: true,
     *         diarize: true,
     *         dictation: true,
     *         encoding: true,
     *         endpoint: "listen",
     *         extra: true,
     *         filler_words: true,
     *         intents: true,
     *         keyterm: true,
     *         keywords: true,
     *         language: true,
     *         measurements: true,
     *         method: "sync",
     *         model: "6f548761-c9c0-429a-9315-11a1d28499c8",
     *         multichannel: true,
     *         numerals: true,
     *         paragraphs: true,
     *         profanity_filter: true,
     *         punctuate: true,
     *         redact: true,
     *         replace: true,
     *         sample_rate: true,
     *         search: true,
     *         sentiment: true,
     *         smart_format: true,
     *         summarize: true,
     *         tag: "tag1",
     *         topics: true,
     *         utt_split: true,
     *         utterances: true,
     *         version: true
     *     })
     */
    get(project_id, request = {}, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__get(project_id, request, requestOptions));
    }
    __get(_0) {
      return __async(this, arguments, function* (project_id, request = {}, requestOptions) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const {
          start,
          end,
          grouping,
          accessor,
          alternatives,
          callback_method: callbackMethod,
          callback,
          channels,
          custom_intent_mode: customIntentMode,
          custom_intent: customIntent,
          custom_topic_mode: customTopicMode,
          custom_topic: customTopic,
          deployment,
          detect_entities: detectEntities,
          detect_language: detectLanguage,
          diarize,
          dictation,
          encoding,
          endpoint,
          extra,
          filler_words: fillerWords,
          intents,
          keyterm,
          keywords,
          language,
          measurements,
          method,
          model,
          multichannel,
          numerals,
          paragraphs,
          profanity_filter: profanityFilter,
          punctuate,
          redact,
          replace,
          sample_rate: sampleRate,
          search,
          sentiment,
          smart_format: smartFormat,
          summarize,
          tag,
          topics,
          utt_split: uttSplit,
          utterances,
          version
        } = request;
        const _queryParams = {
          start,
          end,
          grouping: grouping != null ? grouping : void 0,
          accessor,
          alternatives,
          callback_method: callbackMethod,
          callback,
          channels,
          custom_intent_mode: customIntentMode,
          custom_intent: customIntent,
          custom_topic_mode: customTopicMode,
          custom_topic: customTopic,
          deployment: deployment != null ? deployment : void 0,
          detect_entities: detectEntities,
          detect_language: detectLanguage,
          diarize,
          dictation,
          encoding,
          endpoint: endpoint != null ? endpoint : void 0,
          extra,
          filler_words: fillerWords,
          intents,
          keyterm,
          keywords,
          language,
          measurements,
          method: method != null ? method : void 0,
          model,
          multichannel,
          numerals,
          paragraphs,
          profanity_filter: profanityFilter,
          punctuate,
          redact,
          replace,
          sample_rate: sampleRate,
          search,
          sentiment,
          smart_format: smartFormat,
          summarize,
          tag,
          topics,
          utt_split: uttSplit,
          utterances,
          version
        };
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/usage/breakdown`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/usage/breakdown"
        );
      });
    }
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/usage/resources/fields/client/Client.ts
  var FieldsClient2 = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Lists the features, models, tags, languages, and processing method used for requests in the specified project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {Deepgram.manage.v1.projects.usage.FieldsListRequest} request
     * @param {FieldsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.usage.fields.list("123456-7890-1234-5678-901234", {
     *         start: "start",
     *         end: "end"
     *     })
     */
    list(project_id, request = {}, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__list(project_id, request, requestOptions));
    }
    __list(_0) {
      return __async(this, arguments, function* (project_id, request = {}, requestOptions) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const { start, end } = request;
        const _queryParams = {
          start,
          end
        };
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/usage/fields`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/usage/fields"
        );
      });
    }
  };

  // src/api/resources/manage/resources/v1/resources/projects/resources/usage/client/Client.ts
  var UsageClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get breakdown() {
      var _a;
      return (_a = this._breakdown) != null ? _a : this._breakdown = new BreakdownClient2(this._options);
    }
    get fields() {
      var _a;
      return (_a = this._fields) != null ? _a : this._fields = new FieldsClient2(this._options);
    }
    /**
     * Retrieves the usage for a specific project. Use Get Project Usage Breakdown for a more comprehensive usage summary.
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {Deepgram.manage.v1.projects.UsageGetRequest} request
     * @param {UsageClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.usage.get("123456-7890-1234-5678-901234", {
     *         start: "start",
     *         end: "end",
     *         accessor: "12345678-1234-1234-1234-123456789012",
     *         alternatives: true,
     *         callback_method: true,
     *         callback: true,
     *         channels: true,
     *         custom_intent_mode: true,
     *         custom_intent: true,
     *         custom_topic_mode: true,
     *         custom_topic: true,
     *         deployment: "hosted",
     *         detect_entities: true,
     *         detect_language: true,
     *         diarize: true,
     *         dictation: true,
     *         encoding: true,
     *         endpoint: "listen",
     *         extra: true,
     *         filler_words: true,
     *         intents: true,
     *         keyterm: true,
     *         keywords: true,
     *         language: true,
     *         measurements: true,
     *         method: "sync",
     *         model: "6f548761-c9c0-429a-9315-11a1d28499c8",
     *         multichannel: true,
     *         numerals: true,
     *         paragraphs: true,
     *         profanity_filter: true,
     *         punctuate: true,
     *         redact: true,
     *         replace: true,
     *         sample_rate: true,
     *         search: true,
     *         sentiment: true,
     *         smart_format: true,
     *         summarize: true,
     *         tag: "tag1",
     *         topics: true,
     *         utt_split: true,
     *         utterances: true,
     *         version: true
     *     })
     */
    get(project_id, request = {}, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__get(project_id, request, requestOptions));
    }
    __get(_0) {
      return __async(this, arguments, function* (project_id, request = {}, requestOptions) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const {
          start,
          end,
          accessor,
          alternatives,
          callback_method: callbackMethod,
          callback,
          channels,
          custom_intent_mode: customIntentMode,
          custom_intent: customIntent,
          custom_topic_mode: customTopicMode,
          custom_topic: customTopic,
          deployment,
          detect_entities: detectEntities,
          detect_language: detectLanguage,
          diarize,
          dictation,
          encoding,
          endpoint,
          extra,
          filler_words: fillerWords,
          intents,
          keyterm,
          keywords,
          language,
          measurements,
          method,
          model,
          multichannel,
          numerals,
          paragraphs,
          profanity_filter: profanityFilter,
          punctuate,
          redact,
          replace,
          sample_rate: sampleRate,
          search,
          sentiment,
          smart_format: smartFormat,
          summarize,
          tag,
          topics,
          utt_split: uttSplit,
          utterances,
          version
        } = request;
        const _queryParams = {
          start,
          end,
          accessor,
          alternatives,
          callback_method: callbackMethod,
          callback,
          channels,
          custom_intent_mode: customIntentMode,
          custom_intent: customIntent,
          custom_topic_mode: customTopicMode,
          custom_topic: customTopic,
          deployment: deployment != null ? deployment : void 0,
          detect_entities: detectEntities,
          detect_language: detectLanguage,
          diarize,
          dictation,
          encoding,
          endpoint: endpoint != null ? endpoint : void 0,
          extra,
          filler_words: fillerWords,
          intents,
          keyterm,
          keywords,
          language,
          measurements,
          method: method != null ? method : void 0,
          model,
          multichannel,
          numerals,
          paragraphs,
          profanity_filter: profanityFilter,
          punctuate,
          redact,
          replace,
          sample_rate: sampleRate,
          search,
          sentiment,
          smart_format: smartFormat,
          summarize,
          tag,
          topics,
          utt_split: uttSplit,
          utterances,
          version
        };
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/usage`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/usage"
        );
      });
    }
  };

  // src/api/resources/manage/resources/v1/resources/projects/client/Client.ts
  var ProjectsClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get keys() {
      var _a;
      return (_a = this._keys) != null ? _a : this._keys = new KeysClient(this._options);
    }
    get members() {
      var _a;
      return (_a = this._members) != null ? _a : this._members = new MembersClient(this._options);
    }
    get models() {
      var _a;
      return (_a = this._models) != null ? _a : this._models = new ModelsClient3(this._options);
    }
    get requests() {
      var _a;
      return (_a = this._requests) != null ? _a : this._requests = new RequestsClient(this._options);
    }
    get usage() {
      var _a;
      return (_a = this._usage) != null ? _a : this._usage = new UsageClient(this._options);
    }
    get billing() {
      var _a;
      return (_a = this._billing) != null ? _a : this._billing = new BillingClient(this._options);
    }
    /**
     * Retrieves basic information about the projects associated with the API key
     *
     * @param {ProjectsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.list()
     */
    list(requestOptions) {
      return HttpResponsePromise.fromPromise(this.__list(requestOptions));
    }
    __list(requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            "v1/projects"
          ),
          method: "GET",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(_response.error, _response.rawResponse, "GET", "/v1/projects");
      });
    }
    /**
     * Retrieves information about the specified project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {Deepgram.manage.v1.ProjectsGetRequest} request
     * @param {ProjectsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.get("123456-7890-1234-5678-901234", {
     *         limit: 1.1,
     *         page: 1.1
     *     })
     */
    get(project_id, request = {}, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__get(project_id, request, requestOptions));
    }
    __get(_0) {
      return __async(this, arguments, function* (project_id, request = {}, requestOptions) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const { limit, page } = request;
        const _queryParams = {
          limit,
          page
        };
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(_response.error, _response.rawResponse, "GET", "/v1/projects/{project_id}");
      });
    }
    /**
     * Deletes the specified project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {ProjectsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.delete("123456-7890-1234-5678-901234")
     */
    delete(project_id, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__delete(project_id, requestOptions));
    }
    __delete(project_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}`
          ),
          method: "DELETE",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(_response.error, _response.rawResponse, "DELETE", "/v1/projects/{project_id}");
      });
    }
    /**
     * Updates the name or other properties of an existing project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {Deepgram.manage.v1.UpdateProjectV1Request} request
     * @param {ProjectsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.update("123456-7890-1234-5678-901234")
     */
    update(project_id, request = {}, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__update(project_id, request, requestOptions));
    }
    __update(_0) {
      return __async(this, arguments, function* (project_id, request = {}, requestOptions) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}`
          ),
          method: "PATCH",
          headers: _headers,
          contentType: "application/json",
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          requestType: "json",
          body: request,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(_response.error, _response.rawResponse, "PATCH", "/v1/projects/{project_id}");
      });
    }
    /**
     * Removes the authenticated account from the specific project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {ProjectsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.manage.v1.projects.leave("123456-7890-1234-5678-901234")
     */
    leave(project_id, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__leave(project_id, requestOptions));
    }
    __leave(project_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/leave`
          ),
          method: "DELETE",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "DELETE",
          "/v1/projects/{project_id}/leave"
        );
      });
    }
  };

  // src/api/resources/manage/resources/v1/client/Client.ts
  var V1Client4 = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get models() {
      var _a;
      return (_a = this._models) != null ? _a : this._models = new ModelsClient2(this._options);
    }
    get projects() {
      var _a;
      return (_a = this._projects) != null ? _a : this._projects = new ProjectsClient(this._options);
    }
  };

  // src/api/resources/manage/client/Client.ts
  var ManageClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get v1() {
      var _a;
      return (_a = this._v1) != null ? _a : this._v1 = new V1Client4(this._options);
    }
  };

  // src/api/resources/read/resources/v1/resources/text/client/Client.ts
  var TextClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Analyze text content using Deepgrams text analysis API
     *
     * @param {Deepgram.read.v1.TextAnalyzeRequest} request
     * @param {TextClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.read.v1.text.analyze({
     *         callback: "callback",
     *         callback_method: "POST",
     *         sentiment: true,
     *         summarize: "v2",
     *         tag: "tag",
     *         topics: true,
     *         custom_topic: "custom_topic",
     *         custom_topic_mode: "extended",
     *         intents: true,
     *         custom_intent: "custom_intent",
     *         custom_intent_mode: "extended",
     *         language: "language",
     *         body: {
     *             url: "url"
     *         }
     *     })
     */
    analyze(request, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__analyze(request, requestOptions));
    }
    __analyze(request, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const {
          callback,
          callback_method: callbackMethod,
          sentiment,
          summarize,
          tag,
          topics,
          custom_topic: customTopic,
          custom_topic_mode: customTopicMode,
          intents,
          custom_intent: customIntent,
          custom_intent_mode: customIntentMode,
          language,
          body: _body
        } = request;
        const _queryParams = {
          callback,
          callback_method: callbackMethod != null ? callbackMethod : void 0,
          sentiment,
          summarize: summarize != null ? summarize : void 0,
          tag,
          topics,
          custom_topic: customTopic,
          custom_topic_mode: customTopicMode != null ? customTopicMode : void 0,
          intents,
          custom_intent: customIntent,
          custom_intent_mode: customIntentMode != null ? customIntentMode : void 0,
          language
        };
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            "v1/read"
          ),
          method: "POST",
          headers: _headers,
          contentType: "application/json",
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          requestType: "json",
          body: _body,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(_response.error, _response.rawResponse, "POST", "/v1/read");
      });
    }
  };

  // src/api/resources/read/resources/v1/client/Client.ts
  var V1Client5 = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get text() {
      var _a;
      return (_a = this._text) != null ? _a : this._text = new TextClient(this._options);
    }
  };

  // src/api/resources/read/client/Client.ts
  var ReadClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get v1() {
      var _a;
      return (_a = this._v1) != null ? _a : this._v1 = new V1Client5(this._options);
    }
  };

  // src/api/resources/selfHosted/resources/v1/resources/distributionCredentials/client/Client.ts
  var DistributionCredentialsClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Lists sets of distribution credentials for the specified project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {DistributionCredentialsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.selfHosted.v1.distributionCredentials.list("123456-7890-1234-5678-901234")
     */
    list(project_id, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__list(project_id, requestOptions));
    }
    __list(project_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/self-hosted/distribution/credentials`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/self-hosted/distribution/credentials"
        );
      });
    }
    /**
     * Creates a set of distribution credentials for the specified project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {Deepgram.selfHosted.v1.CreateProjectDistributionCredentialsV1Request} request
     * @param {DistributionCredentialsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.selfHosted.v1.distributionCredentials.create("123456-7890-1234-5678-901234", {
     *         provider: "quay"
     *     })
     */
    create(project_id, request = {}, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__create(project_id, request, requestOptions));
    }
    __create(_0) {
      return __async(this, arguments, function* (project_id, request = {}, requestOptions) {
        var _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
        const _a = request, { scopes, provider } = _a, _body = __objRest(_a, ["scopes", "provider"]);
        const _queryParams = {
          scopes: Array.isArray(scopes) ? scopes.map((item) => item) : scopes != null ? scopes : void 0,
          provider: provider != null ? provider : void 0
        };
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_b = this._options) == null ? void 0 : _b.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_c = this._options.fetcher) != null ? _c : fetcher)({
          url: url_exports.join(
            (_e = yield Supplier.get(this._options.baseUrl)) != null ? _e : ((_d = yield Supplier.get(this._options.environment)) != null ? _d : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/self-hosted/distribution/credentials`
          ),
          method: "POST",
          headers: _headers,
          contentType: "application/json",
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          requestType: "json",
          body: _body,
          timeoutMs: ((_h = (_g = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _g : (_f = this._options) == null ? void 0 : _f.timeoutInSeconds) != null ? _h : 60) * 1e3,
          maxRetries: (_j = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _j : (_i = this._options) == null ? void 0 : _i.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_k = this._options) == null ? void 0 : _k.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "POST",
          "/v1/projects/{project_id}/self-hosted/distribution/credentials"
        );
      });
    }
    /**
     * Returns a set of distribution credentials for the specified project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {string} distribution_credentials_id - The UUID of the distribution credentials
     * @param {DistributionCredentialsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.selfHosted.v1.distributionCredentials.get("123456-7890-1234-5678-901234", "8b36cfd0-472f-4a21-833f-2d6343c3a2f3")
     */
    get(project_id, distribution_credentials_id, requestOptions) {
      return HttpResponsePromise.fromPromise(
        this.__get(project_id, distribution_credentials_id, requestOptions)
      );
    }
    __get(project_id, distribution_credentials_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/self-hosted/distribution/credentials/${url_exports.encodePathParam(distribution_credentials_id)}`
          ),
          method: "GET",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "GET",
          "/v1/projects/{project_id}/self-hosted/distribution/credentials/{distribution_credentials_id}"
        );
      });
    }
    /**
     * Deletes a set of distribution credentials for the specified project
     *
     * @param {string} project_id - The unique identifier of the project
     * @param {string} distribution_credentials_id - The UUID of the distribution credentials
     * @param {DistributionCredentialsClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Deepgram.BadRequestError}
     *
     * @example
     *     await client.selfHosted.v1.distributionCredentials.delete("123456-7890-1234-5678-901234", "8b36cfd0-472f-4a21-833f-2d6343c3a2f3")
     */
    delete(project_id, distribution_credentials_id, requestOptions) {
      return HttpResponsePromise.fromPromise(
        this.__delete(project_id, distribution_credentials_id, requestOptions)
      );
    }
    __delete(project_id, distribution_credentials_id, requestOptions) {
      return __async(this, null, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_a = this._options) == null ? void 0 : _a.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_b = this._options.fetcher) != null ? _b : fetcher)({
          url: url_exports.join(
            (_d = yield Supplier.get(this._options.baseUrl)) != null ? _d : ((_c = yield Supplier.get(this._options.environment)) != null ? _c : DeepgramEnvironment.Production).base,
            `v1/projects/${url_exports.encodePathParam(project_id)}/self-hosted/distribution/credentials/${url_exports.encodePathParam(distribution_credentials_id)}`
          ),
          method: "DELETE",
          headers: _headers,
          queryParameters: requestOptions == null ? void 0 : requestOptions.queryParams,
          timeoutMs: ((_g = (_f = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _f : (_e = this._options) == null ? void 0 : _e.timeoutInSeconds) != null ? _g : 60) * 1e3,
          maxRetries: (_i = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _i : (_h = this._options) == null ? void 0 : _h.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_j = this._options) == null ? void 0 : _j.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return {
            data: _response.body,
            rawResponse: _response.rawResponse
          };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(
          _response.error,
          _response.rawResponse,
          "DELETE",
          "/v1/projects/{project_id}/self-hosted/distribution/credentials/{distribution_credentials_id}"
        );
      });
    }
  };

  // src/api/resources/selfHosted/resources/v1/client/Client.ts
  var V1Client6 = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get distributionCredentials() {
      var _a;
      return (_a = this._distributionCredentials) != null ? _a : this._distributionCredentials = new DistributionCredentialsClient(this._options);
    }
  };

  // src/api/resources/selfHosted/client/Client.ts
  var SelfHostedClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get v1() {
      var _a;
      return (_a = this._v1) != null ? _a : this._v1 = new V1Client6(this._options);
    }
  };

  // src/api/resources/speak/resources/v1/resources/audio/client/Client.ts
  var AudioClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    /**
     * Convert text into natural-sounding speech using Deepgram's TTS REST API
     * @throws {@link Deepgram.BadRequestError}
     */
    generate(request, requestOptions) {
      return HttpResponsePromise.fromPromise(this.__generate(request, requestOptions));
    }
    __generate(request, requestOptions) {
      return __async(this, null, function* () {
        var _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
        const _a = request, {
          callback,
          callback_method: callbackMethod,
          mip_opt_out: mipOptOut,
          tag,
          bit_rate: bitRate,
          container,
          encoding,
          model,
          sample_rate: sampleRate
        } = _a, _body = __objRest(_a, [
          "callback",
          "callback_method",
          "mip_opt_out",
          "tag",
          "bit_rate",
          "container",
          "encoding",
          "model",
          "sample_rate"
        ]);
        const _queryParams = {
          callback,
          callback_method: callbackMethod != null ? callbackMethod : void 0,
          mip_opt_out: mipOptOut,
          tag,
          bit_rate: bitRate,
          container: container != null ? container : void 0,
          encoding: encoding != null ? encoding : void 0,
          model: model != null ? model : void 0,
          sample_rate: sampleRate
        };
        const _authRequest = yield this._options.authProvider.getAuthRequest();
        const _headers = mergeHeaders(
          _authRequest.headers,
          (_b = this._options) == null ? void 0 : _b.headers,
          requestOptions == null ? void 0 : requestOptions.headers
        );
        const _response = yield ((_c = this._options.fetcher) != null ? _c : fetcher)({
          url: url_exports.join(
            (_e = yield Supplier.get(this._options.baseUrl)) != null ? _e : ((_d = yield Supplier.get(this._options.environment)) != null ? _d : DeepgramEnvironment.Production).base,
            "v1/speak"
          ),
          method: "POST",
          headers: _headers,
          contentType: "application/json",
          queryParameters: __spreadValues(__spreadValues({}, _queryParams), requestOptions == null ? void 0 : requestOptions.queryParams),
          requestType: "json",
          body: _body,
          responseType: "binary-response",
          timeoutMs: ((_h = (_g = requestOptions == null ? void 0 : requestOptions.timeoutInSeconds) != null ? _g : (_f = this._options) == null ? void 0 : _f.timeoutInSeconds) != null ? _h : 60) * 1e3,
          maxRetries: (_j = requestOptions == null ? void 0 : requestOptions.maxRetries) != null ? _j : (_i = this._options) == null ? void 0 : _i.maxRetries,
          abortSignal: requestOptions == null ? void 0 : requestOptions.abortSignal,
          fetchFn: (_k = this._options) == null ? void 0 : _k.fetch,
          logging: this._options.logging
        });
        if (_response.ok) {
          return { data: _response.body, rawResponse: _response.rawResponse };
        }
        if (_response.error.reason === "status-code") {
          switch (_response.error.statusCode) {
            case 400:
              throw new BadRequestError(_response.error.body, _response.rawResponse);
            default:
              throw new DeepgramError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse
              });
          }
        }
        return handleNonStatusCodeError(_response.error, _response.rawResponse, "POST", "/v1/speak");
      });
    }
  };

  // src/api/resources/speak/resources/v1/client/Socket.ts
  var V1Socket3 = class {
    constructor(args) {
      this.eventHandlers = {};
      this.handleOpen = () => {
        var _a, _b;
        (_b = (_a = this.eventHandlers).open) == null ? void 0 : _b.call(_a);
      };
      this.handleMessage = (event) => {
        var _a, _b;
        const data = fromJson(event.data);
        (_b = (_a = this.eventHandlers).message) == null ? void 0 : _b.call(_a, data);
      };
      this.handleClose = (event) => {
        var _a, _b;
        (_b = (_a = this.eventHandlers).close) == null ? void 0 : _b.call(_a, event);
      };
      this.handleError = (event) => {
        var _a, _b;
        const message = event.message;
        (_b = (_a = this.eventHandlers).error) == null ? void 0 : _b.call(_a, new Error(message));
      };
      this.socket = args.socket;
      this.socket.addEventListener("open", this.handleOpen);
      this.socket.addEventListener("message", this.handleMessage);
      this.socket.addEventListener("close", this.handleClose);
      this.socket.addEventListener("error", this.handleError);
    }
    /** The current state of the connection; this is one of the readyState constants. */
    get readyState() {
      return this.socket.readyState;
    }
    /**
     * @param event - The event to attach to.
     * @param callback - The callback to run when the event is triggered.
     * Usage:
     * ```typescript
     * this.on('open', () => {
     *     console.log('The websocket is open');
     * });
     * ```
     */
    on(event, callback) {
      this.eventHandlers[event] = callback;
    }
    sendText(message) {
      this.assertSocketIsOpen();
      this.sendJson(message);
    }
    sendFlush(message) {
      this.assertSocketIsOpen();
      this.sendJson(message);
    }
    sendClear(message) {
      this.assertSocketIsOpen();
      this.sendJson(message);
    }
    sendClose(message) {
      this.assertSocketIsOpen();
      this.sendJson(message);
    }
    /** Connect to the websocket and register event handlers. */
    connect() {
      this.socket.reconnect();
      this.socket.addEventListener("open", this.handleOpen);
      this.socket.addEventListener("message", this.handleMessage);
      this.socket.addEventListener("close", this.handleClose);
      this.socket.addEventListener("error", this.handleError);
      return this;
    }
    /** Close the websocket and unregister event handlers. */
    close() {
      this.socket.close();
      this.handleClose({ code: 1e3 });
      this.socket.removeEventListener("open", this.handleOpen);
      this.socket.removeEventListener("message", this.handleMessage);
      this.socket.removeEventListener("close", this.handleClose);
      this.socket.removeEventListener("error", this.handleError);
    }
    /** Returns a promise that resolves when the websocket is open. */
    waitForOpen() {
      return __async(this, null, function* () {
        if (this.socket.readyState === ReconnectingWebSocket.OPEN) {
          return this.socket;
        }
        return new Promise((resolve, reject) => {
          this.socket.addEventListener("open", () => {
            resolve(this.socket);
          });
          this.socket.addEventListener("error", (event) => {
            reject(event);
          });
        });
      });
    }
    /** Asserts that the websocket is open. */
    assertSocketIsOpen() {
      if (!this.socket) {
        throw new Error("Socket is not connected.");
      }
      if (this.socket.readyState !== ReconnectingWebSocket.OPEN) {
        throw new Error("Socket is not open.");
      }
    }
    /** Send a binary payload to the websocket. */
    sendBinary(payload) {
      this.socket.send(payload);
    }
    /** Send a JSON payload to the websocket. */
    sendJson(payload) {
      const jsonPayload = toJson(payload);
      this.socket.send(jsonPayload);
    }
  };

  // src/api/resources/speak/resources/v1/client/Client.ts
  var V1Client7 = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get audio() {
      var _a;
      return (_a = this._audio) != null ? _a : this._audio = new AudioClient(this._options);
    }
    connect(args) {
      return __async(this, null, function* () {
        var _a, _b;
        const {
          encoding,
          mip_opt_out: mipOptOut,
          model,
          sample_rate: sampleRate,
          headers,
          debug,
          reconnectAttempts
        } = args;
        const _queryParams = {
          encoding,
          mip_opt_out: mipOptOut,
          model,
          sample_rate: sampleRate
        };
        const _headers = mergeHeaders(
          mergeOnlyDefinedHeaders({ Authorization: args.Authorization }),
          headers
        );
        const socket = new ReconnectingWebSocket({
          url: url_exports.join(
            (_b = yield Supplier.get(this._options.baseUrl)) != null ? _b : ((_a = yield Supplier.get(this._options.environment)) != null ? _a : DeepgramEnvironment.Production).production,
            "/v1/speak"
          ),
          protocols: [],
          queryParameters: _queryParams,
          headers: _headers,
          options: { debug: debug != null ? debug : false, maxRetries: reconnectAttempts != null ? reconnectAttempts : 30 }
        });
        return new V1Socket3({ socket });
      });
    }
  };

  // src/api/resources/speak/client/Client.ts
  var SpeakClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get v1() {
      var _a;
      return (_a = this._v1) != null ? _a : this._v1 = new V1Client7(this._options);
    }
  };

  // src/Client.ts
  var DeepgramClient = class {
    constructor(options = {}) {
      this._options = normalizeClientOptionsWithAuth(options);
    }
    get agent() {
      var _a;
      return (_a = this._agent) != null ? _a : this._agent = new AgentClient(this._options);
    }
    get auth() {
      var _a;
      return (_a = this._auth) != null ? _a : this._auth = new AuthClient(this._options);
    }
    get listen() {
      var _a;
      return (_a = this._listen) != null ? _a : this._listen = new ListenClient(this._options);
    }
    get manage() {
      var _a;
      return (_a = this._manage) != null ? _a : this._manage = new ManageClient(this._options);
    }
    get read() {
      var _a;
      return (_a = this._read) != null ? _a : this._read = new ReadClient(this._options);
    }
    get selfHosted() {
      var _a;
      return (_a = this._selfHosted) != null ? _a : this._selfHosted = new SelfHostedClient(this._options);
    }
    get speak() {
      var _a;
      return (_a = this._speak) != null ? _a : this._speak = new SpeakClient(this._options);
    }
  };

  // src/CustomClient.ts
  var DEFAULT_CONNECTION_TIMEOUT_MS = 1e4;
  var NodeWebSocket2;
  try {
    NodeWebSocket2 = require_browser();
    NodeWebSocket2 = NodeWebSocket2.WebSocket || NodeWebSocket2.default || NodeWebSocket2;
  } catch (e) {
    NodeWebSocket2 = void 0;
  }
  function generateUUID() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    if (RUNTIME.type === "node") {
      try {
        const nodeCrypto = __require("crypto");
        return nodeCrypto.randomUUID();
      } catch (e) {
      }
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  }
  var ApiKeyAuthProviderWrapper = class {
    constructor(originalProvider) {
      this.originalProvider = originalProvider;
    }
    getAuthRequest(arg) {
      return __async(this, null, function* () {
        var _a, _b;
        const authRequest = yield this.originalProvider.getAuthRequest(arg);
        const authHeader = ((_a = authRequest.headers) == null ? void 0 : _a.Authorization) || ((_b = authRequest.headers) == null ? void 0 : _b.authorization);
        if (authHeader && typeof authHeader === "string") {
          if (!authHeader.startsWith("Bearer ") && !authHeader.startsWith("Token ") && !authHeader.startsWith("token ")) {
            return {
              headers: __spreadProps(__spreadValues({}, authRequest.headers), {
                Authorization: `Token ${authHeader}`
              })
            };
          }
        }
        return authRequest;
      });
    }
  };
  var AccessTokenAuthProviderWrapper = class {
    constructor(originalProvider, accessToken) {
      this.originalProvider = originalProvider;
      this.accessToken = accessToken;
    }
    getAuthRequest(arg) {
      return __async(this, null, function* () {
        var _a, _b;
        const accessToken = (_b = yield Supplier.get(this.accessToken)) != null ? _b : (_a = process.env) == null ? void 0 : _a.DEEPGRAM_ACCESS_TOKEN;
        if (accessToken != null) {
          return {
            headers: { Authorization: `Bearer ${accessToken}` }
          };
        }
        return this.originalProvider.getAuthRequest(arg);
      });
    }
  };
  var CustomDeepgramClient = class extends DeepgramClient {
    constructor(options = {}) {
      const sessionId = generateUUID();
      const optionsWithSessionId = __spreadProps(__spreadValues({}, options), {
        headers: __spreadProps(__spreadValues({}, options.headers), {
          "x-deepgram-session-id": sessionId
        })
      });
      super(optionsWithSessionId);
      this._sessionId = sessionId;
      this._options.authProvider = new ApiKeyAuthProviderWrapper(this._options.authProvider);
      if (options.accessToken != null) {
        this._options.authProvider = new AccessTokenAuthProviderWrapper(
          this._options.authProvider,
          options.accessToken
        );
      }
    }
    /**
     * Get the session ID that was generated for this client instance.
     */
    get sessionId() {
      return this._sessionId;
    }
    /**
     * Override the agent getter to return a wrapped client that ensures
     * the custom websocket implementation is used.
     */
    get agent() {
      if (!this._customAgent) {
        this._customAgent = new WrappedAgentClient(this._options);
      }
      return this._customAgent;
    }
    /**
     * Override the listen getter to return a wrapped client that ensures
     * the custom websocket implementation is used.
     */
    get listen() {
      if (!this._customListen) {
        this._customListen = new WrappedListenClient(this._options);
      }
      return this._customListen;
    }
    /**
     * Override the speak getter to return a wrapped client that ensures
     * the custom websocket implementation is used.
     */
    get speak() {
      if (!this._customSpeak) {
        this._customSpeak = new WrappedSpeakClient(this._options);
      }
      return this._customSpeak;
    }
  };
  var WrappedAgentClient = class extends AgentClient {
    get v1() {
      return new WrappedAgentV1Client(this._options);
    }
  };
  var WrappedListenClient = class extends ListenClient {
    get v1() {
      return new WrappedListenV1Client(this._options);
    }
    get v2() {
      return new WrappedListenV2Client(this._options);
    }
  };
  var WrappedSpeakClient = class extends SpeakClient {
    get v1() {
      return new WrappedSpeakV1Client(this._options);
    }
  };
  function resolveHeaders(headers) {
    return __async(this, null, function* () {
      const resolved = {};
      for (const [key, value] of Object.entries(headers)) {
        if (value == null) {
          continue;
        }
        const resolvedValue = yield Supplier.get(value);
        if (resolvedValue != null) {
          resolved[key] = resolvedValue;
        }
      }
      return resolved;
    });
  }
  function getWebSocketOptions(headers) {
    const options = {};
    const isBrowser = RUNTIME.type === "browser" || RUNTIME.type === "web-worker";
    const sessionIdHeader = headers["x-deepgram-session-id"] || headers["X-Deepgram-Session-Id"];
    if (RUNTIME.type === "node" && NodeWebSocket2) {
      options.WebSocket = NodeWebSocket2;
      options.headers = headers;
    } else if (isBrowser) {
      const authHeader = headers.Authorization || headers.authorization;
      const browserHeaders = __spreadValues({}, headers);
      delete browserHeaders.Authorization;
      delete browserHeaders.authorization;
      delete browserHeaders["x-deepgram-session-id"];
      delete browserHeaders["X-Deepgram-Session-Id"];
      options.headers = browserHeaders;
      const protocols = [];
      if (authHeader && typeof authHeader === "string") {
        if (authHeader.startsWith("Token ")) {
          const apiKey = authHeader.substring(6);
          protocols.push("token", apiKey);
        } else if (authHeader.startsWith("Bearer ")) {
          const token = authHeader.substring(7);
          protocols.push("bearer", token);
        } else {
          protocols.push(authHeader);
        }
      }
      if (sessionIdHeader && typeof sessionIdHeader === "string") {
        protocols.push("x-deepgram-session-id", sessionIdHeader);
      }
      if (protocols.length > 0) {
        options.protocols = protocols;
      }
    } else {
      options.headers = headers;
    }
    return options;
  }
  function setupBinaryHandling(socket, eventHandlers) {
    var _a;
    const binaryAwareHandler = (event) => {
      var _a2, _b, _c;
      if (typeof event.data === "string") {
        try {
          const data = fromJson(event.data);
          (_a2 = eventHandlers.message) == null ? void 0 : _a2.call(eventHandlers, data);
        } catch (error) {
          (_b = eventHandlers.message) == null ? void 0 : _b.call(eventHandlers, event.data);
        }
      } else {
        (_c = eventHandlers.message) == null ? void 0 : _c.call(eventHandlers, event.data);
      }
    };
    const socketAny = socket;
    if ((_a = socketAny._listeners) == null ? void 0 : _a.message) {
      socketAny._listeners.message.forEach((listener) => {
        socket.removeEventListener("message", listener);
      });
    }
    socket.addEventListener("message", binaryAwareHandler);
    return binaryAwareHandler;
  }
  function preventDuplicateEventListeners(socket, handlers) {
    if (handlers.handleOpen) {
      socket.removeEventListener("open", handlers.handleOpen);
    }
    if (handlers.handleMessage) {
      socket.removeEventListener("message", handlers.handleMessage);
    }
    if (handlers.handleClose) {
      socket.removeEventListener("close", handlers.handleClose);
    }
    if (handlers.handleError) {
      socket.removeEventListener("error", handlers.handleError);
    }
  }
  function resetSocketConnectionState(socket) {
    if (socket.readyState === socket.CLOSED) {
      socket._connectLock = false;
      socket._shouldReconnect = true;
    }
  }
  function createWebSocketConnection(_0) {
    return __async(this, arguments, function* ({
      options,
      urlPath,
      environmentKey,
      queryParams,
      headers,
      debug,
      reconnectAttempts
    }) {
      var _a, _b, _c, _d, _e, _f;
      const authRequest = yield (_a = options.authProvider) == null ? void 0 : _a.getAuthRequest();
      const mergedHeaders = mergeHeaders(
        (_b = options.headers) != null ? _b : {},
        (_c = authRequest == null ? void 0 : authRequest.headers) != null ? _c : {},
        headers
      );
      const _headers = yield resolveHeaders(mergedHeaders);
      const wsOptions = getWebSocketOptions(_headers);
      const baseUrl = (_e = yield Supplier.get(options.baseUrl)) != null ? _e : ((_d = yield Supplier.get(options.environment)) != null ? _d : DeepgramEnvironment.Production)[environmentKey];
      return new ReconnectingWebSocket({
        url: url_exports.join(baseUrl, urlPath),
        protocols: (_f = wsOptions.protocols) != null ? _f : [],
        queryParameters: queryParams,
        headers: wsOptions.headers,
        options: {
          WebSocket: wsOptions.WebSocket,
          debug: debug != null ? debug : false,
          maxRetries: reconnectAttempts != null ? reconnectAttempts : 30,
          startClosed: true,
          connectionTimeout: DEFAULT_CONNECTION_TIMEOUT_MS
        }
      });
    });
  }
  var WrappedAgentV1Client = class extends V1Client {
    connect() {
      return __async(this, arguments, function* (args = {}) {
        const { headers, debug, reconnectAttempts } = args;
        const socket = yield createWebSocketConnection({
          options: this._options,
          urlPath: "/v1/agent/converse",
          environmentKey: "agent",
          queryParams: {},
          headers,
          debug,
          reconnectAttempts
        });
        return new WrappedAgentV1Socket({ socket });
      });
    }
    /**
     * Creates a WebSocket connection object without actually connecting.
     * This is an alias for connect() with clearer naming - the returned socket
     * is not connected until you call socket.connect().
     *
     * Usage:
     * ```typescript
     * const socket = await client.agent.v1.createConnection();
     * socket.on('open', () => console.log('Connected!'));
     * socket.on('message', (msg) => console.log('Message:', msg));
     * socket.connect(); // Actually initiates the connection
     * ```
     */
    createConnection() {
      return __async(this, arguments, function* (args = {}) {
        return this.connect(args);
      });
    }
  };
  var WrappedAgentV1Socket = class extends V1Socket {
    constructor(args) {
      super(args);
      this.setupBinaryHandling();
    }
    setupBinaryHandling() {
      this.binaryAwareHandler = setupBinaryHandling(this.socket, this.eventHandlers);
    }
    connect() {
      const socketAny = this;
      preventDuplicateEventListeners(this.socket, {
        handleOpen: socketAny.handleOpen,
        handleMessage: socketAny.handleMessage,
        handleClose: socketAny.handleClose,
        handleError: socketAny.handleError
      });
      resetSocketConnectionState(this.socket);
      super.connect();
      this.setupBinaryHandling();
      return this;
    }
  };
  var WrappedListenV1Client = class extends V1Client3 {
    connect(args) {
      return __async(this, null, function* () {
        const {
          callback,
          callback_method: callbackMethod,
          channels,
          diarize,
          dictation,
          encoding,
          endpointing,
          extra,
          interim_results: interimResults,
          keyterm,
          keywords,
          language,
          mip_opt_out: mipOptOut,
          model,
          multichannel,
          numerals,
          profanity_filter: profanityFilter,
          punctuate,
          redact,
          replace,
          sample_rate: sampleRate,
          search,
          smart_format: smartFormat,
          tag,
          utterance_end_ms: utteranceEndMs,
          vad_events: vadEvents,
          version,
          headers,
          debug,
          reconnectAttempts
        } = args;
        const _queryParams = {};
        if (callback != null) _queryParams.callback = callback;
        if (callbackMethod != null) _queryParams.callback_method = callbackMethod;
        if (channels != null) _queryParams.channels = channels;
        if (diarize != null) _queryParams.diarize = diarize;
        if (dictation != null) _queryParams.dictation = dictation;
        if (encoding != null) _queryParams.encoding = encoding;
        if (endpointing != null) _queryParams.endpointing = endpointing;
        if (extra != null) _queryParams.extra = extra;
        if (interimResults != null) _queryParams.interim_results = interimResults;
        if (keyterm != null) _queryParams.keyterm = keyterm;
        if (keywords != null) _queryParams.keywords = keywords;
        if (language != null) _queryParams.language = language;
        if (mipOptOut != null) _queryParams.mip_opt_out = mipOptOut;
        _queryParams.model = model;
        if (multichannel != null) _queryParams.multichannel = multichannel;
        if (numerals != null) _queryParams.numerals = numerals;
        if (profanityFilter != null) _queryParams.profanity_filter = profanityFilter;
        if (punctuate != null) _queryParams.punctuate = punctuate;
        if (redact != null) _queryParams.redact = redact;
        if (replace != null) _queryParams.replace = replace;
        if (sampleRate != null) _queryParams.sample_rate = sampleRate;
        if (search != null) _queryParams.search = search;
        if (smartFormat != null) _queryParams.smart_format = smartFormat;
        if (tag != null) _queryParams.tag = tag;
        if (utteranceEndMs != null) _queryParams.utterance_end_ms = utteranceEndMs;
        if (vadEvents != null) _queryParams.vad_events = vadEvents;
        if (version != null) _queryParams.version = version;
        const socket = yield createWebSocketConnection({
          options: this._options,
          urlPath: "/v1/listen",
          environmentKey: "production",
          queryParams: _queryParams,
          headers,
          debug,
          reconnectAttempts
        });
        return new WrappedListenV1Socket({ socket });
      });
    }
    /**
     * Creates a WebSocket connection object without actually connecting.
     * This is an alias for connect() with clearer naming - the returned socket
     * is not connected until you call socket.connect().
     *
     * Usage:
     * ```typescript
     * const socket = await client.listen.v1.createConnection({ model: 'nova-3' });
     * socket.on('open', () => console.log('Connected!'));
     * socket.on('message', (msg) => console.log('Transcript:', msg));
     * socket.connect(); // Actually initiates the connection
     * ```
     */
    createConnection(args) {
      return __async(this, null, function* () {
        return this.connect(args);
      });
    }
  };
  var WrappedListenV1Socket = class extends V1Socket2 {
    constructor(args) {
      super(args);
      this.setupBinaryHandling();
    }
    setupBinaryHandling() {
      this.binaryAwareHandler = setupBinaryHandling(this.socket, this.eventHandlers);
    }
    connect() {
      const socketAny = this;
      preventDuplicateEventListeners(this.socket, {
        handleOpen: socketAny.handleOpen,
        handleMessage: socketAny.handleMessage,
        handleClose: socketAny.handleClose,
        handleError: socketAny.handleError
      });
      resetSocketConnectionState(this.socket);
      super.connect();
      this.setupBinaryHandling();
      return this;
    }
  };
  var WrappedListenV2Client = class extends V2Client {
    connect(args) {
      return __async(this, null, function* () {
        const {
          model,
          encoding,
          sample_rate: sampleRate,
          eager_eot_threshold: eagerEotThreshold,
          eot_threshold: eotThreshold,
          eot_timeout_ms: eotTimeoutMs,
          keyterm,
          mip_opt_out: mipOptOut,
          tag,
          headers,
          debug,
          reconnectAttempts
        } = args;
        const _queryParams = {};
        _queryParams.model = model;
        if (encoding != null) _queryParams.encoding = encoding;
        if (sampleRate != null) _queryParams.sample_rate = sampleRate;
        if (eagerEotThreshold != null) _queryParams.eager_eot_threshold = eagerEotThreshold;
        if (eotThreshold != null) _queryParams.eot_threshold = eotThreshold;
        if (eotTimeoutMs != null) _queryParams.eot_timeout_ms = eotTimeoutMs;
        if (keyterm != null) _queryParams.keyterm = keyterm;
        if (mipOptOut != null) _queryParams.mip_opt_out = mipOptOut;
        if (tag != null) _queryParams.tag = tag;
        const socket = yield createWebSocketConnection({
          options: this._options,
          urlPath: "/v2/listen",
          environmentKey: "production",
          queryParams: _queryParams,
          headers,
          debug,
          reconnectAttempts
        });
        return new WrappedListenV2Socket({ socket });
      });
    }
    /**
     * Creates a WebSocket connection object without actually connecting.
     * This is an alias for connect() with clearer naming - the returned socket
     * is not connected until you call socket.connect().
     *
     * Usage:
     * ```typescript
     * const socket = await client.listen.v2.createConnection({ model: 'flux-general-en' });
     * socket.on('open', () => console.log('Connected!'));
     * socket.on('message', (msg) => console.log('Transcript:', msg));
     * socket.connect(); // Actually initiates the connection
     * ```
     */
    createConnection(args) {
      return __async(this, null, function* () {
        return this.connect(args);
      });
    }
  };
  var WrappedListenV2Socket = class extends V2Socket {
    constructor(args) {
      super(args);
      this.setupBinaryHandling();
    }
    setupBinaryHandling() {
      this.binaryAwareHandler = setupBinaryHandling(this.socket, this.eventHandlers);
    }
    connect() {
      const socketAny = this;
      preventDuplicateEventListeners(this.socket, {
        handleOpen: socketAny.handleOpen,
        handleMessage: socketAny.handleMessage,
        handleClose: socketAny.handleClose,
        handleError: socketAny.handleError
      });
      resetSocketConnectionState(this.socket);
      super.connect();
      this.setupBinaryHandling();
      return this;
    }
    /**
     * Send a WebSocket ping frame to keep the connection alive.
     *
     * In Node.js, this uses the native WebSocket ping() method from the 'ws' library.
     * In browsers, WebSocket ping/pong is handled automatically by the browser and
     * cannot be manually triggered, so this method will throw an error.
     *
     * @param data Optional data to send with the ping (Node.js only)
     * @throws Error if not in Node.js environment or WebSocket is not connected
     */
    ping(data) {
      const ws = this.socket._ws;
      if (!ws) {
        throw new Error("WebSocket is not connected. Call connect() and waitForOpen() first.");
      }
      if (ws.readyState !== ws.OPEN) {
        throw new Error("WebSocket is not in OPEN state.");
      }
      if (RUNTIME.type === "node" && typeof ws.ping === "function") {
        ws.ping(data);
      } else {
        throw new Error(
          "WebSocket ping is not supported in browser environments. Browser WebSocket connections handle ping/pong automatically. If you need keepalive in the browser, consider sending periodic audio data or using a timer."
        );
      }
    }
  };
  var WrappedSpeakV1Client = class extends V1Client7 {
    connect(args) {
      return __async(this, null, function* () {
        const {
          encoding,
          mip_opt_out: mipOptOut,
          model,
          sample_rate: sampleRate,
          headers,
          debug,
          reconnectAttempts
        } = args;
        const _queryParams = {};
        if (encoding != null) _queryParams.encoding = encoding;
        if (mipOptOut != null) _queryParams.mip_opt_out = mipOptOut;
        if (model != null) _queryParams.model = model;
        if (sampleRate != null) _queryParams.sample_rate = sampleRate;
        const socket = yield createWebSocketConnection({
          options: this._options,
          urlPath: "/v1/speak",
          environmentKey: "production",
          queryParams: _queryParams,
          headers,
          debug,
          reconnectAttempts
        });
        return new WrappedSpeakV1Socket({ socket });
      });
    }
    /**
     * Creates a WebSocket connection object without actually connecting.
     * This is an alias for connect() with clearer naming - the returned socket
     * is not connected until you call socket.connect().
     *
     * Usage:
     * ```typescript
     * const socket = await client.speak.v1.createConnection({ model: 'aura-asteria-en' });
     * socket.on('open', () => console.log('Connected!'));
     * socket.on('message', (audioData) => console.log('Audio received'));
     * socket.connect(); // Actually initiates the connection
     * ```
     */
    createConnection(args) {
      return __async(this, null, function* () {
        return this.connect(args);
      });
    }
  };
  var WrappedSpeakV1Socket = class extends V1Socket3 {
    constructor(args) {
      super(args);
      this.setupBinaryHandling();
    }
    setupBinaryHandling() {
      this.binaryAwareHandler = setupBinaryHandling(this.socket, this.eventHandlers);
    }
    connect() {
      const socketAny = this;
      preventDuplicateEventListeners(this.socket, {
        handleOpen: socketAny.handleOpen,
        handleMessage: socketAny.handleMessage,
        handleClose: socketAny.handleClose,
        handleError: socketAny.handleError
      });
      resetSocketConnectionState(this.socket);
      super.connect();
      this.setupBinaryHandling();
      return this;
    }
  };

  // src/core/logging/exports.ts
  var logging;
  ((logging2) => {
    logging2.LogLevel = LogLevel;
    logging2.ConsoleLogger = ConsoleLogger;
  })(logging || (logging = {}));
  return __toCommonJS(index_exports);
})();

// Expose Deepgram as global for browser compatibility
if (typeof window !== 'undefined') {
  window.Deepgram = Deepgram;
  window.deepgram = Deepgram;
}
