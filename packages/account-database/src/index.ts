import { OauthAgreedScopeEntity } from "./entities/agreed_scopes.entity";
import { OauthApplicationEntity } from "./entities/application.entity";
import { OauthConnectEntity } from "./entities/connect.entity";
import { OauthRequireScopeEntity } from "./entities/require_scope.entity";
import { OauthScopeEntity } from "./entities/scope.entity";
import { UserEntity } from "./entities/user.entity";

export * from "./entities/agreed_scopes.entity";
export * from "./entities/application.entity";
export * from "./entities/connect.entity";
export * from "./entities/require_scope.entity";
export * from "./entities/scope.entity";
export * from "./entities/user.entity";

export const AUTHKIT_ENTITIES = [
  OauthAgreedScopeEntity,
  OauthApplicationEntity,
  OauthConnectEntity,
  OauthRequireScopeEntity,
  OauthScopeEntity,
  UserEntity,
];
