import { getStatusConfig } from "./statusConfig";
import { StatusEnum } from "@/client";

export default function code_to_value_mapping() {
  return Object.values(StatusEnum).map(code => {
    const config = getStatusConfig(code);
    return {
      code,
      value: config ? `${config.emoji} ${config.label}` : code,
    };
  });
}
