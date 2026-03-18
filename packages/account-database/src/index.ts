import { OauthAgreedScopeEntity } from "./entities/agreed_scopes.entity.js";
import { OauthApplicationEntity } from "./entities/application.entity.js";
import { OauthConnectEntity } from "./entities/connect.entity.js";
import { OauthRequireScopeEntity } from "./entities/require_scope.entity.js";
import { OauthScopeEntity } from "./entities/scope.entity.js";
import { UserEntity } from "./entities/user.entity.js";
import { OauthRedirectURIEntity } from "./entities/redirect_uri.entity.js";

export * from "./entities/agreed_scopes.entity.js";
export * from "./entities/application.entity.js";
export * from "./entities/connect.entity.js";
export * from "./entities/require_scope.entity.js";
export * from "./entities/scope.entity.js";
export * from "./entities/user.entity.js";
export * from "./entities/redirect_uri.entity.js";

export const AUTHKIT_ENTITIES = [
  OauthAgreedScopeEntity,
  OauthApplicationEntity,
  OauthConnectEntity,
  OauthRequireScopeEntity,
  OauthScopeEntity,
  UserEntity,
  OauthRedirectURIEntity,
];
