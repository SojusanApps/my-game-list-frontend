import { StatusEnum } from "../client";


export default function code_to_value_mapping () {
  return [
    { code: StatusEnum.C, value: "Completed" },
    { code: StatusEnum.PTP, value: "Plan to Play" },
    { code: StatusEnum.P, value: "Playing" },
    { code: StatusEnum.D, value: "Dropped" },
    { code: StatusEnum.OH, value: "On Hold" },
  ];
};
