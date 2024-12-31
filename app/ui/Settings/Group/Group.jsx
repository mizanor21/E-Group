import React from "react";
import GroupTable from "./GroupTable";
import { useGroupData } from "@/app/data/DataFetch";

export default function Group() {
  const { data: group } = useGroupData([]);
  return <GroupTable groupsData={group} />;
}
