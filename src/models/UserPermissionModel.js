import { Schema, model } from "mongoose";
const userPermissionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  permissionId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});
export const UserPermission = model(
  "UserPermission",
  userPermissionSchema,
  "UserPermission"
);
