import { UUID } from "crypto";

export type Tenant = {
  id: UUID;
  identifier: string;
}
