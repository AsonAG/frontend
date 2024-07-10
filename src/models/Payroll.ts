import { UUID } from "crypto";

export type Payroll = {
  id: UUID;
  name: string;
  divisionId: UUID;
}
