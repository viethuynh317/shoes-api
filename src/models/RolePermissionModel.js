import { Schema, model } from "mongoose";
const rolePermissionSchema = Schema({
  roleId: {
    type: Number,
    required: true,
  },
  permissionId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});
export const RolePermission = model(
  "RolePermission",
  rolePermissionSchema,
  "RolePermission"
);
